import { NextRequest } from 'next/server';
import { createHash } from 'crypto';

// Simple in-memory store for webhook deduplication (use DB in production)
const processedWebhooks = new Set<string>();

interface NiumWebhookEvent {
  id: string;
  template: string;
  payloadHash: string;
  receivedAt: string;
  bodyJson: any;
}

// In production, replace with actual database operations
const webhookEvents: NiumWebhookEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const requestId = request.headers.get('x-request-id');
    const partnerKey = request.headers.get('x-partner-key');
    
    // Validate required headers
    if (!requestId) {
      return Response.json({
        ok: false,
        code: 'MISSING_REQUEST_ID',
        message: 'x-request-id header is required'
      }, { status: 400 });
    }
    
    // Check for duplicate webhook
    if (processedWebhooks.has(requestId)) {
      return Response.json({
        ok: true,
        message: 'Webhook already processed'
      });
    }
    
    // Verify partner key if configured
    const expectedPartnerKey = process.env.NIUM_WEBHOOK_PARTNER_KEY;
    if (expectedPartnerKey && partnerKey !== expectedPartnerKey) {
      return Response.json({
        ok: false,
        code: 'INVALID_PARTNER_KEY',
        message: 'Invalid or missing x-partner-key'
      }, { status: 401 });
    }
    
    // Parse webhook payload
    const body = await request.json();
    const { template } = body;
    
    if (!template) {
      return Response.json({
        ok: false,
        code: 'INVALID_PAYLOAD',
        message: 'Missing template in webhook payload'
      }, { status: 400 });
    }
    
    // Create payload hash for integrity
    const payloadHash = createHash('sha256').update(JSON.stringify(body)).digest('hex');
    
    // Store webhook event (replace with database in production)
    const webhookEvent: NiumWebhookEvent = {
      id: requestId,
      template,
      payloadHash,
      receivedAt: new Date().toISOString(),
      bodyJson: body
    };
    
    webhookEvents.push(webhookEvent);
    processedWebhooks.add(requestId);
    
    // Process payout lifecycle events
    if (['PAYOUT_INITIATED', 'PAYOUT_PAID', 'PAYOUT_REJECTED', 'PAYOUT_RETURNED'].includes(template)) {
      console.log(`Processing payout webhook: ${template}`, {
        requestId,
        systemReferenceNumber: body.systemReferenceNumber,
        status: body.status
      });
      
      // In production, update InternalPayout.status in database
      // await updatePayoutStatus(body.systemReferenceNumber, body.status);
    }
    
    console.log('NIUM webhook processed successfully:', {
      requestId,
      template,
      timestamp: webhookEvent.receivedAt
    });
    
    return Response.json({
      ok: true,
      requestId,
      processed: true
    });
    
  } catch (error) {
    console.error('NIUM webhook error:', error);
    
    return Response.json({
      ok: false,
      code: 'WEBHOOK_ERROR',
      message: error instanceof Error ? error.message : 'Failed to process webhook'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-request-id, x-partner-key',
    },
  });
}