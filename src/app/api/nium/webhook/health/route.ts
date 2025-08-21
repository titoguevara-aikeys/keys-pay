import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return Response.json({
    ok: true,
    service: 'NIUM Webhook',
    path: process.env.NIUM_WEBHOOK_PATH || '/api/nium/webhook',
    timestamp: new Date().toISOString()
  });
}