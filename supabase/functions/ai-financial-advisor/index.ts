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
  
  // Check if OpenAI API key is available
  if (!openAIApiKey) {
    console.log('OpenAI API key not available, generating fallback insights');
    return await generateFallbackInsights(supabase, userId);
  }
  
  try {
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

    // If no financial data, provide general insights
    if (accounts.length === 0 && transactions.length === 0) {
      return await generateFallbackInsights(supabase, userId);
    }

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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert financial advisor AI. Provide practical, data-driven financial advice. Always respond with valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      // If quota exceeded or other API errors, fall back to rule-based insights
      if (response.status === 429 || response.status >= 500) {
        return await generateFallbackInsights(supabase, userId);
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    if (!aiResponse.choices || !aiResponse.choices[0] || !aiResponse.choices[0].message) {
      throw new Error('Invalid OpenAI response format');
    }

    let insightsData;
    try {
      const content = aiResponse.choices[0].message.content.trim();
      // Clean up the response in case it has markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      insightsData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.choices[0].message.content);
      console.error('Parse error:', parseError);
      return await generateFallbackInsights(supabase, userId);
    }

    if (!insightsData.insights || !Array.isArray(insightsData.insights)) {
      console.error('AI response missing insights array');
      return await generateFallbackInsights(supabase, userId);
    }

    // Store insights in database
    const insightsToStore = insightsData.insights.map((insight: any) => ({
      user_id: userId,
      insight_type: insight.type || 'general',
      title: insight.title || 'Financial Insight',
      description: insight.description || 'AI-generated financial recommendation',
      confidence_score: insight.confidence || 0.7,
      data: insight.data || {},
      action_items: insight.actionItems || [],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));

    const { error } = await supabase
      .from('ai_insights')
      .insert(insightsToStore);

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, insights: insightsData.insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generateInsights:', error);
    // Fall back to rule-based insights if AI fails
    return await generateFallbackInsights(supabase, userId);
  }
}

// Fallback function for when OpenAI is not available
async function generateFallbackInsights(supabase: any, userId: string) {
  console.log('Generating fallback insights for user:', userId);
  
  // Get user data for rule-based insights
  const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', userId);
  const { data: transactions } = await supabase.from('transactions').select(`
    *,
    accounts!inner(user_id)
  `).eq('accounts.user_id', userId).limit(50).order('created_at', { ascending: false });

  const fallbackInsights = [];
  const totalBalance = (accounts || []).reduce((sum: number, acc: any) => sum + parseFloat(acc.balance), 0);
  const monthlySpending = calculateMonthlySpending(transactions || []);
  const categoryBreakdown = calculateCategoryBreakdown(transactions || []);

  // Rule-based insight generation
  if (totalBalance > 0) {
    if (totalBalance < monthlySpending * 3) {
      fallbackInsights.push({
        type: 'saving_opportunity',
        title: 'Build Emergency Fund',
        description: `Your current balance of $${totalBalance.toFixed(2)} is below the recommended 3-6 months of expenses. Consider building an emergency fund.`,
        confidence: 0.85,
        actionItems: [
          'Set up automatic savings of 10% of income',
          'Reduce non-essential spending',
          'Consider a high-yield savings account'
        ],
        data: { current_balance: totalBalance, recommended_minimum: monthlySpending * 3 }
      });
    }
  }

  if (monthlySpending > 0) {
    const highestCategory = Object.entries(categoryBreakdown).sort(([,a], [,b]) => b - a)[0];
    if (highestCategory && highestCategory[1] > monthlySpending * 0.3) {
      fallbackInsights.push({
        type: 'spending_pattern',
        title: `High ${highestCategory[0]} Spending`,
        description: `You're spending $${highestCategory[1].toFixed(2)} on ${highestCategory[0]}, which is ${((highestCategory[1]/monthlySpending)*100).toFixed(1)}% of your monthly spending.`,
        confidence: 0.8,
        actionItems: [
          `Set a monthly budget for ${highestCategory[0]}`,
          'Track daily spending in this category',
          'Look for alternatives to reduce costs'
        ],
        data: { category: highestCategory[0], amount: highestCategory[1], percentage: (highestCategory[1]/monthlySpending)*100 }
      });
    }
  }

  // Always include a general financial health insight
  fallbackInsights.push({
    type: 'investment_advice',
    title: 'Investment Diversification',
    description: 'Consider diversifying your investments across different asset classes to reduce risk and potentially increase returns.',
    confidence: 0.75,
    actionItems: [
      'Review current investment portfolio',
      'Consider index funds for diversification',
      'Set up automatic investing'
    ],
    data: { recommendation: 'diversification', priority: 'medium' }
  });

  // Store insights in database
  const insightsToStore = fallbackInsights.map((insight: any) => ({
    user_id: userId,
    insight_type: insight.type,
    title: insight.title,
    description: insight.description,
    confidence_score: insight.confidence,
    data: insight.data,
    action_items: insight.actionItems,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }));

  const { error } = await supabase
    .from('ai_insights')
    .insert(insightsToStore);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, insights: fallbackInsights, fallback: true }),
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
        title: message.length > 47 ? message.substring(0, 47) + '...' : message,
        context: { topic: 'financial_chat', started_at: new Date().toISOString() }
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

  let assistantMessage = '';

  // Try OpenAI first, fall back to rule-based responses
  if (openAIApiKey) {
    try {
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
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful financial advisor AI assistant. Provide practical, actionable financial advice.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (response.ok) {
        const aiResponse = await response.json();
        assistantMessage = aiResponse.choices?.[0]?.message?.content || '';
      } else {
        console.log('OpenAI API error, falling back to rule-based response');
        assistantMessage = generateRuleBasedChatResponse(message);
      }
    } catch (error) {
      console.error('Chat OpenAI error:', error);
      assistantMessage = generateRuleBasedChatResponse(message);
    }
  } else {
    assistantMessage = generateRuleBasedChatResponse(message);
  }

  // Fallback if no response was generated
  if (!assistantMessage) {
    assistantMessage = "I'm here to help with your financial questions! Could you please rephrase your question or ask about budgeting, saving, investing, or debt management?";
  }

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

