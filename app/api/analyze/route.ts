import { createAdminClient, createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tavily, TavilyCrawlResponse } from '@tavily/core';

type CompetitorAnalysisResult = {
  domain: string;
  analysis: string;
  tavilyData?: TavilyCrawlResponse | null;
  timestamp: Date;
};

// Schema validation for the domain
const domainSchema = z.object({
  domain: z.string().url('Invalid domain format. Must be a valid URL.')
});

// Environment variables for API keys
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);



export async function POST(request: NextRequest) {
  try {
    // Check if API keys are configured
    if (!TAVILY_API_KEY) {
      return NextResponse.json(
        { error: 'Tavily API key not configured' },
        { status: 500 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Use regular client for authentication
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = domainSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid domain format', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { domain } = validationResult.data;
    
    console.log("Authenticated user:", user.email);
    console.log("Domain to analyze:", domain);

    // Get admin client to bypass RLS policies
    const adminClient = await createAdminClient();

    // Create initial analysis record with pending status
    const { data: analysisData, error: insertError } = await adminClient
      .from("analysis")
      .insert({
        user_id: user.id,
        url: domain,
        status: "processing", // Changed from 'pending' to 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting analysis record:", insertError);
      return NextResponse.json(
        { error: "Failed to create analysis record" },
        { status: 500 }
      );
    }

    // Check if the domain is accessible
    try {
      const domainCheck = await axios.head(domain, { 
        timeout: 5000,
        validateStatus: () => true // Accept any status code to handle it ourselves
      });
      
      if (domainCheck.status < 200 || domainCheck.status >= 300) {
        // Update analysis record with error status
        await adminClient
          .from("analysis")
          .update({
            status: "failed",
            summary: `Error: Domain returned non-success status code: ${domainCheck.status}`
          })
          .eq("id", analysisData.id);

        return NextResponse.json(
          { error: `Domain returned non-success status code: ${domainCheck.status}`, analysisId: analysisData.id },
          { status: 400 }
        );
      }
    } catch (error) {
      // Update analysis record with error status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          summary: `Error: Failed to access domain: ${error instanceof Error ? error.message : String(error)}`
        })
        .eq("id", analysisData.id);

      return NextResponse.json(
        { error: `Failed to access domain: ${error instanceof Error ? error.message : String(error)}`, analysisId: analysisData.id },
        { status: 400 }
      );
    }

    // Use Tavily API to crawl the website
    let tavilyResponse: TavilyCrawlResponse | null = null;
    
    try {
      console.log('Calling Tavily API to crawl domain:', domain);
      const tvly = tavily({ apiKey: TAVILY_API_KEY });
      tavilyResponse = await tvly.crawl(domain, { 
        instructions: "Focus on company overview, mission statement, product offerings, recent news, new product launches, flagship products, regulatory compliance, terms of service, privacy policy, and company direction. Look for information about strategic initiatives, market positioning, and unique selling points." 
      });
      console.log('Tavily API response received');
    } catch (error) {
      console.error('Tavily API error:', error);
      
      // Check if it's a 422 error (website unsupported by Tavily)
      if (error instanceof Error && error.message.includes('422')) {
        // Mark as unsupported rather than failed
        await adminClient
          .from("analysis")
          .update({
            status: "unsupported",
            summary: `Website unsupported: This website cannot be analyzed by our crawler. It may have anti-bot measures or other technical limitations.`
          })
          .eq("id", analysisData.id);

        return NextResponse.json(
          { error: `Website unsupported: This website cannot be analyzed by our crawler.`, analysisId: analysisData.id },
          { status: 422 }
        );
      }
      
      // For other errors, update analysis record with failed status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          summary: `Error: Tavily API error: ${error instanceof Error ? error.message : String(error)}`
        })
        .eq("id", analysisData.id);

      return NextResponse.json(
        { error: `Tavily API error: ${error instanceof Error ? error.message : String(error)}`, analysisId: analysisData.id },
        { status: 500 }
      );
    }
    
    if (!tavilyResponse) {
      // Update analysis record with error status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          summary: 'Error: No data returned from Tavily API'
        })
        .eq("id", analysisData.id);

      return NextResponse.json(
        { error: 'No data returned from Tavily API', analysisId: analysisData.id },
        { status: 500 }
      );
    }
    
    // Process with Gemini API
    let geminiResponse: string;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      console.log('Calling Gemini API for analysis');
      
      // Limit Tavily results to maximum 5 items to reduce token usage
      let limitedResponse = { ...tavilyResponse } as any;
      
      // Check if results array exists and limit it to 5 items
      if (limitedResponse && Array.isArray(limitedResponse.results)) {
        const originalCount = limitedResponse.results.length;
        limitedResponse.results = limitedResponse.results.slice(0, 10);
        console.log(`Limited Tavily results from ${originalCount} to ${limitedResponse.results.length} items`);
      }
      
      const prompt = `
      Analyze the following information about a company website:
      
      ${JSON.stringify(limitedResponse, null, 2)}
      
      Please provide a detailed analysis with the following EXACT sections. You MUST format your response EXACTLY as shown below, with each section clearly labeled with the exact heading followed by a colon:
      
      SUMMARY: A concise summary of what the company does and its main offerings.
      
      COMPANY DIRECTION: The current direction and focus of the company, including strategic initiatives and market positioning.
      
      REGULATORY COMPLIANCE: Any compliance posture, legal considerations, or regulatory details mentioned.
      
      NEW LAUNCHES: Any new product launches, services, or initiatives mentioned.
      
      FLAGSHIP PRODUCTS: The main products or services that appear to be the company's flagship offerings.
      
      UNIQUE FINDINGS: Other interesting or unique findings about the company that don't fit into the above categories.
           
	  SENTIMENT: A brief assessment of the overall sentiment and tone of the company's communications.

      IMPORTANT: Format each section EXACTLY with the heading name followed by a colon, then the content. Each section must start with the exact heading name as specified above. Separate each section with two newlines. Do not add any additional headings or sections. No bullet points or other formatting.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      geminiResponse = response.text();
      console.log('Gemini API response received');
      console.log('Gemini response content:', geminiResponse);
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Update analysis record with error status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          summary: `Error: Gemini API error: ${error instanceof Error ? error.message : String(error)}`
        })
        .eq("id", analysisData.id);

      return NextResponse.json(
        { error: `Gemini API error: ${error instanceof Error ? error.message : String(error)}`, analysisId: analysisData.id },
        { status: 500 }
      );
    }
    
    // Parse the Gemini response to extract structured data
    const extractSection = (text: string, sectionName: string): string => {
      // Simple direct approach: find the section name, then capture everything until the next section or end
      const sectionStart = text.indexOf(sectionName + ':');
      
      if (sectionStart === -1) {
        console.log(`Section not found: ${sectionName}`);
        return '';
      }
      
      // Find the start of the content (after the section name and colon)
      const contentStart = sectionStart + sectionName.length + 1;
      
      // Find the next section (if any)
      const nextSectionMatch = text.slice(contentStart).match(/\n\n[A-Z][A-Z ]+:/i);
      const contentEnd = nextSectionMatch && nextSectionMatch.index !== undefined
        ? contentStart + nextSectionMatch.index 
        : text.length;
      
      // Extract and clean the content
      const content = text.slice(contentStart, contentEnd).trim();
      console.log(`Extracted ${sectionName}: ${content.substring(0, 50)}...`);
      
      return content;
    };
    
    // Extract each section from the Gemini response
    const summary = extractSection(geminiResponse, 'SUMMARY');
    const direction = extractSection(geminiResponse, 'COMPANY DIRECTION');
    const compliance = extractSection(geminiResponse, 'REGULATORY COMPLIANCE');
    const newLaunches = extractSection(geminiResponse, 'NEW LAUNCHES');
    const flagshipProduct = extractSection(geminiResponse, 'FLAGSHIP PRODUCTS');
    const uniqueFindings = extractSection(geminiResponse, 'UNIQUE FINDINGS');
    const sentimentSummary = extractSection(geminiResponse, 'SENTIMENT');

    console.log('Extracted structured data from Gemini response');
    console.log('SUMMARY:', summary || 'Not found');
    console.log('COMPANY DIRECTION:', direction || 'Not found');
    console.log('REGULATORY COMPLIANCE:', compliance || 'Not found');
    console.log('NEW LAUNCHES:', newLaunches || 'Not found');
    console.log('FLAGSHIP PRODUCTS:', flagshipProduct || 'Not found');
    console.log('UNIQUE FINDINGS:', uniqueFindings || 'Not found');
	console.log('SENTIMENT:', sentimentSummary || 'Not found');
    
    // Create analysis result object
    const analysisResult: CompetitorAnalysisResult = {
      domain,
      analysis: geminiResponse,
      tavilyData: tavilyResponse,
      timestamp: new Date()
    };
    
    // Update the analysis record with completed status and structured results
    const { error: updateError } = await adminClient
      .from("analysis")
      .update({
        status: "completed",
        summary,
        direction,
        compliance,
        new_launches: newLaunches,
        flagship_product: flagshipProduct,
        unique_findings: uniqueFindings,
		sentiment_summary: sentimentSummary,
        completed_at: new Date().toISOString()
      })
      .eq("id", analysisData.id);

    if (updateError) {
      console.error("Error updating analysis record:", updateError);
      return NextResponse.json(
        { error: "Analysis completed but failed to update record", analysisId: analysisData.id },
        { status: 500 }
      );
    }
    
    console.log('Analysis complete for domain:', domain);
    
    return NextResponse.json({
      message: "Analysis completed successfully",
      domain,
      analysisId: analysisData.id,
      analysis: geminiResponse,
      timestamp: analysisResult.timestamp
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
