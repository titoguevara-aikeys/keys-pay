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

// Inline diagnostic test to avoid import issues
const runDiagnostic = async () => {
  console.log('🔍 SUPABASE API KEY DIAGNOSTIC');
  console.log('==============================');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ AUTH SESSION ERROR:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      
      if (error.message.includes('Invalid API key')) {
        console.error('🚨 CRITICAL: API KEY IS INVALID');
        console.error('🔧 SOLUTION: The API key in your project is expired or incorrect');
        console.error('📋 KEY BEING USED:', SUPABASE_PUBLISHABLE_KEY.substring(0, 50) + '...');
      }
    } else {
      console.log('✅ AUTH SERVICE ACCESSIBLE');
    }
    
    // Test signup to verify API key validity
    const testResult = await supabase.auth.signUp({
      email: 'diagnostic@test.com',
      password: 'testpass123'
    });
    
    if (testResult.error) {
      if (testResult.error.message.includes('Invalid API key')) {
        console.error('🚨 CONFIRMED: API KEY IS INVALID');
      } else {
        console.log('✅ API KEY IS VALID (signup error is normal):', testResult.error.message);
      }
    }
    
  } catch (err) {
    console.error('❌ DIAGNOSTIC FAILED:', err);
  }
  
  console.log('🏁 DIAGNOSTIC COMPLETE');
};

// Run diagnostic after a short delay
if (typeof window !== 'undefined') {
  setTimeout(runDiagnostic, 1000);
}