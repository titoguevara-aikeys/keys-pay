-- Fix security_events table to allow anonymous logging for development
ALTER TABLE public.security_events ALTER COLUMN user_id DROP NOT NULL;

-- Add index for better performance on nullable user_id
CREATE INDEX IF NOT EXISTS idx_security_events_anonymous 
ON public.security_events (created_at, event_type) 
WHERE user_id IS NULL;