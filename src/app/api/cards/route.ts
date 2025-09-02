import { NextRequest, NextResponse } from 'next/server';
import { createNymCardProvider } from '@/lib/providers/nymcard';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - List user's cards
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: cards, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Cards fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cards: cards || [],
    });

  } catch (error) {
    console.error('Cards GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Issue new card
export async function POST(request: NextRequest) {
  try {
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
    const { card_type = 'virtual', currency = 'AED', organization_id } = body;

    if (!organization_id) {
      return NextResponse.json(
        { error: 'organization_id is required' },
        { status: 400 }
      );
    }

    // Verify user access to organization
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

    // Check card limits (max 5 cards per user)
    const { data: existingCards } = await supabaseAdmin
      .from('cards')
      .select('id')
      .eq('user_id', user.id);

    if (existingCards && existingCards.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum card limit reached (5 cards per user)' },
        { status: 400 }
      );
    }

    // Demo mode - create mock card
    if (process.env.DEMO_MODE === 'true') {
      const mockCard = {
        user_id: user.id,
        provider: 'nymcard',
        provider_card_id: `demo_card_${Date.now()}`,
        card_type,
        card_status: 'active',
        last4: '1234',
        currency,
        spending_limits: {
          daily: 1000,
          monthly: 5000,
          per_transaction: 500,
        },
        card_controls: {
          online_enabled: true,
          contactless_enabled: true,
          atm_enabled: true,
        },
      };

      const { data: card, error } = await supabaseAdmin
        .from('cards')
        .insert(mockCard)
        .select()
        .single();

      if (error) {
        console.error('Demo card creation error:', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        card,
        demo_mode: true,
      });
    }

    // Production - call NymCard API
    try {
      const nymcard = createNymCardProvider();
      const cardResponse = await nymcard.issueVirtualCard({
        userId: user.id,
        cardType: card_type as 'virtual' | 'physical',
        currency,
      });

      const cardData = {
        user_id: user.id,
        provider: 'nymcard',
        provider_card_id: cardResponse.cardId,
        card_type,
        card_status: cardResponse.status,
        last4: cardResponse.last4,
        currency,
        spending_limits: {
          daily: 1000,
          monthly: 5000,
          per_transaction: 500,
        },
        card_controls: {
          online_enabled: true,
          contactless_enabled: true,
          atm_enabled: true,
        },
      };

      const { data: card, error } = await supabaseAdmin
        .from('cards')
        .insert(cardData)
        .select()
        .single();

      if (error) {
        console.error('Card creation error:', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        card,
      });

    } catch (providerError) {
      console.error('NymCard API error:', providerError);
      return NextResponse.json(
        { error: 'Card provider service unavailable' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Cards POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}