#!/usr/bin/env tsx

import { NiumClient } from '../lib/nium/client';

interface SelfTestConfig {
  baseUrl: string;
  testCustomerHashId?: string;
  testWalletHashId?: string;
}

async function runHealthCheck(baseUrl: string): Promise<boolean> {
  try {
    console.log('🔍 Running NIUM health check...');
    
    const response = await fetch(`${baseUrl}/api/nium/health`);
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Health check passed');
      console.log(`   Environment: ${data.env}`);
      console.log(`   Base URL: ${data.baseUrl}`);
      console.log(`   Request ID: ${data.requestId}`);
      return true;
    } else {
      console.error('❌ Health check failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    return false;
  }
}

async function runQuotePayout(config: SelfTestConfig): Promise<boolean> {
  const { testCustomerHashId, testWalletHashId } = config;
  
  if (!testCustomerHashId || !testWalletHashId) {
    console.log('⚠️  Skipping quote/payout test - TEST_CUSTOMER_HASH_ID and TEST_WALLET_HASH_ID not provided');
    return true;
  }

  try {
    console.log('🔍 Running quote/payout test...');
    
    // Step 1: Get FX Quote
    console.log('   Getting FX quote...');
    const quoteParams = new URLSearchParams({
      customerHashId: testCustomerHashId,
      walletHashId: testWalletHashId,
      sourceCurrency: 'AED',
      destinationCurrency: 'USD',
      amount: '1' // Small test amount
    });
    
    const quoteResponse = await fetch(`${config.baseUrl}/api/nium/payouts/quote?${quoteParams}`);
    const quoteData = await quoteResponse.json();
    
    if (!quoteData.ok) {
      console.error('❌ Quote failed:', quoteData);
      return false;
    }
    
    console.log('✅ Quote generated successfully');
    console.log(`   Audit ID: ${quoteData.auditId}`);
    console.log(`   Rate: ${quoteData.rate}`);
    
    // Note: In a real test, we would execute the payout here
    // For safety in sandbox, we only test the quote
    console.log('ℹ️  Payout execution skipped (dry-run mode)');
    
    return true;
    
  } catch (error) {
    console.error('❌ Quote/payout test error:', error);
    return false;
  }
}

async function runClientTests(): Promise<boolean> {
  try {
    console.log('🔍 Testing NIUM client...');
    
    const client = new NiumClient();
    const config = client.getConfig();
    
    console.log('✅ Client initialized successfully');
    console.log(`   Environment: ${config.env}`);
    console.log(`   Base URL: ${config.baseUrl}`);
    console.log(`   Client Name: ${config.clientName}`);
    
    return true;
  } catch (error) {
    console.error('❌ Client test error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting NIUM Self-Test\n');
  
  const config: SelfTestConfig = {
    baseUrl: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
    testCustomerHashId: process.env.TEST_CUSTOMER_HASH_ID,
    testWalletHashId: process.env.TEST_WALLET_HASH_ID
  };
  
  console.log(`Base URL: ${config.baseUrl}\n`);
  
  const tests = [
    { name: 'Client Initialization', fn: () => runClientTests() },
    { name: 'Health Check', fn: () => runHealthCheck(config.baseUrl) },
    { name: 'Quote/Payout Flow', fn: () => runQuotePayout(config) }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
      console.log(); // Empty line for readability
    } catch (error) {
      console.error(`❌ ${test.name} failed with error:`, error);
      console.log();
    }
  }
  
  console.log('📊 Test Summary:');
  console.log(`   Passed: ${passedTests}/${tests.length}`);
  console.log(`   Status: ${passedTests === tests.length ? '✅ All tests passed' : '❌ Some tests failed'}`);
  
  if (passedTests < tests.length) {
    process.exit(1);
  }
}

// Run the self-test
main().catch((error) => {
  console.error('🚨 Self-test crashed:', error);
  process.exit(1);
});