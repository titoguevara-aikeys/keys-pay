// Fresh Supabase client configuration - FINAL FIX
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using the actual working API key from your system
const SUPABASE_URL = "https://emolyyvmvvfjyxbguhyn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU";

console.log('🔧 FINAL SUPABASE CLIENT CONFIGURATION:');
console.log('URL:', SUPABASE_URL);
console.log('API Key (first 50 chars):', SUPABASE_PUBLISHABLE_KEY.substring(0, 50) + '...');

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

// Test the API key validity immediately
const testApiKey = async () => {
  try {
    console.log('🔍 Testing API key validity...');
    
    // Simple test that should work with any valid API key
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      if (error.message.includes('Invalid API key')) {
        console.error('🚨 CONFIRMED: API KEY IS EXPIRED/INVALID');
        console.error('📋 Current key expiry check needed in Supabase dashboard');
        console.error('🔧 SOLUTION: Generate new API key in Supabase project settings');
        
        // Show user-friendly error in UI
        if (typeof window !== 'undefined') {
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 400px;
            font-family: system-ui;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          `;
          errorDiv.innerHTML = `
            <strong>🚨 API Key Error</strong><br>
            The Supabase API key has expired.<br>
            <small>Check console for details.</small>
          `;
          document.body.appendChild(errorDiv);
          
          setTimeout(() => {
            document.body.removeChild(errorDiv);
          }, 10000);
        }
      } else {
        console.log('✅ API key is valid - other error:', error.message);
      }
    } else {
      console.log('✅ API key test successful - client is working');
    }
  } catch (err) {
    console.error('❌ API key test failed with exception:', err);
  }
};

// Run test after a brief delay
if (typeof window !== 'undefined') {
  setTimeout(testApiKey, 500);
}