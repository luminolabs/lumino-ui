import { NextResponse } from 'next/server';

export async function GET() {
  const settings = {
    API_BASE_URL: process.env.LUI_API_BASE_URL || 'http://localhost:5100/'
  };

  return NextResponse.json(settings);
}