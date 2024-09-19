import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5100/v1';

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

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
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

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error in proxy:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function handleCORS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}