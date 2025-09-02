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
    const signature = request.headers.get('x-nymcard-signature') || '';
    const timestamp = request.headers.get('x-nymcard-timestamp') || '';
    
    // Verify webhook signature
    const webhookSecret = process.env.NYMCARD_WEBHOOK_SECRET || '';
    if (!verifyNymCardSignature(body, signature, timestamp, webhookSecret)) {
      console.warn('Invalid NymCard webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { event_id: eventId, event_type: eventType, data } = payload;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: 'Missing event ID or type' }, { status: 400 });
    }

    // Check for idempotency
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events_v2')
      .select('id')
      .eq('event_id', eventId)
      .eq('provider', 'nymcard')
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate NymCard webhook ignored: ${eventId}`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Store webhook event
    const { data: webhookEvent, error: webhookError } = await supabaseAdmin
      .from('webhook_events_v2')
      .insert({
        provider: 'nymcard',
        event_id: eventId,
        event_type: eventType,
        signature,
        raw_payload: payload,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Failed to store NymCard webhook:', webhookError);
      return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
    }

    // Process webhook based on event type
    let processed = false;
    let errorMessage = null;

    try {
      switch (eventType) {
        case 'card.activated':
          await handleCardActivated(data);
          processed = true;
          break;
          
        case 'card.blocked':
          await handleCardBlocked(data);
          processed = true;
          break;
          
        case 'transaction.authorization':
          await handleTransactionAuthorization(data);
          processed = true;
          break;
          
        case 'transaction.clearing':
          await handleTransactionClearing(data);
          processed = true;
          break;
          
        case 'transaction.chargeback':
          await handleTransactionChargeback(data);
          processed = true;
          break;
          
        default:
          console.log(`Unhandled NymCard event type: ${eventType}`);
          processed = true;
      }
    } catch (processError) {
      console.error(`Error processing NymCard webhook ${eventId}:`, processError);
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
    console.log(`NymCard webhook ${eventId} processed in ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      event_id: eventId,
      processed,
      response_time_ms: responseTime,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('NymCard webhook error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      response_time_ms: responseTime,
    }, { status: 500 });
  }
}

function verifyNymCardSignature(
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
  
  // Verify HMAC signature (NymCard format)
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}${payload}`)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function handleCardActivated(data: any) {
  const { card_id: providerCardId, status, user_id } = data;
  
  const { error } = await supabaseAdmin
    .from('cards')
    .update({
      card_status: 'active',
      spending_limits: data.spending_limits || {},
      card_controls: data.controls || {},
    })
    .eq('provider_card_id', providerCardId)
    .eq('provider', 'nymcard');

  if (error) {
    throw new Error(`Failed to update card activation: ${providerCardId}`);
  }

  console.log(`NymCard activated: ${providerCardId}`);
}

async function handleCardBlocked(data: any) {
  const { card_id: providerCardId, block_reason } = data;
  
  const { error } = await supabaseAdmin
    .from('cards')
    .update({
      card_status: 'blocked',
      spending_limits: { ...data.spending_limits, block_reason },
    })
    .eq('provider_card_id', providerCardId)
    .eq('provider', 'nymcard');

  if (error) {
    throw new Error(`Failed to update card block: ${providerCardId}`);
  }

  console.log(`NymCard blocked: ${providerCardId}, reason: ${block_reason}`);
}

async function handleTransactionAuthorization(data: any) {
  const { card_id: providerCardId, transaction_id, amount, currency, merchant, status } = data;
  
  // Find the card
  const { data: card } = await supabaseAdmin
    .from('cards')
    .select('id, user_id')
    .eq('provider_card_id', providerCardId)
    .eq('provider', 'nymcard')
    .maybeSingle();

  if (!card) {
    throw new Error(`Card not found: ${providerCardId}`);
  }

  // For now, just log the authorization
  // In production, you might create a transactions table entry
  console.log(`NymCard auth: ${transaction_id}, ${amount} ${currency}, status: ${status}`);
}

async function handleTransactionClearing(data: any) {
  const { card_id: providerCardId, transaction_id, amount, currency, merchant } = data;
  
  // Transaction has been posted/cleared
  // Here you would typically:
  // 1. Create ledger entries for the transaction
  // 2. Update account balances
  // 3. Send notifications to user
  
  console.log(`NymCard clearing: ${transaction_id}, ${amount} ${currency} at ${merchant.name}`);
}

async function handleTransactionChargeback(data: any) {
  const { card_id: providerCardId, transaction_id, chargeback_amount, reason } = data;
  
  console.log(`NymCard chargeback: ${transaction_id}, ${chargeback_amount}, reason: ${reason}`);
  
  // Handle chargeback processing
  // This would typically involve:
  // 1. Reversing the original transaction
  // 2. Creating chargeback records
  // 3. Notifying relevant parties
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-nymcard-signature, x-nymcard-timestamp',
    },
  });
}