import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:5100/v1';

export async function GET(request: NextRequest) {
  console.log('GET request received');
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  console.log('POST request received');
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  console.log('PUT request received');
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  console.log('DELETE request received');
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy', '');
  console.log('Proxying request to:', `${API_BASE_URL}${path}`);

  const url = new URL(path, API_BASE_URL);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(API_BASE_URL).host);

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.body,
    });

    console.log('Received response with status:', response.status);

    const newResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    return newResponse;
  } catch (error) {
    console.error('Error in proxy:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}