import { NextRequest, NextResponse } from 'next/server';
import { createWioProvider } from '@/lib/providers/wio';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - List organization's transfers
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

    const url = new URL(request.url);
    const organizationId = url.searchParams.get('organization_id');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organization_id parameter is required' },
        { status: 400 }
      );
    }

    // Verify user access to organization
    const { data: membership } = await supabaseAdmin
      .from('role_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied to organization' },
        { status: 403 }
      );
    }

    const { data: transfers, error } = await supabaseAdmin
      .from('bank_transfers')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Bank transfers fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transfers: transfers || [],
    });

  } catch (error) {
    console.error('Bank transfers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new transfer
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
    const { 
      organization_id, 
      amount, 
      currency = 'AED',
      beneficiary,
      purpose_code,
      reference 
    } = body;

    // Validate required fields
    if (!organization_id || !amount || !beneficiary) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_id, amount, beneficiary' },
        { status: 400 }
      );
    }

    if (!beneficiary.name || !beneficiary.iban) {
      return NextResponse.json(
        { error: 'Beneficiary must include name and iban' },
        { status: 400 }
      );
    }

    // Verify user has admin role for organization
    const { data: membership } = await supabaseAdmin
      .from('role_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organization_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!membership || !['admin', 'owner'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Admin access required for transfers' },
        { status: 403 }
      );
    }

    // Amount validation
    if (amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { error: 'Amount must be between 0 and 1,000,000 AED' },
        { status: 400 }
      );
    }

    // Create transfer record
    const transferData = {
      provider: 'wio',
      organization_id,
      direction: 'outbound',
      currency,
      amount: parseFloat(amount),
      status: 'initiated',
      beneficiary_json: beneficiary,
      purpose_code,
      fees_amount: amount * 0.001, // 0.1% fee
      expected_completion_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      metadata: {
        reference,
        initiated_by: user.id,
        initiated_at: new Date().toISOString(),
      },
    };

    const { data: transfer, error: transferError } = await supabaseAdmin
      .from('bank_transfers')
      .insert(transferData)
      .select()
      .single();

    if (transferError) {
      console.error('Transfer creation error:', transferError);
      return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 });
    }

    // Demo mode - simulate transfer
    if (process.env.DEMO_MODE === 'true') {
      // Simulate async processing
      setTimeout(async () => {
        await supabaseAdmin
          .from('bank_transfers')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            provider_ref: `demo_wio_${transfer.id.slice(0, 8)}`,
          })
          .eq('id', transfer.id);
      }, 5000);

      return NextResponse.json({
        success: true,
        transfer: {
          ...transfer,
          demo_mode: true,
        },
      });
    }

    // Production - call Wio API
    try {
      const wio = createWioProvider();
      const wioResponse = await wio.createTransfer({
        organizationId: organization_id,
        amount: parseFloat(amount),
        currency,
        beneficiary,
        purposeCode: purpose_code,
        reference,
      });

      // Update with provider response
      const { data: updatedTransfer } = await supabaseAdmin
        .from('bank_transfers')
        .update({
          provider_ref: wioResponse.transferId,
          status: wioResponse.status,
          expected_completion_date: wioResponse.expectedCompletionDate,
          fees_amount: wioResponse.fees,
        })
        .eq('id', transfer.id)
        .select()
        .single();

      return NextResponse.json({
        success: true,
        transfer: updatedTransfer || transfer,
      });

    } catch (providerError) {
      console.error('Wio API error:', providerError);
      
      // Update transfer status to failed
      await supabaseAdmin
        .from('bank_transfers')
        .update({ status: 'failed' })
        .eq('id', transfer.id);

      return NextResponse.json(
        { error: 'Banking provider service unavailable' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Bank transfers POST error:', error);
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