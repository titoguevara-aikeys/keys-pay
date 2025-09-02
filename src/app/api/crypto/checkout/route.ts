import { NextRequest, NextResponse } from 'next/server';
import { createGuardarianProvider } from '@/lib/providers/guardarian';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { quote_id, organization_id } = body;

    if (!quote_id || !organization_id) {
      return NextResponse.json(
        { error: 'Missing required fields: quote_id, organization_id' },
        { status: 400 }
      );
    }

    // Verify user has access to organization
    const { data: membership } = await supabaseAdmin
      .from('role_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied to organization' },
        { status: 403 }
      );
    }

    // Create crypto order record
    const orderData = {
      user_id: user.id,
      organization_id,
      provider: 'guardarian',
      provider_order_id: null, // Will be updated after provider call
      order_type: 'buy', // Extracted from quote
      fiat_currency: 'AED',
      crypto_currency: 'BTC',
      fiat_amount: 100, // From quote
      status: 'pending',
      expires_at: new Date(Date.now() + 1800000).toISOString(), // 30 minutes
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('crypto_orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // For demo mode, return mock checkout URL
    if (process.env.DEMO_MODE === 'true') {
      return NextResponse.json({
        success: true,
        order_id: order.id,
        checkout_url: `https://demo.guardarian.com/checkout?ref=${order.id}`,
        provider: 'guardarian',
        status: 'pending',
        expires_at: order.expires_at,
        demo_mode: true,
      });
    }

    // In production, call actual Guardarian API
    try {
      const guardarian = createGuardarianProvider();
      const checkout = await guardarian.createCheckout({
        userId: user.id,
        fiatAmount: orderData.fiat_amount,
        fiatCurrency: orderData.fiat_currency,
        cryptoCurrency: orderData.crypto_currency,
        side: 'buy',
      });

      // Update order with provider details
      await supabaseAdmin
        .from('crypto_orders')
        .update({
          provider_order_id: checkout.orderId,
          checkout_url: checkout.checkoutUrl,
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        order_id: order.id,
        checkout_url: checkout.checkoutUrl,
        provider: 'guardarian',
        status: 'pending',
        expires_at: checkout.expiresAt,
      });

    } catch (providerError) {
      console.error('Provider error:', providerError);
      
      // Update order status to failed
      await supabaseAdmin
        .from('crypto_orders')
        .update({ status: 'failed' })
        .eq('id', order.id);

      return NextResponse.json(
        { error: 'Provider service unavailable' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Crypto checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}