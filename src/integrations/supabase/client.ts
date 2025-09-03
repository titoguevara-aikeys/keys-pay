// Supabase client configuration with API key validation
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration
const SUPABASE_URL = "https://emolyyvmvvfjyxbguhyn.supabase.co";
// Note: This key may need to be regenerated if authentication fails
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU";

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

// Enhanced API key validation with detailed error reporting
const testApiKey = async () => {
  try {
    console.log('🔍 Testing API key validity...');
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      if (error.message.includes('Invalid API key') || error.message.includes('Invalid authentication credentials')) {
        console.error('🚨 CRITICAL: SUPABASE API KEY IS INVALID/EXPIRED');
        console.error('📋 Project ID:', 'emolyyvmvvfjyxbguhyn');
        console.error('🔧 REQUIRED ACTION: Regenerate API keys in Supabase dashboard');
        console.error('📍 Dashboard URL: https://supabase.com/dashboard/project/emolyyvmvvfjyxbguhyn/settings/api');
        
        // Show critical error notification
        if (typeof window !== 'undefined') {
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            border: 2px solid #dc2626;
            color: white;
            padding: 24px;
            border-radius: 12px;
            z-index: 10000;
            max-width: 500px;
            font-family: system-ui;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            text-align: center;
          `;
          errorDiv.innerHTML = `
            <h3 style="color: #dc2626; margin-top: 0;">🚨 Authentication Error</h3>
            <p>The Supabase API key has expired and needs to be regenerated.</p>
            <p style="font-size: 14px; color: #aaa;">
              Please regenerate the anon key in your Supabase dashboard:<br>
              <strong>Project Settings → API → Generate new anon key</strong>
            </p>
            <button onclick="this.parentElement.remove()" 
                    style="background: #dc2626; border: none; color: white; padding: 8px 16px; 
                           border-radius: 4px; cursor: pointer; margin-top: 16px;">
              Close
            </button>
          `;
          document.body.appendChild(errorDiv);
        }
        
        return false;
      } else {
        console.log('✅ API key valid - different error:', error.message);
        return true;
      }
    } else {
      console.log('✅ Supabase connection successful - API key is valid');
      return true;
    }
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
};

// Run test after a brief delay
if (typeof window !== 'undefined') {
  setTimeout(testApiKey, 500);
}