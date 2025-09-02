import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface APIRequest {
  action: string;
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, data }: APIRequest = await req.json()

    let result: any = { success: false }

    switch (action) {
      case 'get_dashboard_data':
        // Fetch user's financial overview
        const [cardsResult, balanceResult, transactionsResult] = await Promise.all([
          supabaseClient
            .from('cards')
            .select('*')
            .eq('accounts.user_id', user.id),
          supabaseClient
            .from('accounts')
            .select('balance, currency')
            .eq('user_id', user.id),
          supabaseClient
            .from('transactions')
            .select('*')
            .eq('accounts.user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        ])

        result = {
          success: true,
          data: {
            cards: cardsResult.data || [],
            accounts: balanceResult.data || [],
            recentTransactions: transactionsResult.data || [],
            summary: {
              totalBalance: balanceResult.data?.reduce((acc, account) => acc + Number(account.balance), 0) || 0,
              totalCards: cardsResult.data?.length || 0,
              monthlySpending: 0 // Would calculate from transactions
            }
          }
        }
        break

      case 'create_organization':
        const { data: orgData, error: orgError } = await supabaseClient
          .from('organizations')
          .insert({
            name: data.organizationName,
            type: data.organizationType,
            country_code: data.countryCode || 'AE'
          })
          .select()
          .single()

        if (orgError) throw orgError

        // Create role membership
        await supabaseClient
          .from('role_memberships')
          .insert({
            user_id: user.id,
            organization_id: orgData.id,
            role: 'owner',
            app_role: 'user'
          })

        result = { success: true, data: orgData }
        break

      case 'issue_virtual_card':
        // Get user's account
        const { data: accounts } = await supabaseClient
          .from('accounts')
          .select('id')
          .eq('user_id', user.id)
          .eq('account_type', 'checking')
          .limit(1)

        if (!accounts || accounts.length === 0) {
          throw new Error('No account found')
        }

        // Generate card data
        const cardNumber = '4532' + Math.random().toString().slice(2, 14)
        const { data: cardData, error: cardError } = await supabaseClient
          .from('cards')
          .insert({
            account_id: accounts[0].id,
            card_number: cardNumber,
            card_type: data.cardType || 'virtual',
            card_status: 'active',
            provider: 'nymcard',
            last_four: cardNumber.slice(-4),
            expiry_month: 12,
            expiry_year: 2027,
            cvv: Math.floor(Math.random() * 900 + 100).toString(),
            spending_limits: {
              daily: data.dailyLimit || 500,
              monthly: data.spendingLimit || 2000,
              perTransaction: data.perTransactionLimit || 250
            },
            card_controls: {
              online_purchases: true,
              international_transactions: false,
              atm_withdrawals: false,
              contactless_payments: true
            }
          })
          .select()
          .single()

        if (cardError) throw cardError

        result = { success: true, data: cardData }
        break

      case 'get_crypto_quote':
        // Mock crypto quote - in production, this would call Guardarian API
        result = {
          success: true,
          data: {
            fromCurrency: data.fromCurrency || 'AED',
            toCurrency: data.toCurrency || 'USDC',
            fromAmount: data.amount,
            toAmount: (data.amount / 3.67) * 0.98, // Mock conversion rate with fees
            exchangeRate: 0.27,
            fee: data.amount * 0.02,
            estimatedTime: '5-10 minutes',
            provider: 'guardarian'
          }
        }
        break

      case 'health_check':
        result = {
          success: true,
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
              database: 'online',
              authentication: 'online',
              edge_functions: 'online'
            }
          }
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('KeysPay API Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})