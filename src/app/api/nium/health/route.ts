import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  const requestId = uuidv4();
  
  const response = {
    ok: true,
    env: process.env.NIUM_ENV || 'sandbox',
    baseUrl: 'https://gateway.nium.com/api',
    requestId,
    timestamp: new Date().toISOString()
  };

  return Response.json(response);
}