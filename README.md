# 🚀 Keys Pay Platform

**Final Launch Build - August 2025**

Keys Pay is a DED-compliant aggregator platform for virtual assets and financial services, operating under AIKEYS (Trade License 1483958, CR 2558995, Dubai Department of Economy & Tourism).

## 📋 Overview

Keys Pay operates as a **non-custodial aggregator** - we do not hold client funds or crypto assets. All payments, custody, and settlement are executed by regulated third-party providers.

### Licensed Providers
- **🟢 RAMP** - On-ramp widget (LIVE)
- **🟢 NIUM** - Card issuing & payouts (LIVE) 
- **🟡 OpenPayd** - eIBAN accounts (Coming Soon)
- **⚪ Guardarian** - Optional off-ramp failover (Disabled)

## 🏗️ Architecture

```
Client → Keys Pay API → Provider APIs
                     ↓
              Compliance Layer
                     ↓
               Audit & Logging
```

## 🚀 Quick Start

1. **Environment Setup**
   ```bash
   cp .env.sample .env
   # Update with your API keys
   ```

2. **Docker Deploy**
   ```bash
   docker-compose up -d
   ```

3. **Health Check**
   ```bash
   curl http://localhost:8080/api/health
   ```

## 📊 API Endpoints

| Path | Provider | Status | Description |
|------|----------|--------|-------------|
| `/api/buy-crypto` | Ramp | 🟢 Live | On-ramp widget |
| `/api/cards` | Nium | 🟢 Live | Card issuing |
| `/api/payouts` | Nium | 🟢 Live | Cross-border payouts |
| `/api/iban` | OpenPayd | 🟡 Soon | Virtual IBAN accounts |
| `/api/offramp` | Guardarian | ⚪ Optional | Failover off-ramp |

## 🔐 Security

- **HMAC Authentication** - All client requests signed
- **Webhook Verification** - Provider webhooks verified
- **TLS 1.3 Enforced** - End-to-end encryption
- **PCI DSS Aligned** - Card flow security
- **Audit Logging** - Comprehensive compliance logs

## 🏛️ Compliance

**Legal Entity**: AIKEYS  
**Trade License**: 1483958  
**CR Number**: 2558995  
**Authority**: Dubai Department of Economy & Tourism (DED)  
**Reference Code**: 12345  

### Regulatory Status
- ✅ DED licensed aggregator
- ✅ Non-custodial model
- ✅ Third-party MoR compliance
- ❌ No VARA license required (aggregator model)

## 🚀 Launch Readiness

Status: Production Ready ✅

- **NIUM Integration**: Live Sandbox Ready
- **OpenPayd Integration**: Licensed & Ready  
- **RAMP Integration**: Active & Configured
- **Security Layer**: Comprehensive monitoring
- **Admin Dashboard**: Full deployment monitoring
- **Beta Testing**: Advanced control panels
- **Mobile Apps**: Native iOS/Android ready
- **Compliance**: Dubai DED Licensed (1483958)

## 🔧 Staging on Vercel

### Environment Variables Setup
Configure these in your Vercel Dashboard:

**Client Variables (VITE_ prefix):**
```bash
VITE_APP_ENV=staging
VITE_BASE_URL=https://your-domain.vercel.app
VITE_FEATURE_NIUM=true
VITE_FEATURE_RAMP=true  
VITE_FEATURE_OPENPAYD=false
```

**Server Variables (Sensitive - Server Only):**
```bash
VERCEL_PROJECT_ID=your_project_id
VERCEL_TOKEN=your_vercel_token
SUPABASE_SERVICE_KEY=your_service_key
NIUM_API_KEY=your_nium_sandbox_key
RAMP_API_KEY=your_ramp_sandbox_key
```

### System Monitoring
Access comprehensive health dashboard:
- **Admin Portal**: `/admin`
- **System Check**: `/admin/system-check`

Features:
- ✅ Real-time health monitoring of all services
- ✅ Provider API connectivity testing (NIUM, Ramp, OpenPayd)
- ✅ Database and authentication service monitoring  
- ✅ Vercel deployment history and status
- ✅ Performance metrics and latency tracking

## 🐳 Docker

Production deployment via Docker:

```yaml
services:
  keys-pay:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DED_LICENSE=1483958
      - CR_NUMBER=2558995
```

## 📚 Documentation

- `/docs/overview.md` - Platform architecture
- `/docs/quickstart.md` - Setup guide
- `/openapi/openapi.yaml` - API specification

## ⚖️ Legal Disclaimer

Keys Pay operates under AIKEYS (Trade License 1483958, CR 2558995, DED Dubai). Keys Pay is an aggregator platform. All payments, custody, and settlement are executed by regulated third-party providers. Keys Pay does not take custody of client funds or crypto assets.

---

**© 2025 AIKEYS - Dubai DED License 1483958**