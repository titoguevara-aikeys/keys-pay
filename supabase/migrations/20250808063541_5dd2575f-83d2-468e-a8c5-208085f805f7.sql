-- AI Financial Assistant Tables
-- Store AI-generated financial insights and recommendations

-- AI Insights table for storing personalized financial analysis
CREATE TABLE public.ai_insights (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    insight_type text NOT NULL, -- 'spending_pattern', 'budget_suggestion', 'saving_opportunity', 'investment_advice'
    title text NOT NULL,
    description text NOT NULL,
    confidence_score numeric NOT NULL DEFAULT 0.5, -- 0-1 scale
    data jsonb NOT NULL DEFAULT '{}', -- Additional structured data
    action_items jsonb DEFAULT '[]', -- Suggested actions
    is_read boolean DEFAULT false,
    is_dismissed boolean DEFAULT false,
    expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI Chat Sessions for conversational interface
CREATE TABLE public.ai_chat_sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    title text,
    context jsonb DEFAULT '{}', -- Financial context for the conversation
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI Chat Messages for storing conversation history
CREATE TABLE public.ai_chat_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL, -- 'user', 'assistant', 'system'
    content text NOT NULL,
    metadata jsonb DEFAULT '{}', -- Additional message data
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Financial Health Scores tracked over time
CREATE TABLE public.financial_health_scores (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    overall_score integer NOT NULL, -- 0-100
    spending_score integer NOT NULL,
    saving_score integer NOT NULL,
    debt_score integer NOT NULL,
    investment_score integer NOT NULL,
    factors jsonb NOT NULL DEFAULT '{}', -- Breakdown of score factors
    recommendations jsonb DEFAULT '[]',
    period_start date NOT NULL,
    period_end date NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_health_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own AI insights" 
ON public.ai_insights 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat sessions" 
ON public.ai_chat_sessions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat messages" 
ON public.ai_chat_messages 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own financial health scores" 
ON public.financial_health_scores 
FOR ALL 
USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.ai_chat_messages 
ADD CONSTRAINT ai_chat_messages_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE;

-- Add updated_at triggers
CREATE TRIGGER update_ai_insights_updated_at
    BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at
    BEFORE UPDATE ON public.ai_chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON public.ai_insights(insight_type);
CREATE INDEX idx_ai_insights_created_at ON public.ai_insights(created_at DESC);

CREATE INDEX idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX idx_ai_chat_messages_created_at ON public.ai_chat_messages(created_at);

CREATE INDEX idx_financial_health_user_id ON public.financial_health_scores(user_id);
CREATE INDEX idx_financial_health_period ON public.financial_health_scores(period_start, period_end);