
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

  return NextResponse.json({
    success: true,
    data: collectedData,
    snapshot_id: snapshotId,
    keywords: ['datascience', 'battlefield2042', 'cats'],
  });
}