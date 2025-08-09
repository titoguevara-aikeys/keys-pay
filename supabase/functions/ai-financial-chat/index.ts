import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userProfile } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are AIKEYS Financial Assistant, an expert financial advisor with deep knowledge of personal finance, investments, crypto, budgeting, and wealth management.

User Context:
${context ? JSON.stringify(context, null, 2) : 'No specific context provided'}

User Profile:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile data available'}

Guidelines:
- Provide personalized, actionable financial advice
- Use specific numbers and calculations when relevant
- Consider the user's current financial situation from the context
- Be encouraging but realistic
- Always prioritize financial safety and risk management
- Suggest specific actions with timelines
- Reference current market conditions when relevant
- Keep responses conversational but professional
- If you need more information, ask specific questions

Remember: You have access to the user's transaction history, budgets, and financial goals from the context. Use this information to provide highly personalized advice.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-financial-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me about budgeting, saving, investing, or any other financial topics!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});