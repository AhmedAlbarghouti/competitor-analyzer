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
            result: JSON.stringify({ error: `Domain returned non-success status code: ${domainCheck.status}` })
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
          result: JSON.stringify({ error: `Failed to access domain: ${error instanceof Error ? error.message : String(error)}` })
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
        instructions: "news, latest products, compliance documents, and terms of service" 
      });
      console.log('Tavily API response received');
    } catch (error) {
      console.error('Tavily API error:', error);
      
      // Update analysis record with error status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          result: JSON.stringify({ error: `Tavily API error: ${error instanceof Error ? error.message : String(error)}` })
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
          result: JSON.stringify({ error: 'No data returned from Tavily API' })
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
      const prompt = `
      Analyze the following information about a company website:
      
      ${JSON.stringify(tavilyResponse, null, 2)}
      
      Please provide a detailed analysis covering:
      - What the company does
      - Its current direction and focus
      - Compliance posture and any notable legal or regulatory details
      - Other interesting or unique findings
      
      Format your response as paragraphs of text.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      geminiResponse = response.text();
      console.log('Gemini API response received');
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Update analysis record with error status
      await adminClient
        .from("analysis")
        .update({
          status: "failed",
          result: JSON.stringify({ error: `Gemini API error: ${error instanceof Error ? error.message : String(error)}` })
        })
        .eq("id", analysisData.id);

      return NextResponse.json(
        { error: `Gemini API error: ${error instanceof Error ? error.message : String(error)}`, analysisId: analysisData.id },
        { status: 500 }
      );
    }
    
    // Create analysis result object
    const analysisResult: CompetitorAnalysisResult = {
      domain,
      analysis: geminiResponse,
      tavilyData: tavilyResponse,
      timestamp: new Date()
    };
    
    // Update the analysis record with completed status and results
    const { error: updateError } = await adminClient
      .from("analysis")
      .update({
        status: "completed",
        result: JSON.stringify({
          domain,
          analysis: geminiResponse,
          timestamp: analysisResult.timestamp
        }),
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
