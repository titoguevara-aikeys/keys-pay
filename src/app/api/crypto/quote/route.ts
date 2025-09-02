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
    const { fiatAmount, fiatCurrency, cryptoCurrency, side } = body;

    // Validate input
    if (!fiatAmount || !fiatCurrency || !cryptoCurrency || !side) {
      return NextResponse.json(
        { error: 'Missing required fields: fiatAmount, fiatCurrency, cryptoCurrency, side' },
        { status: 400 }
      );
    }

    if (!['buy', 'sell'].includes(side)) {
      return NextResponse.json(
        { error: 'Invalid side. Must be "buy" or "sell"' },
        { status: 400 }
      );
    }

    // Rate limiting check (basic implementation)
    const { data: recentRequests } = await supabaseAdmin
      .from('crypto_orders')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()); // Last minute

    if (recentRequests && recentRequests.length > 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making another request.' },
        { status: 429 }
      );
    }

    // Mock quote response (replace with actual provider calls)
    const exchangeRate = side === 'buy' ? 0.000024 : 0.000023; // Mock BTC rate
    const cryptoAmount = side === 'buy' 
      ? fiatAmount * exchangeRate 
      : fiatAmount / exchangeRate;
    
    const fees = fiatAmount * 0.015; // 1.5% fee
    const netAmount = side === 'buy' ? fiatAmount + fees : fiatAmount - fees;

    const quote = {
      quote_id: `quote_${Date.now()}_${user.id.slice(0, 8)}`,
      side,
      fiat_currency: fiatCurrency,
      crypto_currency: cryptoCurrency,
      fiat_amount: fiatAmount,
      crypto_amount: cryptoAmount,
      exchange_rate: exchangeRate,
      fees,
      net_amount: netAmount,
      expires_at: new Date(Date.now() + 300000).toISOString(), // 5 minutes
      provider: 'guardarian',
      region: 'GCC',
    };

    return NextResponse.json({
      success: true,
      quote,
      disclaimer: 'Quote provided by Guardarian. Keys Pay is an aggregator platform.',
    });

  } catch (error) {
    console.error('Crypto quote error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
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