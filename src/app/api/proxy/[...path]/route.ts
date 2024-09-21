import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.LUI_API_BASE_URL || 'http://localhost:5100/';

async function handleRequest(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy', '');
  
  const url = new URL(path, API_BASE_URL);
  url.search = request.nextUrl.search;
  console.log('URL :', `${url}`);

  const headers = new Headers(request.headers);
  headers.set('host', new URL(API_BASE_URL).host);

  try {
    const fetchOptions: RequestInit & { duplex?: string } = {
      method: request.method,
      headers: headers,
      credentials: 'include',
    };

    // Only add the body and duplex option for methods that typically have a body
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      fetchOptions.body = request.body;
      fetchOptions.duplex = 'half';
    }

    const response = await fetch(url, fetchOptions as RequestInit);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', 'https://app.luminolabs.ai');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

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
      'Access-Control-Allow-Origin': 'https://app.luminolabs.ai',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

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