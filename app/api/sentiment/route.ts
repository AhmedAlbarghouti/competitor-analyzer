import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keywordsParam = searchParams.get('keywords');

    console.log('Keywords parameter:', keywordsParam);
    
    if (!keywordsParam) {
      return NextResponse.json(
        { error: 'Keywords parameter is required' },
        { status: 400 }
      );
    }
    
    const keywords = keywordsParam.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (keywords.length === 0) {
      return NextResponse.json(
        { error: 'At least one keyword is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.BRIGHTDATA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'BrightData API key not configured' },
        { status: 500 }
      );
    }

    const data = JSON.stringify(
      keywords.map(keyword => ({
        keyword: keyword.trim(),
        date: "Past year",
        num_of_posts: 30,
        sort_by: "Hot"
      }))
    );

    const response = await fetch(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lvz8ah06191smkebj4&include_errors=true&type=discover_new&discover_by=keyword",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(`BrightData API error: ${response.status}`);
    }

    const result = await response.json() as any;
    
    // Extract snapshot ID from trigger response
    const snapshotId = result.snapshot_id;
    
    return NextResponse.json({
      success: true,
      message: "Collection triggered successfully",
      data: result,
      snapshot_id: snapshotId,
      keywords: keywords
    });
    
  } catch (error) {
    console.error('Keyword fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keyword data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords } = body;
    
    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BRIGHTDATA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'BrightData API key not configured' },
        { status: 500 }
      );
    }

    const data = JSON.stringify(keywords);

    const response = await fetch(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lvz8ah06191smkebj4&include_errors=true&type=discover_new&discover_by=keyword",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(`BrightData API error: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: result,
      input: keywords,
    });
    
  } catch (error) {
    console.error('Keyword fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keyword data' },
      { status: 500 }
    );
  }
}