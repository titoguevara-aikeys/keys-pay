# Keys Pay - Final Integration Architecture

## Overview

Keys Pay operates as a **non-custodial aggregator** under Dubai DED License 1483958 (CR 2558995), providing virtual asset and financial services through regulated third-party providers.

## High-Level Architecture

```mermaid
flowchart LR
  subgraph USER[User Devices]
    W(Web App):::ui
    M(Mobile App):::ui
  end

  subgraph KP[Keys Pay BFF/API]
    GW[API Gateway / Router]\n(HMAC + OAuth2)
    AUTH[Auth & RBAC]
    LOGS[Audit & Compliance Logs]
    FEAT[Feature Flags]\nRAMP_ENABLED=true\nNIUM_ENABLED=true\nOPENPAYD_ENABLED=false
  end

  subgraph RAMP[ Ramp ]
    RAMPAPI[Widget + REST API]
    RAMPWH[Webhook]
  end

  subgraph NIUM[ Nium ]
    NAPI[Payouts/FX API]
    NCARD[Card Issuing API]
    NWH[Webhook]
  end

  subgraph OP[ OpenPayd (Coming Soon) ]
    OPAPI[eIBAN / Accounts API]
    OPWH[Webhook]
  end

  W-- REST -->GW
  M-- REST -->GW
  GW-->AUTH
  GW-->FEAT
  GW-->LOGS

  %% Routing
  GW -- /ramp/session --> RAMPAPI
  RAMPWH -- status/KYC --> GW

  GW -- /payouts/* --> NAPI
  GW -- /cards/* --> NCARD
  NWH -- payout/card events --> GW

  FEAT -- if OPENPAYD_ENABLED=true --> OPAPI
  OPWH -- account events --> GW

  classDef ui fill:#eef,stroke:#88a;
```

## Service Matrix

| Capability | Provider | Status | Description |
|------------|----------|--------|-------------|
| Buy Crypto (Fiat→Crypto) | **Ramp** | **Live** | Bank transfer, cards to crypto |
| Sell Crypto (Crypto→Fiat) | **Ramp** | **Live** | Crypto to fiat withdrawal |
| Payouts & FX | **Nium** | **Live** | Cross-border payments |
| Cards (Virtual/Physical) | **Nium** | **Live** | Prepaid cards with controls |
| Family Controls | **Nium** | **Live** | Limits, MCC blocks, freeze |
| eIBAN / Accounts | **OpenPayd** | **Coming Soon** | European accounts |

## API Endpoints

### Ramp (On/Off-ramp)
- `POST /api/ramp/session` - Create buy/sell session
- `POST /api/ramp/webhook` - Handle Ramp events

### Nium (Cards & Payouts)
- `POST /api/payouts/quote` - Get FX quote
- `POST /api/payouts/execute` - Execute payout
- `POST /api/cards/issue` - Issue virtual/physical card
- `POST /api/cards/controls` - Update card limits/controls
- `POST /api/nium/webhook` - Handle Nium events

### OpenPayd (Coming Soon)
- `POST /api/openpayd/accounts/apply` - Apply for eIBAN
- `GET /api/openpayd/accounts/:id` - Get account details
- `POST /api/openpayd/webhook` - Handle OpenPayd events

### Common
- `GET /api/status/:ref` - Check transaction status
- `GET /api/providers` - Provider status and capabilities
- `GET /api/health` - System health check

## Security & Compliance

### Authentication
- HMAC signature verification for client requests
- Webhook signature verification from providers
- OAuth2 for user authentication

### Data Protection
- PII minimization (refs + masked data only)
- No custody of client funds or crypto assets
- Audit logging for all transactions

### Feature Flags
```env
RAMP_ENABLED=true      # Buy/Sell crypto live
NIUM_ENABLED=true      # Cards/Payouts live
OPENPAYD_ENABLED=false # eIBAN coming soon
GUARDARIAN_ENABLED=false # Optional failover
```

### Rate Limiting
- 100 requests/minute/user
- CSP allowlists for Ramp widget domains

## Compliance Disclaimers

**Global Footer:**
"Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995). Keys Pay is an aggregator platform. All payments, custody, and settlement are executed by regulated third-party providers."

**Flow Banners:**
- "Powered by Ramp" (buy/sell flows)
- "Powered by Nium" (cards/payouts flows) 
- "OpenPayd Coming Soon" (eIBAN flows)

## License Information

- **Legal Entity:** AIKEYS
- **License:** Dubai DED License 1483958
- **CR Number:** 2558995
- **Model:** Non-custodial aggregator (no VARA required)
- **Reference Code:** 12345