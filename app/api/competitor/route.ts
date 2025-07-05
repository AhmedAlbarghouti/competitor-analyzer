import { NextRequest, NextResponse } from 'next/server';
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

// Environment variables for API keys (should be set in .env.local)
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {
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

    // Parse and validate the request body
    const body = await req.json();
    const validationResult = domainSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid domain format', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { domain } = validationResult.data;
    
    // Check if the domain is accessible
    try {
      const domainCheck = await axios.head(domain, { 
        timeout: 5000,
        validateStatus: () => true // Accept any status code to handle it ourselves
      });
      
      if (domainCheck.status < 200 || domainCheck.status >= 300) {
        return NextResponse.json(
          { error: `Domain returned non-success status code: ${domainCheck.status}` },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to access domain: ${error instanceof Error ? error.message : String(error)}` },
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
      return NextResponse.json(
        { error: `Tavily API error: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 }
      );
    }
    
    if (!tavilyResponse) {
      return NextResponse.json(
        { error: 'No data returned from Tavily API' },
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
      return NextResponse.json(
        { error: `Gemini API error: ${error instanceof Error ? error.message : String(error)}` },
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
    
    // Note: Database operations would go here
    // For now, we'll just return the analysis results
    console.log('Analysis complete for domain:', domain);
    
    return NextResponse.json({
      domain,
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
