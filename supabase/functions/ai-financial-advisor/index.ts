import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Unauthorized');

    const { action, data } = await req.json();
    console.log('AI Financial Advisor request:', action, data);

    switch (action) {
      case 'generate_insights':
        return await generateInsights(supabase, user.id);
      case 'chat':
        return await handleChat(supabase, user.id, data);
      case 'calculate_health_score':
        return await calculateHealthScore(supabase, user.id);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('AI Financial Advisor error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateInsights(supabase: any, userId: string) {
  console.log('Generating insights for user:', userId);
  
  // Fetch user's financial data
  const [accountsResponse, transactionsResponse, budgetsResponse] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('transactions').select(`
      *,
      accounts!inner(user_id)
    `).eq('accounts.user_id', userId).limit(100).order('created_at', { ascending: false }),
    supabase.from('budgets').select('*').eq('user_id', userId)
  ]);

  const accounts = accountsResponse.data || [];
  const transactions = transactionsResponse.data || [];
  const budgets = budgetsResponse.data || [];

  // Prepare financial context for AI
  const financialContext = {
    totalBalance: accounts.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance), 0),
    accountCount: accounts.length,
    recentTransactions: transactions.slice(0, 20),
    monthlySpending: calculateMonthlySpending(transactions),
    categoryBreakdown: calculateCategoryBreakdown(transactions),
    budgets: budgets,
    budgetUtilization: calculateBudgetUtilization(transactions, budgets)
  };

  // Generate AI insights
  const prompt = `
    As a financial advisor AI, analyze this user's financial data and provide actionable insights:
    
    Financial Context:
    - Total Balance: $${financialContext.totalBalance.toFixed(2)}
    - Accounts: ${financialContext.accountCount}
    - Monthly Spending: $${financialContext.monthlySpending.toFixed(2)}
    - Category Breakdown: ${JSON.stringify(financialContext.categoryBreakdown)}
    - Budget Utilization: ${JSON.stringify(financialContext.budgetUtilization)}
    
    Please provide 3-5 specific insights in this JSON format:
    {
      "insights": [
        {
          "type": "spending_pattern|budget_suggestion|saving_opportunity|investment_advice",
          "title": "Brief title",
          "description": "Detailed explanation",
          "confidence": 0.8,
          "actionItems": ["Action 1", "Action 2"],
          "data": {"category": "food", "amount": 500}
        }
      ]
    }
    
    Focus on practical, actionable advice based on their actual spending patterns.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are an expert financial advisor AI. Provide practical, data-driven financial advice.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }),
  });

  const aiResponse = await response.json();
  const insightsData = JSON.parse(aiResponse.choices[0].message.content);

  // Store insights in database
  const insightsToStore = insightsData.insights.map((insight: any) => ({
    user_id: userId,
    insight_type: insight.type,
    title: insight.title,
    description: insight.description,
    confidence_score: insight.confidence,
    data: insight.data || {},
    action_items: insight.actionItems || [],
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }));

  const { error } = await supabase
    .from('ai_insights')
    .insert(insightsToStore);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, insights: insightsData.insights }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleChat(supabase: any, userId: string, chatData: any) {
  const { sessionId, message, createNewSession } = chatData;
  
  let currentSessionId = sessionId;
  
  // Create new session if needed
  if (createNewSession || !sessionId) {
    const { data: newSession, error } = await supabase
      .from('ai_chat_sessions')
      .insert({
        user_id: userId,
        title: message.substring(0, 50) + '...',
        context: {}
      })
      .select()
      .single();
    
    if (error) throw error;
    currentSessionId = newSession.id;
  }

  // Store user message
  await supabase
    .from('ai_chat_messages')
    .insert({
      session_id: currentSessionId,
      user_id: userId,
      role: 'user',
      content: message
    });

  // Get user's financial context
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`*, accounts!inner(user_id)`)
    .eq('accounts.user_id', userId)
    .limit(20)
    .order('created_at', { ascending: false });

  const financialSummary = {
    totalBalance: accounts?.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance), 0) || 0,
    accountCount: accounts?.length || 0,
    recentTransactionCount: recentTransactions?.length || 0
  };

  // Generate AI response
  const prompt = `
    You are a knowledgeable financial advisor. The user has asked: "${message}"
    
    User's Financial Context:
    - Total Balance: $${financialSummary.totalBalance.toFixed(2)}
    - Number of Accounts: ${financialSummary.accountCount}
    - Recent Transactions: ${financialSummary.recentTransactionCount}
    
    Provide helpful, personalized financial advice. Be conversational but professional.
    Keep responses under 300 words and focus on actionable advice.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are a helpful financial advisor AI assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  const aiResponse = await response.json();
  const assistantMessage = aiResponse.choices[0].message.content;

  // Store AI response
  await supabase
    .from('ai_chat_messages')
    .insert({
      session_id: currentSessionId,
      user_id: userId,
      role: 'assistant',
      content: assistantMessage
    });

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: assistantMessage, 
      sessionId: currentSessionId 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateHealthScore(supabase: any, userId: string) {
  // Fetch financial data
  const [accountsResponse, transactionsResponse, budgetsResponse] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('transactions').select(`
      *,
      accounts!inner(user_id)
    `).eq('accounts.user_id', userId).limit(100).order('created_at', { ascending: false }),
    supabase.from('budgets').select('*').eq('user_id', userId)
  ]);

  const accounts = accountsResponse.data || [];
  const transactions = transactionsResponse.data || [];
  const budgets = budgetsResponse.data || [];

  // Calculate scores (0-100)
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance), 0);
  const monthlyIncome = calculateMonthlyIncome(transactions);
  const monthlySpending = calculateMonthlySpending(transactions);
  
  const spendingScore = Math.min(100, Math.max(0, 100 - (monthlySpending / monthlyIncome) * 100));
  const savingScore = Math.min(100, (totalBalance / (monthlyIncome * 3)) * 100); // 3 months emergency fund
  const debtScore = 85; // Placeholder - would calculate based on debt data
  const investmentScore = 60; // Placeholder - would calculate based on investment data
  
  const overallScore = Math.round((spendingScore + savingScore + debtScore + investmentScore) / 4);

  const healthScore = {
    user_id: userId,
    overall_score: overallScore,
    spending_score: Math.round(spendingScore),
    saving_score: Math.round(savingScore),
    debt_score: debtScore,
    investment_score: investmentScore,
    factors: {
      totalBalance,
      monthlyIncome,
      monthlySpending,
      savingsRatio: totalBalance / (monthlyIncome || 1)
    },
    recommendations: generateRecommendations(spendingScore, savingScore, debtScore, investmentScore),
    period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    period_end: new Date().toISOString().split('T')[0]
  };

  // Store in database
  const { error } = await supabase
    .from('financial_health_scores')
    .upsert(healthScore, { 
      onConflict: 'user_id,period_start,period_end'
    });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, healthScore }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
