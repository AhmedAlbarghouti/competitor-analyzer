
import { NextResponse } from 'next/server';

export async function GET(req) {
  const apiKey = process.env.BRIGHTDATA_API_KEY;
  const { searchParams } = new URL(req.url);
  const snapshotId = searchParams.get('snapshotId');
  // Optionally, handle missing snapshotId
  if (!snapshotId) {
    return NextResponse.json({
      success: false,
      message: 'Missing snapshotId',
    }, { status: 400 });
  }

  // Fetch the actual data using snapshot ID
  const dataResponse = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    }
  );

  if (!dataResponse.ok) {
    console.log('Error fetching data:', dataResponse.statusText);
    return NextResponse.json({
      success: true,
      message: 'Collection triggered, data not ready yet',
      snapshot_id: snapshotId,
      data: null,
      keywords: ['datascience', 'battlefield2042', 'cats'],
    });
  }

  const collectedData = await dataResponse.json();

  // Extract all 'titles' and 'comments''comment' fields
function extractTitlesAndComments(data: any) {
    const titles: string[] = [];
    // const comments: string[] = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            // Check if the value is an object and has a 'title' or 'comment'
            if (typeof value === 'object' && value !== null) {
                if (value.title) {
                    titles.push(value.title);
                }
                // if (value.comment) {
                //     comments.push(value.comment);
                // }
            }
        }
    }   

    // Main post title
    if (data.title) {
        titles.push(data.title);
    }

    // Related posts titles
    // if (Array.isArray(data.related_posts)) {
    //     for (const post of data.related_posts) {
    //         if (post.title) {
    //             titles.push(post.title);
    //         }
    //     }
    // }

    // // Comments
    // if (Array.isArray(data.comments)) {
    //     for (const commentObj of data.comments) {
    //         if (commentObj.comment) {
    //             comments.push(commentObj.comment);
    //         }
    //     }
    // }

    return titles;
}

const titles = extractTitlesAndComments(collectedData);

if (!titles || titles.length === 0) {
  return NextResponse.json({
    success: false,
    message: 'No titles found in the collected data',
    snapshot_id: snapshotId,
    data: null,
    keywords: ['datascience', 'battlefield2042', 'cats'],
  }, { status: 404 });
}

const aiApiKey = process.env.GEMINI_API_KEY ?? '';

if (!aiApiKey) {
  return NextResponse.json({
    success: false,
    message: 'Missing Gemini API key',
    snapshot_id: snapshotId,
    data: null,
    keywords: ['datascience', 'battlefield2042', 'cats'],
  }, { status: 500 });
}



let aiResult;
try {
  const aiResponse = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + aiApiKey,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': aiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Give me the sentiment on these phrases and sentences. If they are liked by customer or not, what they are doing wrong or right , limit it to 20 sentences: ${titles.join(' ')}`
              }
            ]
          }
        ]
      }),
    }
  );

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error('Error from Gemini API:', aiResponse.status, errorText);
    return NextResponse.json({
      success: false,
      message: 'Error from Gemini API',
      snapshot_id: snapshotId,
      data: null,
      keywords: ['datascience', 'battlefield2042', 'cats'],
    }, { status: aiResponse.status });
  }

  aiResult = await aiResponse.json();
} catch (error) {
  console.error('Failed to fetch from Gemini API:', error);
  return NextResponse.json({
    success: false,
    message: 'Failed to fetch from Gemini API',
    snapshot_id: snapshotId,
    data: null,
    keywords: ['datascience', 'battlefield2042', 'cats'],
  }, { status: 500 });
}

console.log('Extracted Titles:', titles);
// console.log('Extracted Comments:', comments);

return NextResponse.json({
  success: true,
  data: aiResult,
  snapshot_id: snapshotId,
  keywords: ['datascience', 'battlefield2042', 'cats'],
});
}