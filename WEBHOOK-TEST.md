# Circle Webhook Testing Guide

## Overview
This guide provides comprehensive testing procedures for the Circle webhook integration in AIKeys Wallet.

## Webhook Endpoint
- **URL**: `https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook`
- **Method**: POST
- **Authentication**: HMAC-SHA256 signature verification
- **Content-Type**: application/json

## Test Scenarios

### 1. Valid Signature Test

#### Generate Test Signature
```bash
# Using OpenSSL to generate HMAC signature
echo -n '{"eventType":"payments.confirmed","eventId":"test-12345","paymentId":"pay-123","amount":{"amount":"10.00","currency":"USDC"}}' | \
openssl dgst -sha256 -hmac "your_webhook_secret" | \
awk '{print "v1="$2}'
```

#### Test Request
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=GENERATED_SIGNATURE_HERE" \
  -d '{
    "eventType": "payments.confirmed",
    "eventId": "test-12345",
    "paymentId": "pay-123",
    "amount": {
      "amount": "10.00",
      "currency": "USDC"
    },
    "payment": {
      "status": "confirmed"
    }
  }'
```

#### Expected Response (200 OK)
```json
{
  "status": "success",
  "eventId": "test-12345",
  "eventType": "payments.confirmed",
  "processedAt": "2024-01-15T10:30:00Z"
}
```

### 2. Invalid Signature Test

#### Test Request
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=invalid_signature_here" \
  -d '{
    "eventType": "payments.confirmed",
    "eventId": "test-67890"
  }'
```

#### Expected Response (401 Unauthorized)
```json
{
  "error": "Unauthorized"
}
```

### 3. Idempotency Test

#### First Request
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=VALID_SIGNATURE" \
  -d '{
    "eventType": "payments.confirmed",
    "eventId": "idempotent-test-001",
    "paymentId": "pay-456"
  }'
```

#### Second Request (Same Event ID)
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=VALID_SIGNATURE" \
  -d '{
    "eventType": "payments.confirmed",
    "eventId": "idempotent-test-001",
    "paymentId": "pay-456"
  }'
```

#### Expected Response (200 OK)
```json
{
  "status": "already_processed"
}
```

### 4. Payment Failed Event Test

#### Test Request
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=VALID_SIGNATURE" \
  -d '{
    "eventType": "payments.failed",
    "eventId": "fail-test-001",
    "paymentId": "pay-failed-123",
    "failure": {
      "code": "insufficient_funds",
      "message": "Insufficient balance"
    },
    "payment": {
      "status": "failed"
    }
  }'
```

#### Expected Response (200 OK)
```json
{
  "status": "success",
  "eventId": "fail-test-001",
  "eventType": "payments.failed",
  "processedAt": "2024-01-15T10:35:00Z"
}
```

### 5. Wallet Created Event Test

#### Test Request
```bash
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=VALID_SIGNATURE" \
  -d '{
    "eventType": "wallets.created",
    "eventId": "wallet-test-001",
    "walletId": "wallet-new-123",
    "wallet": {
      "id": "wallet-new-123",
      "state": "LIVE",
      "balances": []
    }
  }'
```

#### Expected Response (200 OK)
```json
{
  "status": "success",
  "eventId": "wallet-test-001",
  "eventType": "wallets.created",
  "processedAt": "2024-01-15T10:40:00Z"
}
```

## Production Testing

### 1. Circle Dashboard Configuration
1. Log in to Circle dashboard
2. Navigate to **Webhooks** section
3. Add webhook endpoint:
   - URL: `https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook`
   - Events: `payments.confirmed`, `payments.failed`, `wallets.created`
4. Save webhook secret for Supabase configuration

### 2. Test with Real Circle Events
```bash
# Trigger a test payment in Circle dashboard
# Monitor webhook logs
supabase functions logs payments-circle-webhook --follow

