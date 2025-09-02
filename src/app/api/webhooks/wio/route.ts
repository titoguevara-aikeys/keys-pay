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
    const signature = request.headers.get('x-wio-signature') || '';
    const timestamp = request.headers.get('x-wio-timestamp') || '';
    
    // Verify webhook signature
    const webhookSecret = process.env.WIO_WEBHOOK_SECRET || '';
    if (!verifyWioSignature(body, signature, timestamp, webhookSecret)) {
      console.warn('Invalid Wio webhook signature');
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
      .eq('provider', 'wio')
      .maybeSingle();

    if (existingEvent) {
      console.log(`Duplicate Wio webhook ignored: ${eventId}`);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Store webhook event
    const { data: webhookEvent, error: webhookError } = await supabaseAdmin
      .from('webhook_events_v2')
      .insert({
        provider: 'wio',
        event_id: eventId,
        event_type: eventType,
        signature,
        raw_payload: payload,
        processed: false,
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Failed to store Wio webhook:', webhookError);
      return NextResponse.json({ error: 'Storage failed' }, { status: 500 });
    }

    // Process webhook based on event type
    let processed = false;
    let errorMessage = null;

    try {
      switch (eventType) {
        case 'transfer.initiated':
          await handleTransferInitiated(data);
          processed = true;
          break;
          
        case 'transfer.processing':
          await handleTransferProcessing(data);
          processed = true;
          break;
          
        case 'transfer.completed':
          await handleTransferCompleted(data);
          processed = true;
          break;
          
        case 'transfer.failed':
          await handleTransferFailed(data);
          processed = true;
          break;
          
        case 'incoming.credit':
          await handleIncomingCredit(data);
          processed = true;
          break;
          
        default:
          console.log(`Unhandled Wio event type: ${eventType}`);
          processed = true;
      }
    } catch (processError) {
      console.error(`Error processing Wio webhook ${eventId}:`, processError);
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
    console.log(`Wio webhook ${eventId} processed in ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      event_id: eventId,
      processed,
      response_time_ms: responseTime,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Wio webhook error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      response_time_ms: responseTime,
    }, { status: 500 });
  }
}

function verifyWioSignature(
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
  
  // Verify HMAC signature (Wio format)
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64'),
    Buffer.from(expectedSignature, 'base64')
  );
}

async function handleTransferInitiated(data: any) {
  const { transfer_id: providerRef, organization_id } = data;
  
  const { error } = await supabaseAdmin
    .from('bank_transfers')
    .update({
      status: 'processing',
      provider_ref: providerRef,
      metadata: { ...data, webhook_received_at: new Date().toISOString() },
    })
    .eq('provider_ref', providerRef)
    .eq('provider', 'wio');

  if (error) {
    console.warn(`Transfer not found for update: ${providerRef}`);
  }

  console.log(`Wio transfer initiated: ${providerRef}`);
}

async function handleTransferProcessing(data: any) {
  const { transfer_id: providerRef, estimated_completion } = data;
  
  const { error } = await supabaseAdmin
    .from('bank_transfers')
    .update({
      status: 'processing',
      expected_completion_date: estimated_completion,
      metadata: { ...data, webhook_received_at: new Date().toISOString() },
    })
    .eq('provider_ref', providerRef)
    .eq('provider', 'wio');

  if (error) {
    throw new Error(`Failed to update transfer processing: ${providerRef}`);
  }

  console.log(`Wio transfer processing: ${providerRef}`);
}

async function handleTransferCompleted(data: any) {
  const { transfer_id: providerRef, completion_time, final_amount, fees } = data;
  
  const { data: transfer, error } = await supabaseAdmin
    .from('bank_transfers')
    .update({
      status: 'completed',
      completed_at: completion_time,
      fees_amount: fees,
      metadata: { ...data, webhook_received_at: new Date().toISOString() },
    })
    .eq('provider_ref', providerRef)
    .eq('provider', 'wio')
    .select()
    .maybeSingle();

  if (error || !transfer) {
    throw new Error(`Failed to update completed transfer: ${providerRef}`);
  }

  // Create ledger entries for completed transfer
  await createTransferLedgerEntries(transfer, final_amount || transfer.amount, fees || 0);

  console.log(`Wio transfer completed: ${providerRef}, amount: ${final_amount}`);
}

async function handleTransferFailed(data: any) {
  const { transfer_id: providerRef, failure_reason, failure_code } = data;
  
  const { error } = await supabaseAdmin
    .from('bank_transfers')
    .update({
      status: 'failed',
      metadata: { 
        ...data, 
        failure_reason, 
        failure_code,
        webhook_received_at: new Date().toISOString() 
      },
    })
    .eq('provider_ref', providerRef)
    .eq('provider', 'wio');

  if (error) {
    throw new Error(`Failed to update failed transfer: ${providerRef}`);
  }

  console.log(`Wio transfer failed: ${providerRef}, reason: ${failure_reason}`);
}

async function handleIncomingCredit(data: any) {
  const { amount, currency, from_account, to_organization_id, reference } = data;
  
  // Create inbound transfer record
  const { data: transfer, error } = await supabaseAdmin
    .from('bank_transfers')
    .insert({
      provider: 'wio',
      provider_ref: data.credit_id || `incoming_${Date.now()}`,
      organization_id: to_organization_id,
      direction: 'inbound',
      currency,
      amount: parseFloat(amount),
      status: 'completed',
      beneficiary_json: { from_account, reference },
      completed_at: new Date().toISOString(),
      metadata: { ...data, webhook_received_at: new Date().toISOString() },
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create incoming credit record: ${data.credit_id}`);
  }

  // Create ledger entries for incoming credit
  await createTransferLedgerEntries(transfer, parseFloat(amount), 0);

  console.log(`Wio incoming credit: ${amount} ${currency} to org ${to_organization_id}`);
}

async function createTransferLedgerEntries(transfer: any, amount: number, fees: number) {
  // This is a simplified ledger entry creation
  // In production, you'd have more sophisticated accounting logic
  
  try {
    // Find organization's cash account
    const { data: cashAccount } = await supabaseAdmin
      .from('ledger_accounts')
      .select('id')
      .eq('organization_id', transfer.organization_id)
      .eq('currency', transfer.currency)
      .eq('account_type', 'asset')
      .eq('account_code', `CASH_${transfer.currency}`)
      .maybeSingle();

    if (!cashAccount) {
      console.warn(`No cash account found for org ${transfer.organization_id}, currency ${transfer.currency}`);
      return;
    }

    // Create ledger entry for the transfer
    const debitAmount = transfer.direction === 'inbound' ? amount : 0;
    const creditAmount = transfer.direction === 'outbound' ? amount : 0;

    await supabaseAdmin
      .from('ledger_entries')
      .insert({
        organization_id: transfer.organization_id,
        account_id: cashAccount.id,
        transaction_id: transfer.id,
        debit_amount: debitAmount > 0 ? debitAmount : null,
        credit_amount: creditAmount > 0 ? creditAmount : null,
        currency: transfer.currency,
        description: `Bank transfer - ${transfer.direction}`,
        reference: transfer.provider_ref,
        provider: 'wio',
        provider_transaction_id: transfer.provider_ref,
      });

    console.log(`Ledger entries created for transfer ${transfer.id}`);
  } catch (ledgerError) {
    console.error('Failed to create ledger entries:', ledgerError);
    // Don't throw here - webhook processing should still succeed
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-wio-signature, x-wio-timestamp',
    },
  });
}