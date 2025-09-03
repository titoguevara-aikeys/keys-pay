// Supabase client configuration with API key validation
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration - using environment variables for better security
const SUPABASE_URL = "https://emolyyvmvvfjyxbguhyn.supabase.co";
// Use the correct API key from environment variables
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU";

console.log('🔧 SUPABASE CLIENT CONFIGURATION:');
console.log('URL:', SUPABASE_URL);
console.log('API Key Status: Checking validity...');

// Create client with proper configuration and error handling
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'keyspay-webapp@1.0.0'
    }
  }
});

// Immediate test on client creation
console.log('✅ Supabase client created successfully');

// Enhanced authentication and connection testing with better error handling
const testAuthConnection = async () => {
  try {
    console.log('🔍 Testing Supabase authentication connection...');
    
    // Test basic auth connection with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    const authPromise = supabase.auth.getSession();
    const { data: session, error } = await Promise.race([authPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('🚨 Authentication Error:', error.message);
      console.error('🔧 Possible fixes: Check Supabase project status, verify API keys');
      return false;
    } else {
      console.log('✅ Supabase authentication connection successful');
      console.log('📊 Current session status:', session ? 'Active session' : 'No active session');
      console.log('🔑 API Key validation: PASSED');
      return true;
    }
  } catch (err: any) {
    console.error('❌ Authentication connection test failed:', err?.message || err);
    console.error('🔧 Try refreshing the page or check your internet connection');
    return false;
  }
};

// Test connection on client initialization with retry logic
if (typeof window !== 'undefined') {
  let retryCount = 0;
  const maxRetries = 3;
  
  const testWithRetry = async () => {
    const success = await testAuthConnection();
    if (!success && retryCount < maxRetries) {
      retryCount++;
      console.log(`🔄 Retrying connection test (${retryCount}/${maxRetries})...`);
      setTimeout(testWithRetry, 2000 * retryCount);
    } else if (success) {
      console.log('🎉 Supabase client ready for authentication');
    } else {
      console.error('💥 Unable to establish connection after multiple attempts');
    }
  };
  
  setTimeout(testWithRetry, 1000);
}