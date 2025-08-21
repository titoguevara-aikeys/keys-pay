# Keys Pay - Quick Start Guide

## Prerequisites

- Node.js 18+ 
- Docker (optional, for local development)
- Postman (for API testing)

## 1. Environment Setup

Copy the sample environment file and configure your credentials:

```bash
cp .env.sample .env
```

**Required Configuration**:

```bash
# Global
APP_PUBLIC_URL=http://localhost:3000
PORT=3000
JWT_SECRET=your_secure_jwt_secret_here
HMAC_SHARED_SECRET=your_hmac_secret_here

# Feature Flags
RAMP_ENABLED=true
NIUM_ENABLED=true
OPENPAYD_ENABLED=false

# Ramp (Live)
RAMP_API_KEY=your_ramp_api_key
RAMP_SECRET=your_ramp_secret
RAMP_WEBHOOK_SECRET=your_ramp_webhook_secret

# Nium (Live) 
NIUM_CLIENT_ID=your_nium_client_id
NIUM_CLIENT_SECRET=your_nium_client_secret
NIUM_WEBHOOK_SECRET=your_nium_webhook_secret
```

## 2. Installation & Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or with Docker
docker-compose up
```

Server will be available at: http://localhost:3000

## 3. Health Check

Verify the API is running:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "keyspay",
  "version": "1.0.0",
  "providers": {
    "ramp": true,
    "nium": true,
    "openpayd": false
  }
}
```

## 4. Provider Status

Check which providers are enabled:

```bash
curl http://localhost:3000/api/providers
```

## 5. API Testing with Postman

1. Import the Postman collection: `postman/KeysPay.collection.json`
2. Set environment variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `hmacSecret`: Your HMAC secret from `.env`

The collection includes pre-request scripts that automatically generate HMAC signatures.

## 6. Test Flows

### Create Ramp Session (Buy/Sell Crypto)

```bash
curl -X POST http://localhost:3000/api/ramp/session \
  -H "Content-Type: application/json" \
  -H "x-timestamp: $(date +%s)000" \
  -H "x-signature: YOUR_HMAC_SIGNATURE" \
  -d '{
    "fiatCurrency": "AED",
    "fiatAmount": 500,
    "asset": "BTC", 
    "country": "AE"
  }'
```

### Get Payout Quote (Nium)

```bash
curl -X POST http://localhost:3000/api/payouts/quote \
  -H "Content-Type: application/json" \
  -H "x-timestamp: $(date +%s)000" \
  -H "x-signature: YOUR_HMAC_SIGNATURE" \
  -d '{
    "sourceCurrency": "AED",
    "targetCurrency": "USD",
    "amount": 1000
  }'
```

## 7. Webhook Testing

### Ramp Webhook
```bash
curl -X POST http://localhost:3000/api/ramp/webhook \
  -H "Content-Type: application/json" \
  -H "x-ramp-signature: test_signature" \
  -H "x-ramp-timestamp: $(date +%s)" \
  -d '{"event": "payment.completed", "reference": "test_ref"}'
```

### Nium Webhook
```bash  
curl -X POST http://localhost:3000/api/nium/webhook \
  -H "Content-Type: application/json" \
  -H "x-nium-signature: test_signature" \
  -H "x-nium-timestamp: $(date +%s)" \
  -d '{"event": "payout.processed", "payoutId": "test_payout"}'
```

## 8. Feature Flags

To enable/disable providers, update your `.env` file:

```bash
# Disable Ramp
RAMP_ENABLED=false

# Enable OpenPayd (when approved)
OPENPAYD_ENABLED=true
```

Restart the server for changes to take effect.

## 9. Compliance

Every API response includes compliance disclaimers:

- **Ramp flows**: "Powered by Ramp. Keys Pay is an aggregator platform."  
- **Nium flows**: "Powered by Nium. Keys Pay is an aggregator platform."
- **OpenPayd flows**: Returns HTTP 403 when disabled

## Troubleshooting

### Common Issues

1. **401 Authentication Failed**: Check HMAC signature generation
2. **403 Provider Disabled**: Check feature flags in `.env`
3. **Provider API Errors**: Verify provider credentials

### Logs

Check application logs for detailed error information:
```bash
npm run logs
```

## Next Steps

- Review [Security Guidelines](security.md)
- Understand [Provider Integration](providers.md)  
- Read [Compliance Requirements](compliance.md)