# Check for successful processing
curl https://emolyyvmvvfjyxbguhyn.functions.supabase.co/health
```

## Verification Steps

### 1. Database Verification
```sql
-- Check idempotency keys were created
SELECT * FROM public.idempotency_keys 
WHERE provider = 'circle' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check payment events were stored
SELECT * FROM public.payment_events 
ORDER BY created_at DESC 
LIMIT 10;

-- Check circle_transactions were updated
SELECT * FROM public.circle_transactions 
WHERE webhook_received_at IS NOT NULL 
ORDER BY updated_at DESC 
LIMIT 5;
```

### 2. Log Verification
```bash
# Check webhook function logs
supabase functions logs payments-circle-webhook --limit 20

# Look for successful processing messages
# Format: [REQUEST_ID] Successfully processed event EVENT_ID
```

### 3. Security Event Verification
```sql
-- Check for any security events (should be none for valid requests)
SELECT * FROM public.security_events 
WHERE event_type = 'WEBHOOK_SIGNATURE_INVALID' 
AND created_at > now() - interval '1 hour';
```

## Load Testing

### 1. Basic Load Test
```bash
#!/bin/bash
# load_test.sh - Send multiple concurrent requests

for i in {1..10}; do
  curl -X POST \
    https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
    -H "Content-Type: application/json" \
    -H "circle-signature: v1=VALID_SIGNATURE" \
    -d "{\"eventType\":\"payments.confirmed\",\"eventId\":\"load-test-$i\"}" &
done

wait
echo "Load test completed"
```

### 2. Performance Expectations
- **Response Time**: < 2 seconds for 95% of requests
- **Throughput**: > 100 requests per minute
- **Error Rate**: < 1% for valid requests
- **Memory Usage**: < 50MB per function execution

## Troubleshooting

### Common Issues

#### 1. Signature Verification Fails
**Symptoms**: 401 responses, "Invalid webhook signature" in logs
**Solutions**:
- Verify webhook secret matches Circle dashboard
- Check signature generation algorithm
- Ensure request body is exactly as sent (no modifications)

#### 2. Database Connection Errors
**Symptoms**: 500 responses, database connectivity errors in logs
**Solutions**:
- Check Supabase project status
- Verify service role key is configured
- Review database connection limits

#### 3. Idempotency Issues
**Symptoms**: Duplicate processing, constraint violations
**Solutions**:
- Check idempotency_keys table for conflicts
- Verify event IDs are unique per provider
- Review concurrent request handling

### Debug Commands
```bash
# Check webhook function status
supabase functions list | grep payments-circle-webhook

# View recent function logs with errors only
supabase functions logs payments-circle-webhook --level error --limit 50

# Check database connectivity from function
supabase functions logs payments-circle-webhook --filter "Database"

# Monitor real-time webhook calls
supabase functions logs payments-circle-webhook --follow
```

## Circle Webhook Events Reference

### Supported Event Types
- `payments.confirmed` - Payment successfully completed
- `payments.failed` - Payment failed or rejected
- `wallets.created` - New wallet created
- `transfers.completed` - Transfer completed (if applicable)

### Event Payload Structure
```json
{
  "eventType": "payments.confirmed",
  "eventId": "unique-event-id",
  "paymentId": "circle-payment-id",
  "walletId": "circle-wallet-id",
  "amount": {
    "amount": "10.50",
    "currency": "USDC"
  },
  "payment": {
    "id": "circle-payment-id",
    "status": "confirmed",
    "sourceAddress": "0x...",
    "destinationAddress": "0x...",
    "transactionHash": "0x..."
  },
  "createDate": "2024-01-15T10:30:00Z"
}
```

## Monitoring & Alerts

### Production Monitoring
- Set up alerts for webhook processing failures
- Monitor response times and error rates
- Track idempotency key growth patterns
- Alert on signature verification failures

### Key Metrics
- **Success Rate**: > 99% for valid webhooks
- **Processing Time**: < 1 second average
- **Idempotency Effectiveness**: 100% duplicate detection
- **Security**: 0 invalid signature acceptances

---
**Document Version**: 1.0  
**Last Updated**: $(date)  
**Test Environment**: Sandbox (update for production)