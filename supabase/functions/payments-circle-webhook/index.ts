import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, circle-signature',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Circle webhook configuration
const CIRCLE_WEBHOOK_SECRET = Deno.env.get('CIRCLE_WEBHOOK_SECRET');
const ALERT_EMAIL = Deno.env.get('ALERT_EMAIL') || 'tito.guevara@aikeys.ai';

// Verify Circle webhook signature
async function verifySignature(body: string, signature: string): Promise<boolean> {
  if (!CIRCLE_WEBHOOK_SECRET || !signature) {
    console.error('Missing webhook secret or signature');
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(CIRCLE_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );

    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Circle sends signature as 'v1=<hex>'
    const receivedHex = signature.replace('v1=', '');
    
    return expectedHex === receivedHex;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Process Circle webhook event
async function processWebhookEvent(eventData: any, requestId: string): Promise<Response> {
  const { eventType, eventId } = eventData;
  
  console.log(`[${requestId}] Processing event: ${eventType}, ID: ${eventId}`);

  try {
    // Check idempotency
    const { data: existingKey } = await supabase
      .from('idempotency_keys')
      .select('key')
      .eq('provider', 'circle')
      .eq('key', eventId)
      .single();

    if (existingKey) {
      console.log(`[${requestId}] Event ${eventId} already processed (idempotent)`);
      return new Response(JSON.stringify({ status: 'already_processed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Insert idempotency key
    await supabase
      .from('idempotency_keys')
      .insert({
        provider: 'circle',
        key: eventId,
        payload_hash: await hashPayload(JSON.stringify(eventData)),
        response_status: 200
      });

    // Store the event
    const { error: eventError } = await supabase
      .from('payment_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        payment_id: eventData.paymentId,
        wallet_id: eventData.walletId,
        amount: eventData.amount?.amount ? parseFloat(eventData.amount.amount) : null,
        currency: eventData.amount?.currency || 'USDC',
        status: eventData.payment?.status || 'unknown',
        raw_event: eventData
      });

    if (eventError) {
      console.error(`[${requestId}] Failed to store event:`, eventError);
      throw eventError;
    }

    // Process specific event types
    switch (eventType) {
      case 'payments.confirmed':
        await handlePaymentConfirmed(eventData, requestId);
        break;
      case 'payments.failed':
        await handlePaymentFailed(eventData, requestId);
        break;
      case 'wallets.created':
        await handleWalletCreated(eventData, requestId);
        break;
      default:
        console.log(`[${requestId}] Unhandled event type: ${eventType}`);
    }

    console.log(`[${requestId}] Successfully processed event ${eventId}`);
    
    return new Response(JSON.stringify({ 
      status: 'success', 
      eventId, 
      eventType,
      processedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error(`[${requestId}] Error processing webhook:`, error);
    
    // Update idempotency key with error status
    await supabase
      .from('idempotency_keys')
      .upsert({
        provider: 'circle',
        key: eventId,
        response_status: 500
      });

    // Send alert email for critical failures
    await sendAlertEmail(error, eventData, requestId);

    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      eventId,
      requestId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

// Handle payment confirmed events
async function handlePaymentConfirmed(eventData: any, requestId: string) {
  console.log(`[${requestId}] Handling payment confirmed: ${eventData.paymentId}`);
  
  // Update circle_transactions table
  const { error } = await supabase
    .from('circle_transactions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      webhook_received_at: new Date().toISOString(),
      circle_response: eventData
    })
    .eq('circle_transaction_id', eventData.paymentId);

  if (error) {
    console.error(`[${requestId}] Failed to update transaction:`, error);
    throw error;
  }
}

// Handle payment failed events
async function handlePaymentFailed(eventData: any, requestId: string) {
  console.log(`[${requestId}] Handling payment failed: ${eventData.paymentId}`);
  
  const { error } = await supabase
    .from('circle_transactions')
    .update({
      status: 'failed',
      webhook_received_at: new Date().toISOString(),
      error_details: eventData.failure || eventData,
      circle_response: eventData
    })
    .eq('circle_transaction_id', eventData.paymentId);

  if (error) {
    console.error(`[${requestId}] Failed to update failed transaction:`, error);
    throw error;
  }
}

// Handle wallet created events
async function handleWalletCreated(eventData: any, requestId: string) {
  console.log(`[${requestId}] Handling wallet created: ${eventData.walletId}`);
  // Implement wallet creation logic if needed
}

// Send alert email for critical failures
async function sendAlertEmail(error: any, eventData: any, requestId: string) {
  try {
    console.log(`[${requestId}] Sending alert email to ${ALERT_EMAIL}`);
    // Implement email alert via Supabase function if needed
  } catch (emailError) {
    console.error(`[${requestId}] Failed to send alert email:`, emailError);
  }
}

// Hash payload for idempotency
async function hashPayload(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().substring(0, 8);
  const startTime = Date.now();
  
  console.log(`[${requestId}] ${req.method} ${req.url} - Processing webhook`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Get signature from headers
    const signature = req.headers.get('circle-signature') || '';
    
    // Get request body
    const body = await req.text();
    
    // Verify signature
    const isValidSignature = await verifySignature(body, signature);
    
    if (!isValidSignature) {
      console.error(`[${requestId}] Invalid webhook signature`);
      
      // Log security event
      await supabase.from('security_events').insert({
        event_type: 'WEBHOOK_SIGNATURE_INVALID',
        event_description: 'Invalid Circle webhook signature detected',
        risk_score: 80,
        metadata: {
          requestId,
          signature: signature.substring(0, 20) + '...',
          bodySize: body.length
        }
      });

      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse event data
    const eventData = JSON.parse(body);
    
    // Process the webhook
    const response = await processWebhookEvent(eventData, requestId);
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Webhook processed in ${duration}ms`);
    
    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Webhook handler error (${duration}ms):`, error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      requestId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);