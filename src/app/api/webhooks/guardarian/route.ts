import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-guardarian-signature') || '';
    const timestamp = request.headers.get('x-guardarian-timestamp') || '';
    
    // Verify webhook signature
    const webhookSecret = process.env.GUARDARIAN_WEBHOOK_SECRET || '';
    if (!verifyGuardarianSignature(body, signature, timestamp, webhookSecret)) {
      console.warn('Invalid Guardarian webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { id: eventId, type: eventType, data } = payload;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: 'Missing event ID or type' }, { status: 400 });
    }

    // Check for idempotency - prevent duplicate processing
    const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events_v2')
      .select('id')
      .eq('event_id', eventId)
      .eq('provider', 'guardarian')
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate Guardarian webhook ignored: ${eventId}`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Store webhook event
    const { data: webhookEvent, error: webhookError } = await supabaseAdmin
      .from('webhook_events_v2')
      .insert({
        provider: 'guardarian',
        event_id: eventId,
        event_type: eventType,
        signature,
        raw_payload: payload,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Failed to store Guardarian webhook:', webhookError);
      return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
    }

    // Process webhook based on event type
    let processed = false;
    let errorMessage = null;

    try {
      switch (eventType) {
        case 'transaction.completed':
          await handleTransactionCompleted(data);
          processed = true;
          break;
          
        case 'transaction.failed':
          await handleTransactionFailed(data);
          processed = true;
          break;
          
        case 'transaction.expired':
          await handleTransactionExpired(data);
          processed = true;
          break;
          
        default:
          console.log(`Unhandled Guardarian event type: ${eventType}`);
          processed = true; // Mark as processed to avoid retries
      }
    } catch (processError) {
      console.error(`Error processing Guardarian webhook ${eventId}:`, processError);
      errorMessage = processError instanceof Error ? processError.message : 'Processing failed';
    }

    // Update webhook processing status
    await supabaseAdmin
      .from('webhook_events_v2')
      .update({
        processed,
        processed_at: processed ? new Date().toISOString() : null,
        error_message: errorMessage,
      })
      .eq('id', webhookEvent.id);

    const responseTime = Date.now() - startTime;
    console.log(`Guardarian webhook ${eventId} processed in ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      event_id: eventId,
      processed,
      response_time_ms: responseTime,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Guardarian webhook error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      response_time_ms: responseTime,
    }, { status: 500 });
  }
}

function verifyGuardarianSignature(
  payload: string, 
  signature: string, 
  timestamp: string, 
  secret: string
): boolean {
  if (!signature || !timestamp || !secret) return false;
  
  // Check timestamp (reject if older than 5 minutes)
  const timestampMs = parseInt(timestamp) * 1000;
  const now = Date.now();
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    return false;
  }
  
  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function handleTransactionCompleted(data: any) {
  const { external_partner_link_id: userId, id: providerOrderId, from_amount, to_amount, from_currency, to_currency } = data;
  
  // Find the crypto order
  const { data: order, error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'completed',
      crypto_amount: to_amount,
      settled_at: new Date().toISOString(),
      webhook_data: data,
    })
    .eq('provider_order_id', providerOrderId)
    .eq('provider', 'guardarian')
    .select()
    .maybeSingle();

  if (error || !order) {
    throw new Error(`Order not found for provider ID: ${providerOrderId}`);
  }

  console.log(`Guardarian transaction completed: ${providerOrderId}`);
}

async function handleTransactionFailed(data: any) {
  const { id: providerOrderId, decline_reason } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'failed',
      webhook_data: { ...data, decline_reason },
    })
    .eq('provider_order_id', providerOrderId)
    .eq('provider', 'guardarian');

  if (error) {
    throw new Error(`Failed to update order: ${providerOrderId}`);
  }

  console.log(`Guardarian transaction failed: ${providerOrderId}, reason: ${decline_reason}`);
}

async function handleTransactionExpired(data: any) {
  const { id: providerOrderId } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'expired',
      webhook_data: data,
    })
    .eq('provider_order_id', providerOrderId)
    .eq('provider', 'guardarian');

  if (error) {
    throw new Error(`Failed to update expired order: ${providerOrderId}`);
  }

  console.log(`Guardarian transaction expired: ${providerOrderId}`);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-guardarian-signature, x-guardarian-timestamp',
    },
  });
}