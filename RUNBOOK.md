# AIKeys Wallet - Operations Runbook

## Overview
This runbook provides step-by-step procedures for deploying, monitoring, and maintaining the AIKeys Wallet Supabase backend.

## Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Project access to `emolyyvmvvfjyxbguhyn`
- Admin credentials for Circle dashboard
- Access to email configured for alerts

## Deployment Procedures

### 1. Initial Setup
```bash
# Clone repository and navigate to project
cd aikeys-wallet

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref emolyyvmvvfjyxbguhyn

# Verify connection
supabase status
```

### 2. Database Migrations
```bash
# Check migration status
supabase db diff

# Apply new migrations (if any)
supabase db push

# Verify migration success
supabase db status
```

### 3. Edge Functions Deployment
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy payments-circle-webhook
supabase functions deploy health

# Verify deployment
supabase functions list
```

### 4. Secrets Management
```bash
# Set Circle API secrets (production)
supabase secrets set CIRCLE_API_KEY=your_production_key
supabase secrets set CIRCLE_WEBHOOK_SECRET=your_webhook_secret
supabase secrets set ALERT_EMAIL=tito.guevara@aikeys.ai

# Verify secrets (won't show values)
supabase secrets list
```

## Health Monitoring

### 1. System Health Check
```bash
# Check overall system health
curl https://emolyyvmvvfjyxbguhyn.functions.supabase.co/health

# Expected response (200 OK):
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
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
    "recentWebhooks": 5,
    "failedWebhooks": 0
  }
}
```

### 2. Database Health
```bash
# Check recent errors in logs
supabase logs --type db --level error --limit 50

# Check slow queries
supabase logs --type db --level log --filter "duration"
```

### 3. Webhook Health
```bash
# Check webhook function logs
supabase functions logs payments-circle-webhook --limit 50

# Check for signature failures
supabase functions logs payments-circle-webhook --filter "Invalid"
```

## Circle Webhook Configuration

### 1. Webhook Endpoint Setup
In Circle dashboard:
1. Navigate to Webhooks section
2. Add endpoint: `https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook`
3. Enable events:
   - `payments.confirmed`
   - `payments.failed`
   - `wallets.created`

### 2. Testing Webhook
```bash
# Test with valid signature
curl -X POST \
  https://emolyyvmvvfjyxbguhyn.functions.supabase.co/payments-circle-webhook \
  -H "Content-Type: application/json" \
  -H "circle-signature: v1=your_test_signature" \
  -d '{"eventType": "payments.confirmed", "eventId": "test-123"}'

# Expected: 200 OK with event processing confirmation
```

## Troubleshooting

### 1. Webhook Failures

**Symptoms**: 401 errors, signature validation failures
```bash
# Check webhook secret configuration
supabase secrets list | grep CIRCLE

# Verify signature generation in Circle dashboard
# Check recent security events for invalid signatures
```

**Resolution**:
1. Verify CIRCLE_WEBHOOK_SECRET matches Circle dashboard
2. Check Circle documentation for signature format changes
3. Review webhook logs for detailed error information

### 2. Database Connection Issues

**Symptoms**: Health check fails, 503 errors
```bash
# Check database status
supabase db status

# Review recent database logs
supabase logs --type db --level error
```

**Resolution**:
1. Check Supabase dashboard for outages
2. Verify connection limits not exceeded
3. Review slow query patterns

### 3. Edge Function Errors

**Symptoms**: 500 errors, function timeouts
```bash
# Check function logs
supabase functions logs [function-name] --level error

# Check function deployment status
supabase functions list
```

**Resolution**:
1. Redeploy function: `supabase functions deploy [function-name]`
2. Check secret availability in function environment
3. Review memory/timeout limits

## Secret Rotation

### 1. Circle API Keys
```bash
# Generate new keys in Circle dashboard
# Update Supabase secrets
supabase secrets set CIRCLE_API_KEY=new_production_key
supabase secrets set CIRCLE_WEBHOOK_SECRET=new_webhook_secret

# Test webhook functionality after rotation
curl -X POST [webhook_url] [test_payload]
```

### 2. JWT Secrets
- **Note**: JWT secrets are managed by Supabase automatically
- No manual rotation required
- Monitor auth logs for any anomalies

## Backup & Recovery

### 1. Database Backup
```bash
# Manual backup (if needed)
supabase db dump > aikeys_backup_$(date +%Y%m%d).sql

# Automated backups are managed by Supabase
# Check retention policy in dashboard
```

### 2. Recovery Procedures
```bash
# Point-in-time recovery (contact Supabase support)
# Migration rollback (if needed)
supabase db reset
supabase db push
```

## Performance Monitoring

### 1. Database Performance
- Monitor query performance in Supabase dashboard
- Review slow query logs weekly
- Check connection pool usage

### 2. Function Performance
- Monitor function execution times
- Check memory usage patterns
- Review error rates and timeouts

### 3. Webhook Performance
- Monitor webhook processing latency
- Check idempotency key growth
- Review failed event patterns

## Rollback Procedures

### 1. Database Migration Rollback
```bash
# Emergency rollback to previous migration
supabase db reset
# Then manually apply previous migration files
```

### 2. Function Rollback
```bash
# Redeploy previous version from git
git checkout [previous_commit]
supabase functions deploy [function-name]
git checkout main
```

## Escalation Procedures

### 1. Critical Issues (P0)
- Database outage
- Webhook processing completely failed
- Security breach detected

**Actions**:
1. Immediately contact Supabase support
2. Notify technical team: tito.guevara@aikeys.ai
3. Document incident in security_events table

### 2. Warning Issues (P1)
- High error rates
- Performance degradation
- Configuration issues

**Actions**:
1. Review logs and metrics
2. Apply standard troubleshooting procedures
3. Escalate if not resolved within 2 hours

## Security Procedures

### 1. Security Event Response
```bash
# Check recent high-risk security events
supabase logs --type db --filter "security_events"

# Review failed authentication patterns
supabase logs --type auth --filter "error"
```

### 2. Access Review
- Monthly review of admin users
- Quarterly review of RLS policies
- Annual security audit

## Contact Information
- **Technical Lead**: tito.guevara@aikeys.ai
- **Supabase Support**: support@supabase.io
- **Circle Support**: [Configure as needed]

---
**Document Version**: 1.0  
**Last Updated**: $(date)  
**Next Review**: $(date -d "+3 months")