import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.femafhz.com/webservice?q=cycloData&subqry=windfield&stormdate=0&type=SH&fmt=GEOJSON', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Set CORS headers
    const nextResponse = NextResponse.json(data);
    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return nextResponse;
    
  } catch (error) {
    console.error('Error fetching wind field data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wind field data' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
