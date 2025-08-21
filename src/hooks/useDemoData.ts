import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';

export const useInsertDemoData = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Insert demo AI insights
      const demoInsights = [
        {
          user_id: user.id,
          insight_type: 'spending',
          title: 'High Coffee Spending Alert',
          description: 'You\'ve spent $127 on coffee this month, which is 23% above your usual pattern. Consider making coffee at home to save around $45/month.',
          confidence_score: 0.85,
          data: {
            category: 'dining',
            amount: 127,
            comparison: 'above_average',
            savings_potential: 45
          },
          action_items: [
            'Set a monthly coffee budget of $80',
            'Try making coffee at home 3 days per week',
            'Use a coffee subscription service for better prices'
          ]
        },
        {
          user_id: user.id,
          insight_type: 'saving',
          title: 'Emergency Fund Opportunity',
          description: 'Based on your income and expenses, you could save an additional $200/month by optimizing your subscriptions and recurring payments.',
          confidence_score: 0.78,
          data: {
            potential_savings: 200,
            current_subscriptions: 12,
            unused_subscriptions: 3
          },
          action_items: [
            'Cancel 3 unused subscriptions',
            'Set up automatic savings transfer',
            'Review all recurring payments monthly'
          ]
        },
        {
          user_id: user.id,
          insight_type: 'investment',
          title: 'Investment Diversification Needed',
          description: 'Your portfolio is heavily weighted in tech stocks (78%). Consider diversifying across sectors and asset classes.',
          confidence_score: 0.82,
          data: {
            tech_allocation: 78,
            recommended_tech: 40,
            suggested_rebalance: true
          },
          action_items: [
            'Reduce tech allocation to 40%',
            'Add bonds and international exposure',
            'Consider index funds for diversification'
          ]
        }
      ];

      const { error: insightsError } = await supabase
        .from('ai_insights')
        .insert(demoInsights);

      if (insightsError) throw insightsError;

      // Insert demo financial health score
      const demoHealthScore = {
        user_id: user.id,
        overall_score: 78,
        spending_score: 72,
        saving_score: 85,
        debt_score: 88,
        investment_score: 65,
        period_start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
        period_end: new Date().toISOString().split('T')[0], // Today
        factors: {
          spending: {
            monthly_budget_adherence: 0.85,
            category_balance: 0.72,
            impulse_purchases: 0.15
          },
          saving: {
            emergency_fund_months: 4.2,
            savings_rate: 0.22,
            goal_progress: 0.78
          },
          debt: {
            debt_to_income: 0.12,
            payment_history: 1.0,
            credit_utilization: 0.25
          },
          investment: {
            diversification: 0.65,
            contribution_consistency: 0.85,
            risk_alignment: 0.72
          }
        },
        recommendations: [
          {
            category: 'spending',
            title: 'Optimize Subscription Management',
            description: 'Review and cancel unused subscriptions to improve budget adherence',
            priority: 'medium'
          },
          {
            category: 'investment',
            title: 'Diversify Portfolio',
            description: 'Reduce tech stock concentration and add international exposure',
            priority: 'high'
          },
          {
            category: 'saving',
            title: 'Increase Emergency Fund',
            description: 'Aim for 6 months of expenses in emergency savings',
            priority: 'medium'
          }
        ]
      };

      const { error: healthError } = await supabase
        .from('financial_health_scores')
        .insert(demoHealthScore);

      if (healthError) throw healthError;

      // Insert demo chat session and messages
      const { data: sessionData, error: sessionError } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          title: 'Financial Planning Discussion',
          context: {
            topic: 'budgeting',
            started_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const demoMessages = [
        {
          user_id: user.id,
          session_id: sessionData.id,
          role: 'user',
          content: 'I want to create a better budget for next month. Can you help me analyze my spending?'
        },
        {
          user_id: user.id,
          session_id: sessionData.id,
          role: 'assistant',
          content: 'I\'d be happy to help you create a better budget! Based on your recent spending patterns, I can see a few areas where we can optimize:\n\n1. **Dining & Coffee**: You\'ve been spending about $127/month on coffee and $340 on dining out. We could set targets to reduce these.\n\n2. **Subscriptions**: I noticed you have 12 active subscriptions totaling $89/month, with 3 that haven\'t been used recently.\n\n3. **Emergency Savings**: Your current savings rate is strong at 22%, but we could potentially increase this to 25% with some adjustments.\n\nWould you like to focus on any particular category first?'
        },
        {
          user_id: user.id,
          session_id: sessionData.id,
          role: 'user',
          content: 'Let\'s focus on the subscriptions first. Which ones should I cancel?'
        },
        {
          user_id: user.id,
          session_id: sessionData.id,
          role: 'assistant',
          content: 'Great choice! Subscriptions are often the easiest wins for budget optimization. Based on your usage patterns, here are the subscriptions I\'d recommend reviewing:\n\n**Consider Canceling:**\n• Premium Music Service #2 ($9.99/month) - You have two music services\n• Fitness App Pro ($14.99/month) - No usage in 3 months\n• Magazine Subscription ($7.99/month) - Minimal engagement\n\n**Total potential savings: $32.97/month = $395.64/year**\n\n**Keep These:**\n• Netflix ($15.99) - Regular usage\n• Spotify ($9.99) - Daily usage\n• Cloud Storage ($5.99) - Essential for work\n\nWould you like me to walk you through how to cancel these, or shall we move on to optimizing your dining budget?'
        }
      ];

      const { error: messagesError } = await supabase
        .from('ai_chat_messages')
        .insert(demoMessages);

      if (messagesError) throw messagesError;

      return { success: true };
    },
  });
};