# System Check Runbook

This runbook provides detailed information about the Keys Pay System Check functionality, including what each check does, expected outputs, common failures, and resolution steps.

## Overview

The System Check (`/admin/system-check`) provides real-time monitoring of all critical platform components and external services. It performs automated health checks and displays the results in an easy-to-understand dashboard.

## Health Check Endpoints

### 1. Application Health (`/api/health`)
**Purpose**: Basic application liveness check
**Critical**: Yes

**Expected Output**:
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00.000Z", 
  "uptime": 86400,
  "service": "Keys Pay Platform",
  "version": "1.0.0",
  "license": "Dubai DED License 1483958, CR 2558995",
  "environment": "staging",
  "providers": {
    "ramp": true,
    "nium": true,
    "openpayd": false
  },
  "features": {
    "buy_crypto": true,
    "sell_crypto": true,
    "cards": true,
    "payouts": true,
    "family_controls": true,
    "eiban": false
  }
}
```

**Common Failures**:
- `500 Internal Server Error`: Application startup failure
- `Timeout`: Server unresponsive or overloaded

**Resolution**:
- Check deployment status in Vercel
- Review application logs
- Verify environment variables are set
- Restart the application if needed

### 2. Database Health (`/api/health/db`)
**Purpose**: Supabase database connectivity test
**Critical**: Yes

**Expected Output**:
```json
{
  "ok": true,
  "latencyMs": 45,
  "message": "Database connectivity verified"
}
```

**Common Failures**:
- `503 Service Unavailable`: Database connection failure
- `High latency (>1000ms)`: Network or performance issues
- `Authentication failed`: Incorrect Supabase credentials

**Resolution**:
- Check Supabase project status at [supabase.com/dashboard](https://supabase.com/dashboard)
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
- Check network connectivity to Supabase
- Review database connection limits

### 3. Authentication Health (`/api/health/auth`)
**Purpose**: Supabase Auth service connectivity
**Critical**: Yes

**Expected Output**:
```json
{
  "ok": true,
  "latencyMs": 67,
  "message": "Auth service connectivity verified",
  "hasSession": false
}
```

**Common Failures**:
- `503 Service Unavailable`: Auth service down
- `Authentication error`: Invalid auth configuration

**Resolution**:
- Check Supabase Auth settings
- Verify auth provider configuration
- Review auth service logs in Supabase dashboard

### 4. Vercel API Health (`/api/vercel/health`)
**Purpose**: Vercel API access verification
**Critical**: No

**Expected Output**:
```json
{
  "ok": true,
  "projectId": "prj_xxxxxxxxxxxx",
  "message": "Vercel API credentials configured"
}
```

**Common Failures**:
- `503 Service Unavailable`: Missing Vercel credentials
- `401 Unauthorized`: Invalid or expired Vercel token
- `403 Forbidden`: Insufficient token permissions

**Resolution**:
- Verify `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` environment variables
- Check token permissions include `deployments:read`
- Generate new token if expired
- Verify project ID matches current project

### 5. NIUM Provider Health (`/api/nium/health`)
**Purpose**: NIUM sandbox API connectivity
**Critical**: No (feature-dependent)

**Expected Output**:
```json
{
  "ok": true,
  "latencyMs": 234,
  "featureEnabled": true,
  "status": 200,
  "message": "NIUM sandbox reachable"
}
```

**Feature Disabled Output**:
```json
{
  "ok": false,
  "featureEnabled": false,
  "message": "NIUM feature disabled"
}
```

**Common Failures**:
- `408 Request Timeout`: NIUM API unresponsive
- `502 Bad Gateway`: NIUM API down or unreachable
- `401/403`: Invalid NIUM API credentials

**Resolution**:
- Check NIUM API status page
- Verify `NIUM_API_KEY` environment variable
- Ensure `VITE_FEATURE_NIUM=true` if feature should be enabled
- Check NIUM sandbox vs production endpoint configuration

### 6. Ramp Provider Health (`/api/ramp/health`)
**Purpose**: Ramp Network API connectivity
**Critical**: No (feature-dependent)

**Expected Output**:
```json
{
  "ok": true,
  "latencyMs": 156,
  "featureEnabled": true,
  "status": 200,
  "message": "Ramp API reachable"
}
```

**Common Failures**:
- `408 Request Timeout`: Ramp API slow response
- `502 Bad Gateway`: Ramp API unavailable
- `Rate limiting`: Too many requests

**Resolution**:
- Check Ramp Network status
- Verify `RAMP_API_KEY` environment variable
- Review API rate limits
- Ensure using correct Ramp API endpoint

### 7. OpenPayd Provider Health (`/api/openpayd/health`)
**Purpose**: OpenPayd API connectivity (when enabled)
**Critical**: No

**Expected Output (Disabled)**:
```json
{
  "ok": false,
  "disabled": true,
  "featureEnabled": false,
  "message": "OpenPayd coming soon - feature disabled"
}
```

**Resolution**:
- Currently expected to be disabled
- When enabled, follow similar troubleshooting as other providers

## Deployment Monitoring

The System Check also displays recent Vercel deployments via `/api/vercel/deployments`.

**Expected Data**:
- Last 5 deployments
- Deployment ID, URL, state, timestamp, creator
- Links to visit deployment URLs

**Common Issues**:
- Empty deployment list: Check Vercel API credentials
- Old deployment data: Verify project ID is correct
- Broken deployment links: Check deployment state and URL format

## Overall Status Interpretation

### Status Levels:

**🟢 All Systems Operational**
- All critical checks (App, Database, Auth) are OK
- No immediate action required
- Continue monitoring

**🟡 Some Services Degraded**  
- Some non-critical services failing
- Core functionality should work
- Investigate failed services when possible

**🔴 Critical Issues Detected**
- One or more critical services failing
- Platform functionality may be impacted
- **Immediate action required**

**⏳ Checking Status...**
- System checks in progress
- Wait for completion before taking action

## Monitoring Best Practices

### Regular Checks
- Run system check daily during business hours
- Monitor after deployments
- Check before major releases or announcements

### Alert Thresholds
- **Critical**: Any critical service failure
- **Warning**: Non-critical service down >30 minutes
- **Info**: High latency (>500ms) on multiple services

### Response Procedures

**Critical Service Failure**:
1. Run individual check to confirm failure
2. Check specific service status pages/dashboards
3. Review recent deployments for potential causes
4. Escalate to development team if unresolved within 15 minutes

**Non-Critical Service Degradation**:
1. Document the issue with timestamp
2. Check if it's a known maintenance window
3. Monitor for resolution within 1 hour
4. Create issue ticket if persistent

**High Latency**:
1. Run checks multiple times to confirm pattern
2. Check network conditions
3. Monitor for improvement over 30 minutes
4. Investigate if latency remains >1000ms

## Troubleshooting Tools

### Vercel Dashboard
- View deployment logs and status
- Check environment variable configuration
- Monitor function execution and errors

### Supabase Dashboard  
- Database query performance
- Auth service logs
- API usage statistics

### Provider Dashboards
- NIUM: Sandbox transaction logs
- Ramp: Partner dashboard metrics
- Check for maintenance announcements

## Common Resolution Steps

### Environment Variable Issues
```bash
# Verify variables are set in Vercel
vercel env ls

# Add missing variable
vercel env add [NAME]

# Redeploy after variable changes
vercel --prod
```

### Service Connectivity Issues
```bash
# Test direct API connectivity
curl -I https://api.provider.com/health

# Check DNS resolution
nslookup api.provider.com

# Test from different network
curl -I https://api.provider.com/health --proxy proxy.company.com:8080
```

### Performance Issues
- Check recent deployment changes
- Monitor system resource usage
- Review database query performance
- Analyze network latency patterns

## Escalation Contacts

**Critical System Issues**: 
- Development team lead
- DevOps/Infrastructure team
- Platform operations

**Provider API Issues**:
- NIUM: Technical support contact
- Ramp: Partner success manager
- OpenPayd: Integration support (when available)

**Vercel/Infrastructure Issues**:
- Vercel support (Enterprise plan)
- Internal DevOps team
- System administrator

## Documentation Updates

This runbook should be updated when:
- New health checks are added
- API endpoints change
- New providers are integrated
- Escalation procedures change
- Known issues are identified and resolved

Last updated: [Current Date]
Version: 1.0