function calculateMonthlySpending(transactions: any[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return transactions
    .filter(t => t.transaction_type === 'debit' && new Date(t.created_at) >= monthStart)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

function calculateMonthlyIncome(transactions: any[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return transactions
    .filter(t => t.transaction_type === 'credit' && new Date(t.created_at) >= monthStart)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

function calculateCategoryBreakdown(transactions: any[]) {
  const breakdown: { [key: string]: number } = {};
  
  transactions
    .filter(t => t.transaction_type === 'debit')
    .forEach(t => {
      const category = t.category || 'other';
      breakdown[category] = (breakdown[category] || 0) + parseFloat(t.amount);
    });
  
  return breakdown;
}

function calculateBudgetUtilization(transactions: any[], budgets: any[]) {
  const utilization: { [key: string]: number } = {};
  const monthlySpending = calculateCategoryBreakdown(transactions);
  
  budgets.forEach(budget => {
    const spent = monthlySpending[budget.category] || 0;
    utilization[budget.category] = (spent / parseFloat(budget.amount)) * 100;
  });
  
  return utilization;
}

function generateRecommendations(spending: number, saving: number, debt: number, investment: number) {
  const recommendations = [];
  
  if (spending < 70) {
    recommendations.push("Consider creating a detailed budget to track your spending");
  }
  if (saving < 60) {
    recommendations.push("Build an emergency fund with 3-6 months of expenses");
  }
  if (investment < 70) {
    recommendations.push("Explore investment options to grow your wealth");
  }
  
  return recommendations;
}