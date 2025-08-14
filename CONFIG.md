# AIKeys Wallet - Configuration Guide

## Supabase Project Configuration
- **Project ID**: `emolyyvmvvfjyxbguhyn`
- **Region**: Auto-assigned by Supabase
- **Database Version**: PostgreSQL 15+

## Authentication Settings

### JWT Configuration
- **JWT Secret**: Auto-managed by Supabase
- **JWT Expiry**: 3600 seconds (1 hour) - default
- **Refresh Token Expiry**: 24 hours - default
- **Audience**: emolyyvmvvfjyxbguhyn (project ref)

### CORS Configuration
**Allowed Origins** (Production):
```
https://aikeys-hub.com
https://*.aikeys-hub.com
https://f44c23a1-66a8-4cd0-9d92-d6761abf4d0a.lovableproject.com
```

**Note**: Wildcard subdomains should be used cautiously in production

### Allowed Redirect URLs
```
https://aikeys-hub.com/*
https://aikeys-hub.com/auth/callback
https://f44c23a1-66a8-4cd0-9d92-d6761abf4d0a.lovableproject.com/*
```

### Email Templates
- **Confirmation**: Default Supabase template
- **Recovery**: Default Supabase template  
- **Magic Link**: Default Supabase template
- **Invite**: Default Supabase template

### Auth Providers Enabled
- **Email/Password**: ✅ Enabled
- **Magic Links**: ✅ Enabled
- **OAuth Providers**: Configure as needed

### Rate Limiting
- **Email Signups**: 10 per hour per IP (default)
- **Password Reset**: 5 per hour per email (default)
- **OTP Requests**: 10 per hour per phone (default)

## Required Secrets Configuration

### Circle API Integration
```
CIRCLE_API_KEY=your_sandbox_api_key_here
CIRCLE_WEBHOOK_SECRET=your_webhook_secret_here
```

### Monitoring & Alerts
```
ALERT_EMAIL=tito.guevara@aikeys.ai
```

### Supabase Internal (Auto-configured)
```
SUPABASE_URL=https://emolyyvmvvfjyxbguhyn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=[service_role_key_managed_by_supabase]
```

## Database Configuration

### Row Level Security (RLS)
- **Status**: ✅ Enabled on all tables
- **Policy Count**: 100+ policies active
- **User Isolation**: Enforced via `auth.uid()` checks
- **Admin Access**: Role-based via `is_admin()` functions

### Performance Settings
- **Connection Pooling**: Enabled (Supabase managed)
- **Statement Timeout**: 60 seconds
- **Idle Transaction Timeout**: 10 minutes

### Extensions Enabled
- `uuid-ossp` - UUID generation
- `pgcrypto` - Cryptographic functions
- `postgis` - Geographic data (if needed)

## Edge Functions Configuration

### Function Deployment Settings
```toml
# supabase/config.toml
project_id = "emolyyvmvvfjyxbguhyn"

[functions.payments-circle-webhook]
verify_jwt = false  # Uses HMAC signature instead

[functions.health]
verify_jwt = false  # Public health endpoint

[functions.ai-financial-advisor]
verify_jwt = true   # Requires user authentication

[functions.send-app-link]
verify_jwt = false  # Public signup function
```

### Function Timeouts
- **Default**: 60 seconds
- **Webhook Functions**: 30 seconds (recommended)
- **AI Functions**: 120 seconds (for processing time)

## Storage Configuration

### Buckets (if used)
- Configure storage buckets as needed
- Ensure proper RLS policies on `storage.objects`
- Set appropriate file size limits

## Security Configuration

### Search Path Protection
- All functions use explicit `SET search_path TO 'public'`
- Prevents search path injection attacks

### Webhook Security
- HMAC-SHA256 signature verification required
- Request timing validation
- Idempotency key protection
- Structured logging for all webhook events

### Monitoring
- Security events logged to `security_events` table
- Failed authentication attempts tracked
- Admin actions audited in `audit_events`

## Production Readiness Checklist

### Pre-Deployment
- [ ] Update OTP expiry to 10 minutes maximum
- [ ] Configure production Circle API keys
- [ ] Set production domain in CORS settings
- [ ] Review and test all RLS policies

### Post-Deployment  
- [ ] Monitor webhook health endpoint
- [ ] Set up external monitoring for database performance
- [ ] Configure backup retention policies
- [ ] Set up log retention policies

### Ongoing Maintenance
- [ ] Regular security audits
- [ ] Monitor failed webhook events
- [ ] Review user access patterns
- [ ] Update dependencies and extensions

## Support Contacts
- **Technical Lead**: tito.guevara@aikeys.ai
- **Database Admin**: [Configure as needed]
- **Security Team**: [Configure as needed]

Last Updated: $(date)
Configuration Version: 1.0