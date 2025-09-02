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
    const signature = request.headers.get('x-ramp-signature') || '';
    const timestamp = request.headers.get('x-ramp-timestamp') || '';
    
    // Verify webhook signature
    const webhookSecret = process.env.RAMP_WEBHOOK_SECRET || '';
    if (!verifyRampSignature(body, signature, timestamp, webhookSecret)) {
      console.warn('Invalid Ramp webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { id: eventId, type: eventType, data } = payload;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: 'Missing event ID or type' }, { status: 400 });
    }

    // Check for idempotency
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events_v2')
      .select('id')
      .eq('event_id', eventId)
      .eq('provider', 'ramp')
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate Ramp webhook ignored: ${eventId}`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Store webhook event
    const { data: webhookEvent, error: webhookError } = await supabaseAdmin
      .from('webhook_events_v2')
      .insert({
        provider: 'ramp',
        event_id: eventId,
        event_type: eventType,
        signature,
        raw_payload: payload,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Failed to store Ramp webhook:', webhookError);
      return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
    }

    // Process webhook based on event type
    let processed = false;
    let errorMessage = null;

    try {
      switch (eventType) {
        case 'CREATED':
          await handleOrderCreated(data);
          processed = true;
          break;
          
        case 'PAYMENT_STARTED':
          await handlePaymentStarted(data);
          processed = true;
          break;
          
        case 'PAYMENT_CONFIRMED':
          await handlePaymentConfirmed(data);
          processed = true;
          break;
          
        case 'RELEASED':
          await handleOrderReleased(data);
          processed = true;
          break;
          
        case 'CANCELLED':
          await handleOrderCancelled(data);
          processed = true;
          break;
          
        case 'EXPIRED':
          await handleOrderExpired(data);
          processed = true;
          break;
          
        default:
          console.log(`Unhandled Ramp event type: ${eventType}`);
          processed = true;
      }
    } catch (processError) {
      console.error(`Error processing Ramp webhook ${eventId}:`, processError);
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
    console.log(`Ramp webhook ${eventId} processed in ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      event_id: eventId,
      processed,
      response_time_ms: responseTime,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Ramp webhook error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      response_time_ms: responseTime,
    }, { status: 500 });
  }
}

function verifyRampSignature(
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
  
  // Verify HMAC signature (Ramp format)
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}${payload}`)
    .digest('hex');
  
  const providedSignature = signature.startsWith('v1=') ? signature.slice(3) : signature;
  
  return crypto.timingSafeEqual(
    Buffer.from(providedSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function handleOrderCreated(data: any) {
  const { id: rampOrderId, userAddress } = data;
  
  // Update crypto order status
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'pending',
      webhook_data: data,
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp');

  if (error) {
    console.warn(`Ramp order not found for update: ${rampOrderId}`);
  }

  console.log(`Ramp order created: ${rampOrderId}`);
}

async function handlePaymentStarted(data: any) {
  const { id: rampOrderId, paymentMethodType } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'processing',
      webhook_data: { ...data, payment_method: paymentMethodType },
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp');

  if (error) {
    throw new Error(`Failed to update Ramp order payment started: ${rampOrderId}`);
  }

  console.log(`Ramp payment started: ${rampOrderId}, method: ${paymentMethodType}`);
}

async function handlePaymentConfirmed(data: any) {
  const { id: rampOrderId, finalTxHash } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'confirmed',
      tx_hash: finalTxHash,
      webhook_data: data,
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp');

  if (error) {
    throw new Error(`Failed to update Ramp payment confirmed: ${rampOrderId}`);
  }

  console.log(`Ramp payment confirmed: ${rampOrderId}, tx: ${finalTxHash}`);
}

async function handleOrderReleased(data: any) {
  const { id: rampOrderId, asset, assetExchangeRate, cryptoAmount } = data;
  
  // Order completed successfully
  const { data: order, error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'completed',
      crypto_amount: cryptoAmount,
      exchange_rate: assetExchangeRate,
      settled_at: new Date().toISOString(),
      webhook_data: data,
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp')
    .select()
    .maybeSingle();

  if (error || !order) {
    throw new Error(`Failed to update completed Ramp order: ${rampOrderId}`);
  }

  console.log(`Ramp order completed: ${rampOrderId}, ${cryptoAmount} ${asset}`);
}

async function handleOrderCancelled(data: any) {
  const { id: rampOrderId, cancelReason } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'cancelled',
      webhook_data: { ...data, cancel_reason: cancelReason },
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp');

  if (error) {
    throw new Error(`Failed to update cancelled Ramp order: ${rampOrderId}`);
  }

  console.log(`Ramp order cancelled: ${rampOrderId}, reason: ${cancelReason}`);
}

async function handleOrderExpired(data: any) {
  const { id: rampOrderId } = data;
  
  const { error } = await supabaseAdmin
    .from('crypto_orders')
    .update({
      status: 'expired',
      webhook_data: data,
    })
    .eq('provider_order_id', rampOrderId)
    .eq('provider', 'ramp');

  if (error) {
    throw new Error(`Failed to update expired Ramp order: ${rampOrderId}`);
  }

  console.log(`Ramp order expired: ${rampOrderId}`);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-ramp-signature, x-ramp-timestamp',
    },
  });
}