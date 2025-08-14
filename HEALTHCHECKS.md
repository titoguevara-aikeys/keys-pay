# AIKeys Wallet - Health Check Guide

## Overview
This document describes all health check endpoints and expected responses for monitoring the AIKeys Wallet Supabase backend.

## Health Check Endpoints

### 1. System Health Check
**Endpoint**: `https://emolyyvmvvfjyxbguhyn.functions.supabase.co/health`  
**Method**: GET  
**Authentication**: None required  
**Timeout**: 30 seconds  

#### Expected Response (Healthy)
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": {
    "connected": true,
    "latency_ms": 45
  },
  "secrets": {
    "CIRCLE_API_KEY": true,
    "CIRCLE_WEBHOOK_SECRET": true,
    "ALERT_EMAIL": true
  },
  "webhooks": {
    "status": "healthy",
    "recentWebhooks": 12,
    "failedWebhooks": 0,
    "lastWebhookTime": "2024-01-15T10:25:00Z",
    "checkTime": "2024-01-15T10:30:00Z"
  },
  "security": {
    "recentHighRiskEvents": 0,
    "last24Hours": 5
  },
  "version": "1.0.0"
}
```

#### Response Codes
- **200**: System healthy
- **503**: System degraded or unhealthy
- **500**: Health check failed

#### Monitoring Thresholds
- **Critical**: Response time > 5 seconds OR status != "healthy"
- **Warning**: Database latency > 500ms OR failedWebhooks > 5
- **Info**: recentHighRiskEvents > 0

### 2. Webhook Health Check
**Endpoint**: Database function - accessed via health endpoint  
**Function**: `webhook_health_check()`  

#### Internal Query
```sql
SELECT public.webhook_health_check();
```

#### Expected Response
```json
{
  "status": "healthy",
  "recentWebhooks": 15,
  "failedWebhooks": 0,
  "lastWebhookTime": "2024-01-15T10:28:00Z",
  "checkTime": "2024-01-15T10:30:00Z"
}
```

## Manual Health Checks

### 1. Database Connectivity
```bash
# Using Supabase CLI
supabase db status

# Expected output:
# Database is running
# Connection string: postgresql://...
```

### 2. Function Deployment Status
```bash
# Check function list
supabase functions list

# Expected functions:
# - payments-circle-webhook (deployed)
# - health (deployed)
# - ai-financial-advisor (deployed)
# - send-app-link (deployed)
```

### 3. RLS Policy Check
```sql
-- Verify RLS is enabled on critical tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = false;

-- Expected: Empty result (all tables have RLS enabled)
```

### 4. Secret Validation
```bash
# Check secrets are configured (values hidden)
supabase secrets list

# Expected secrets:
# - CIRCLE_API_KEY
# - CIRCLE_WEBHOOK_SECRET
# - ALERT_EMAIL
# - OPENAI_API_KEY (if using AI features)
```

## Automated Monitoring Setup

### 1. External Monitoring (Recommended)
**Tool**: Uptime Robot, Pingdom, or similar  
**Check Frequency**: Every 5 minutes  
**Endpoint**: `/health`  
**Alert Conditions**:
- Response time > 5 seconds
- HTTP status != 200
- Response body doesn't contain `"status": "healthy"`

### 2. Database Monitoring
**Metrics to Track**:
- Connection count
- Query execution time (p95 < 500ms)
- Error rate (< 1%)
- CPU usage (< 80%)

### 3. Function Monitoring
**Metrics to Track**:
- Execution time (p95 < 2 seconds)
- Error rate (< 5%)
- Memory usage
- Invocation count

## Health Check Schedules

### Production Environment
- **Health Endpoint**: Every 1 minute
- **Database Connectivity**: Every 5 minutes
- **Function Status**: Every 15 minutes
- **Security Audit**: Every hour
- **Full System Check**: Every 24 hours

### Development Environment
- **Health Endpoint**: Every 5 minutes
- **Function Status**: Every 30 minutes
- **Daily Summary**: Every 24 hours

## Alert Configuration

### Critical Alerts (Immediate Response)
- Health endpoint returning 503/500
- Database connectivity failure
- Webhook processing completely stopped
- High-risk security events (> 5 in 1 hour)

### Warning Alerts (Response within 1 hour)
- Response time degradation (> 2 seconds)
- Failed webhook rate > 10%
- Database latency > 1 second
- Memory usage > 80%

### Info Alerts (Response within 24 hours)
- Security events detected
- Unusual traffic patterns
- Performance degradation trends

## Troubleshooting Common Issues

### Health Check Returns 503
**Possible Causes**:
1. Database connectivity issues
2. Missing required secrets
3. High error rates in webhooks

**Diagnosis Steps**:
```bash
# Check database status
supabase db status

# Check function logs
supabase functions logs health --limit 10

# Verify secrets
supabase secrets list
```

### Slow Response Times
**Possible Causes**:
1. Database performance issues
2. High concurrent load
3. Network latency

**Diagnosis Steps**:
```bash
# Check slow queries
supabase logs --type db --filter "duration"

# Check function execution times
supabase functions logs health --filter "processed in"
```

### High Error Rates
**Possible Causes**:
1. Configuration issues
2. External service problems (Circle API)
3. Database constraints violated

**Diagnosis Steps**:
```bash
# Check recent errors
supabase logs --type db --level error --limit 20

# Check function errors
supabase functions logs payments-circle-webhook --level error
```

## Health Check Validation Scripts

### 1. Basic Health Check
```bash
#!/bin/bash
# health_check.sh

HEALTH_URL="https://emolyyvmvvfjyxbguhyn.functions.supabase.co/health"
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response $HEALTH_URL)
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Health check passed"
    cat /tmp/health_response | jq .
else
    echo "❌ Health check failed - HTTP $HTTP_CODE"
    cat /tmp/health_response
    exit 1
fi
```

### 2. Comprehensive System Check
```bash
#!/bin/bash
# system_check.sh

echo "🔍 Running comprehensive system check..."

# Health endpoint
echo "1. Checking health endpoint..."
./health_check.sh

# Database connectivity
echo "2. Checking database..."
supabase db status

# Function deployment
echo "3. Checking functions..."
supabase functions list

# Recent errors
echo "4. Checking for recent errors..."
supabase logs --type db --level error --limit 5

echo "✅ System check completed"
```

## Metrics Collection

### Key Metrics to Track
1. **Availability**: Uptime percentage (target: 99.9%)
2. **Performance**: Response time p95 (target: < 500ms)
3. **Error Rate**: 4xx/5xx errors (target: < 1%)
4. **Security**: Failed authentication attempts
5. **Business**: Webhook processing success rate

### Data Retention
- **Real-time metrics**: 24 hours
- **Hourly aggregates**: 30 days
- **Daily summaries**: 1 year
- **Incident reports**: Permanent

---
**Document Version**: 1.0  
**Last Updated**: $(date)  
**Next Review**: Monthly