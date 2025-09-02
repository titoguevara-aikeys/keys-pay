// Fresh Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using exact credentials from system configuration
const SUPABASE_URL = "https://emolyyvmvvfjyxbguhyn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU";

console.log('🔧 Supabase Client Configuration:', {
  url: SUPABASE_URL,
  keyPrefix: SUPABASE_PUBLISHABLE_KEY.substring(0, 50) + '...',
  keyLength: SUPABASE_PUBLISHABLE_KEY.length
});

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: window?.localStorage || undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection on load
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase Connection Error:', error);
  } else {
    console.log('✅ Supabase Connected Successfully:', data?.session ? 'With session' : 'No session');
  }
}).catch(err => {
  console.error('❌ Supabase Initialization Failed:', err);
});