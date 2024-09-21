import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.LUI_API_BASE_URL || 'http://localhost:5100/';

export async function GET() {
  const settings = {
    API_BASE_URL: API_BASE_URL
  };

  return NextResponse.json(settings);
}