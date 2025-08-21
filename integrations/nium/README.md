# NIUM Integration for Keys Pay

This directory contains the complete NIUM sandbox integration for the Keys Pay platform.

## Environment Configuration

Set these exact values in your `.env.local`:

```bash
# == NIUM (SANDBOX) ==
NIUM_ENV=sandbox
NIUM_CLIENT_HASH_ID=a10a45ae-242a-4311-b25f-80adc03be4f6
NIUM_API_KEY=F0ysyZR78L6A7rv538iL04cBEQNxLeG09L6o2Myf
NIUM_CLIENT_NAME=AI KEYS
NIUM_WEBHOOK_PARTNER_KEY=
NIUM_WEBHOOK_PATH=/api/nium/webhook
```

## Base URL Resolution

- **Sandbox**: `https://gateway.nium.com/api`

## Headers Used

All API requests include:

- `x-api-key`: Your NIUM API key
- `x-client-name`: Client name for identification
- `x-request-id`: UUID v4 for request tracking and idempotency
- `Content-Type`: `application/json`

## API Endpoints

### Health Check
```bash
GET /api/nium/health
```

### Wallets
```bash
GET /api/nium/wallets/{customerHashId}
```

### Beneficiaries
```bash
POST /api/nium/beneficiaries
Content-Type: application/json

{
  "customerHashId": "uuid",
  "beneficiaryDetail": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "payoutDetail": {
    "beneficiaryAccountNumber": "1234567890",
    "beneficiaryBankCode": "ADCBAEAA",
    "beneficiaryCountryCode": "AE"
  }
}
```

### FX Quote
```bash
GET /api/nium/payouts/quote?customerHashId={uuid}&walletHashId={uuid}&sourceCurrency=AED&destinationCurrency=USD&amount=100
```

### Transfer Money
```bash
POST /api/nium/payouts/transfer
Content-Type: application/json

{
  "customerHashId": "uuid",
  "walletHashId": "uuid", 
  "auditId": "from-quote-response",
  "amount": 100,
  "currency": "USD",
  "beneficiaryId": "beneficiary-uuid"
}
```

### Payout Status
```bash
GET /api/nium/payouts/status?customerHashId={uuid}&walletHashId={uuid}&systemReferenceNumber={ref}
```

### Virtual Account
```bash
POST /api/nium/virtual-accounts/issue
Content-Type: application/json

{
  "customerHashId": "uuid",
  "walletHashId": "uuid",
  "currency": "AED"
}
```

## cURL Examples

### Add Beneficiary
```bash
curl -X POST http://localhost:3000/api/nium/beneficiaries \
  -H "Content-Type: application/json" \
  -d '{
    "customerHashId": "12345678-1234-1234-1234-123456789012",
    "beneficiaryDetail": {
      "firstName": "Ahmed", 
      "lastName": "Ali"
    },
    "payoutDetail": {
      "beneficiaryAccountNumber": "1234567890123456",
      "beneficiaryBankCode": "ADCBAEAA",
      "beneficiaryCountryCode": "AE"
    }
  }'
```

### Lock FX Rate
```bash
curl "http://localhost:3000/api/nium/payouts/quote?customerHashId=12345678-1234-1234-1234-123456789012&walletHashId=87654321-4321-4321-4321-210987654321&sourceCurrency=AED&destinationCurrency=USD&amount=100"
```

### Execute Transfer
```bash
curl -X POST http://localhost:3000/api/nium/payouts/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "customerHashId": "12345678-1234-1234-1234-123456789012",
    "walletHashId": "87654321-4321-4321-4321-210987654321",
    "auditId": "audit-id-from-quote",
    "amount": 100,
    "currency": "USD",
    "beneficiaryId": "beneficiary-uuid-from-creation"
  }'
```

### Check Status
```bash
curl "http://localhost:3000/api/nium/payouts/status?customerHashId=12345678-1234-1234-1234-123456789012&walletHashId=87654321-4321-4321-4321-210987654321&systemReferenceNumber=SYS12345"
```

## Webhook Configuration

### Register Webhook URL
In your NIUM dashboard, register this webhook URL:
```
https://your-domain.com/api/nium/webhook
```

### Sample Webhook Payloads

#### Payout Initiated
```json
{
  "template": "PAYOUT_INITIATED",
  "systemReferenceNumber": "SYS12345",
  "customerHashId": "12345678-1234-1234-1234-123456789012",
  "walletHashId": "87654321-4321-4321-4321-210987654321",
  "status": "INITIATED",
  "amount": 100,
  "currency": "USD",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Payout Completed
```json
{
  "template": "PAYOUT_PAID",
  "systemReferenceNumber": "SYS12345", 
  "status": "PAID",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

#### Payout Failed
```json
{
  "template": "PAYOUT_REJECTED",
  "systemReferenceNumber": "SYS12345",
  "status": "REJECTED",
  "reason": "Insufficient funds",
  "timestamp": "2024-01-15T10:32:00Z"
}
```

## Status Mapping

Our system maps NIUM statuses to internal status codes:

| NIUM Status | Internal Status | Description |
|------------|----------------|-------------|
| INITIATED | processing | Payout has been initiated |
| PAID | completed | Payout successfully completed |
| REJECTED | failed | Payout was rejected |
| RETURNED | failed | Payout was returned |

## Rate Limiting

- **Global**: 20 requests per second
- **Per Wallet**: 3 requests per second for payout operations
- **Retry**: Exponential backoff on 429/5xx errors with same request ID

## Security

- All webhooks are verified using `x-request-id` for deduplication
- Optional `x-partner-key` verification if `NIUM_WEBHOOK_PARTNER_KEY` is set
- PII is masked in logs
- Request IDs are reused on retries for idempotency

## Testing

Run the self-test:
```bash
npm run nium:selftest
```

With test credentials:
```bash
TEST_CUSTOMER_HASH_ID=uuid TEST_WALLET_HASH_ID=uuid npm run nium:selftest
```

## Admin Interface

Access the NIUM admin panel at:
```
https://your-domain.com/admin/providers/nium
```

Features:
- Health status monitoring
- Beneficiary creation (sandbox)
- FX quote generation
- Test payout execution
- Webhook URL display
- Integration screenshot

## Webhook Health Check

Monitor webhook service:
```bash
curl http://localhost:3000/api/nium/webhook/health
```

## External Health Check

Simple external monitor endpoint:
```bash
curl http://localhost:3000/api/nium/ok
```

## Production Deployment

1. Set environment variables in your deployment platform
2. Register webhook URL in NIUM production dashboard  
3. Update `NIUM_ENV=production` and production base URL
4. Configure `NIUM_WEBHOOK_PARTNER_KEY` for webhook security
5. Set up database for webhook event storage
6. Configure monitoring and alerting

## Support

For NIUM API documentation and support, visit:
- [NIUM Developer Portal](https://docs.nium.com)
- [NIUM Sandbox Environment](https://sandbox.nium.com)