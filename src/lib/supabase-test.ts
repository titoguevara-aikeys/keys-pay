// Supabase Connection Test - Fresh Diagnostic
import { createClient } from '@supabase/supabase-js';

// Test with multiple API key configurations
const configs = [
  {
    name: 'Current .env Key',
    url: 'https://emolyyvmvvfjyxbguhyn.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU'
  }
];

export const testSupabaseConnection = async () => {
  console.log('🔍 SUPABASE CONNECTION DIAGNOSTIC TEST');
  console.log('=====================================');
  
  for (const config of configs) {
    console.log(`\n📡 Testing: ${config.name}`);
    console.log(`URL: ${config.url}`);
    console.log(`Key: ${config.key.substring(0, 50)}...`);
    
    try {
      const testClient = createClient(config.url, config.key, {
        auth: {
          storage: window?.localStorage || undefined,
          persistSession: false,
          autoRefreshToken: false
        }
      });
      
      // Test 1: Basic connection
      console.log('⚡ Test 1: Basic client creation - SUCCESS');
      
      // Test 2: Auth service availability
      const { data, error } = await testClient.auth.getSession();
      
      if (error) {
        console.error(`❌ Test 2: Auth service failed:`, {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
      } else {
        console.log('✅ Test 2: Auth service available - SUCCESS');
        console.log('📊 Session data:', data.session ? 'Session exists' : 'No session (normal)');
      }
      
      // Test 3: Try a simple auth operation
      try {
        const signUpTest = await testClient.auth.signUp({
          email: 'test@example.com',
          password: 'testpassword123'
        });
        
        if (signUpTest.error) {
          if (signUpTest.error.message.includes('Invalid API key')) {
            console.error('❌ Test 3: API KEY IS INVALID');
            console.error('🔧 Solution needed: Check Supabase project settings');
          } else {
            console.log('✅ Test 3: API key valid (other error is expected):', signUpTest.error.message);
          }
        } else {
          console.log('✅ Test 3: Signup test passed');
        }
      } catch (testError) {
        console.error('❌ Test 3: Signup test exception:', testError);
      }
      
    } catch (clientError) {
      console.error(`❌ Failed to create client:`, clientError);
    }
  }
  
  console.log('\n🏁 DIAGNOSTIC COMPLETE');
  console.log('=====================================');
};

// Auto-run test when module loads
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testSupabaseConnection();
  }, 1000);
}