// Rule-based chat responses for fallback
function generateRuleBasedChatResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('budget') || message.includes('spending')) {
    return "Creating a budget is a great first step! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Start by tracking your expenses for a month to see where your money goes, then set realistic limits for each category.";
  }
  
  if (message.includes('save') || message.includes('emergency fund')) {
    return "Building an emergency fund is crucial for financial security! Aim to save 3-6 months of expenses. Start small - even $25 per week adds up to $1,300 per year. Consider setting up automatic transfers to a high-yield savings account to make saving effortless.";
  }
  
  if (message.includes('invest') || message.includes('stock') || message.includes('retirement')) {
    return "Investing is key to building long-term wealth! Start with diversified index funds which offer broad market exposure with low fees. If your employer offers a 401(k) match, contribute at least enough to get the full match - it's free money! Consider opening an IRA for additional tax-advantaged retirement savings.";
  }
  
  if (message.includes('debt') || message.includes('credit card') || message.includes('loan')) {
    return "Tackling debt strategically can save you thousands! Consider the debt avalanche method (pay minimums on all debts, then focus extra payments on the highest interest rate debt) or the debt snowball method (pay off smallest debts first for psychological wins). Also, try to negotiate lower interest rates with your creditors.";
  }
  
  if (message.includes('credit score') || message.includes('credit report')) {
    return "Your credit score is important for loans and interest rates! Key factors include payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit (10%). Pay bills on time, keep credit utilization below 30%, and check your credit report annually for errors.";
  }
  
  return "I'm here to help with your financial goals! I can provide advice on budgeting, saving, investing, debt management, credit scores, and more. What specific financial topic would you like to discuss?";
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