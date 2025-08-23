# Environment Configuration - Keys Pay Platform

This document outlines the environment variables required for the Keys Pay platform, particularly for Vercel deployment and system monitoring.

## Required Environment Variables

### Client-side Variables (VITE_ prefix)
These variables are exposed to the browser and should not contain sensitive data:

```bash
# Application Environment
VITE_APP_ENV=staging                    # Options: development, staging, production

# Base URL for the application
VITE_BASE_URL=https://your-domain.vercel.app

# Feature Flags
VITE_FEATURE_NIUM=true                 # Enable NIUM provider integration
VITE_FEATURE_RAMP=true                 # Enable Ramp Network integration  
VITE_FEATURE_OPENPAYD=false            # Enable OpenPayd integration (coming soon)
```

### Server-side Variables
These variables are only accessible on the server and should never be exposed to the client:

```bash
# Vercel Integration
VERCEL_PROJECT_ID=your_project_id      # Get from Vercel Dashboard → Project Settings
VERCEL_TEAM_ID=your_team_id            # Optional: Only if using Vercel Teams
VERCEL_TOKEN=your_vercel_token         # Personal Access Token with deployments:read scope

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key   # Server-only: Full access key

# Provider API Keys (Sandbox)
NIUM_API_KEY=your_nium_sandbox_key
RAMP_API_KEY=your_ramp_sandbox_key
OPENPAYD_API_KEY=your_openpayd_sandbox_key  # When feature is enabled
```

## Setting up Vercel Environment Variables

### 1. Get Vercel Project ID
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → General
4. Copy the "Project ID"

### 2. Create Vercel Personal Access Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a descriptive name: "Keys Pay System Check"
4. Select scopes: `deployments:read`, `projects:read`
5. Copy the generated token

### 3. Configure Environment Variables in Vercel
1. In your project dashboard, go to Settings → Environment Variables
2. Add each variable with appropriate scope:
   - **Production**: Production environment
   - **Preview**: Branch deployments and previews
   - **Development**: Local development (optional)

### Example Vercel Environment Variable Setup:
```
Name: VERCEL_PROJECT_ID
Value: prj_xxxxxxxxxxxx
Environments: Production, Preview

Name: VERCEL_TOKEN  
Value: xxxxxxxxxxxxxxxxx
Environments: Production, Preview

Name: VITE_APP_ENV
Value: staging
Environments: Preview

Name: VITE_FEATURE_NIUM
Value: true
Environments: Production, Preview
```

## Deploy Hooks (Optional)

Deploy hooks allow you to trigger deployments via HTTP POST requests.

### Setting up Deploy Hooks:
1. Go to Project Settings → Git
2. Scroll to "Deploy Hooks"
3. Click "Create Hook"
4. Name: "System Check Deploy"
5. Branch: main (or your production branch)
6. Copy the generated webhook URL

### Using Deploy Hooks:
```bash
# Trigger a deployment
curl -X POST "https://api.vercel.com/v1/integrations/deploy/[your-hook-id]"
```

## Provider API Configuration

### NIUM (Sandbox)
1. Sign up for NIUM developer account
2. Get sandbox API credentials
3. Set `NIUM_API_KEY` environment variable
4. Ensure `VITE_FEATURE_NIUM=true`

### Ramp Network (Sandbox)
1. Sign up for Ramp partner account
2. Get test API key from partner dashboard
3. Set `RAMP_API_KEY` environment variable  
4. Ensure `VITE_FEATURE_RAMP=true`

### OpenPayd (Coming Soon)
Currently disabled by default. When ready:
1. Set `VITE_FEATURE_OPENPAYD=true`
2. Add `OPENPAYD_API_KEY` with sandbox credentials

## Security Best Practices

1. **Never commit sensitive keys** to version control
2. **Use different keys** for staging vs production
3. **Rotate API keys** regularly
4. **Monitor API usage** for unusual activity
5. **Use least privilege** - only grant necessary permissions

## Troubleshooting

### Common Issues:

**System Check shows Vercel API failures:**
- Verify `VERCEL_PROJECT_ID` matches your project
- Check `VERCEL_TOKEN` has correct permissions
- Ensure token hasn't expired

**Provider health checks fail:**
- Verify API keys are for sandbox/test environments
- Check if provider APIs are experiencing downtime
- Ensure feature flags are properly set

**Environment variables not updating:**
- Redeploy after changing Vercel environment variables
- Check variable scope (Production/Preview/Development)
- Clear browser cache and hard refresh

## System Check Access

Once configured, access the system health dashboard at:
- **Admin Portal**: `/admin`
- **System Check**: `/admin/system-check`

The system check validates:
- ✅ Application health
- ✅ Database connectivity  
- ✅ Authentication service
- ✅ Vercel API access
- ✅ Provider API connectivity
- ✅ Recent deployment status

## Support

For issues with environment configuration:
1. Check the [System Check page](/admin/system-check) for detailed error messages
2. Review Vercel deployment logs
3. Check provider API documentation
4. Contact the development team with specific error details