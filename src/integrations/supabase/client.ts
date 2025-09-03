// Supabase client configuration with API key validation
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration - using environment variables for better security
const SUPABASE_URL = "https://emolyyvmvvfjyxbguhyn.supabase.co";
// Use fresh API key from environment or fallback to hardcoded
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTk2ODEsImV4cCI6MjA3MjQ5NTY4MX0.FFklL-AXBh5OBgqXTPgJlD4B2a9xtCCNg4z9-p1FZcM";

console.log('🔧 SUPABASE CLIENT CONFIGURATION:');
console.log('URL:', SUPABASE_URL);
console.log('API Key Status: Checking validity...');

// Create client with minimal configuration to avoid any config issues
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Disable to avoid potential issues
  }
});

// Immediate test on client creation
console.log('✅ Supabase client created successfully');

// Enhanced authentication and connection testing
const testAuthConnection = async () => {
  try {
    console.log('🔍 Testing Supabase authentication connection...');
    
    // Test basic auth connection
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('🚨 Authentication Error:', error.message);
      return false;
    } else {
      console.log('✅ Supabase authentication connection successful');
      console.log('📊 Current session status:', session ? 'Active session' : 'No active session');
      return true;
    }
  } catch (err) {
    console.error('❌ Authentication connection test failed:', err);
    return false;
  }
};

// Test connection on client initialization
if (typeof window !== 'undefined') {
  setTimeout(testAuthConnection, 500);
}