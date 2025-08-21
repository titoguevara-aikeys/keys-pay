# Keys Pay Platform Overview

## About Keys Pay

Keys Pay operates under **AIKEYS** (Dubai DED License **1483958**, CR **2558995**) as a **non-custodial aggregator** platform for virtual assets and financial services in the UAE and MENA region.

**Reference Code**: DED-12345

## Compliance Stance

- ✅ **Non-custodial aggregator** - Keys Pay does not custody client funds or digital assets
- ✅ **Merchant of Record (MoR)** - All services are provided directly by regulated third-party providers
- ✅ **Dubai DED compliant** - Operating under commercial license 1483958
- ✅ **PII minimization** - Minimal data collection and processing
- ✅ **Signed webhooks** - All provider communications are cryptographically verified

## Integrated Providers

### 🟢 Live Providers

| Provider | Services | Status | MoR |
|----------|----------|--------|-----|
| **Ramp** | Buy/Sell Crypto | Live | Ramp Network Ltd |
| **Nium** | Payouts, Cards, FX | Live | Nium Pte Ltd |

### 🟡 Coming Soon

| Provider | Services | Status | Notes |
|----------|----------|--------|--------|
| **OpenPayd** | Virtual IBAN, Settlements | Feature Flagged | Approval pending |

## Feature Flags

Current configuration:

```env
RAMP_ENABLED=true
NIUM_ENABLED=true
OPENPAYD_ENABLED=false
```

## Architecture

Keys Pay implements a **multi-provider aggregation** model:

```
Client → Keys Pay API → Provider APIs
         ↓
    Webhook Handling
         ↓
    Event Processing
```

### Security Features

- **HMAC Authentication** - All API requests require cryptographic signatures
- **Webhook Verification** - Provider webhooks are signature-verified
- **Rate Limiting** - Protection against abuse
- **Data Masking** - PII and sensitive data are masked (IBAN, card numbers)

## Legal Disclaimers

**Permanent Footer** (displayed on all pages):

> Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995). Keys Pay is an aggregator technology platform. All payments, card issuing, FX, and virtual asset services are executed by regulated third-party providers. Keys Pay does not custody client funds or digital assets and is not Merchant of Record.

**Flow Banners**:
- "**Powered by Ramp**" (buy/sell flows)
- "**Powered by Nium**" (cards/payouts flows)  
- "**OpenPayd Coming Soon**" (eIBAN flows)

## Contact

- **Technical Support**: support@keys-pay.com
- **Compliance**: compliance@keys-pay.com
- **Business**: business@keys-pay.com