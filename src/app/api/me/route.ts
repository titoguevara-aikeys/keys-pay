import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Get user organizations
    const { data: organizations, error: orgError } = await supabaseAdmin
      .from('role_memberships')
      .select(`
        role,
        organizations (
          id,
          name,
          country_code,
          kyb_status
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (orgError) {
      console.error('Organizations fetch error:', orgError);
    }

    // Get ledger accounts and balances for user's organizations
    const orgIds = organizations?.map(om => (om as any).organizations?.id).filter(Boolean) || [];
    let balances: any[] = [];
    
    if (orgIds.length > 0) {
      const { data: accounts, error: accountsError } = await supabaseAdmin
        .from('ledger_accounts')
        .select(`
          id,
          account_name,
          currency,
          account_type,
          organization_id
        `)
        .in('organization_id', orgIds)
        .eq('is_active', true);

      if (!accountsError && accounts) {
        // Calculate balances for each account
        for (const account of accounts) {
          const { data: entries } = await supabaseAdmin
            .from('ledger_entries')
            .select('debit_amount, credit_amount')
            .eq('account_id', account.id);

          let balance = 0;
          entries?.forEach(entry => {
            if (entry.debit_amount) balance += Number(entry.debit_amount);
            if (entry.credit_amount) balance -= Number(entry.credit_amount);
          });

          balances.push({
            account_id: account.id,
            account_name: account.account_name,
            currency: account.currency,
            account_type: account.account_type,
            balance,
            organization_id: account.organization_id,
          });
        }
      }
    }

    // Get recent activity (last 10 ledger entries)
    const recentActivity = [];
    if (orgIds.length > 0) {
      const { data: entries } = await supabaseAdmin
        .from('ledger_entries')
        .select(`
          *,
          ledger_accounts (
            account_name,
            currency,
            organization_id
          )
        `)
        .in('organization_id', orgIds)
        .order('created_at', { ascending: false })
        .limit(10);

      recentActivity.push(...(entries || []));
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        profile: profile || null,
      },
      organizations: organizations || [],
      balances,
      recentActivity,
      region: 'GCC',
      features: {
        crypto: true,
        cards: true,
        uae_transfers: true,
        demo_mode: process.env.DEMO_MODE === 'true',
      },
    });

  } catch (error) {
    console.error('API /me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}