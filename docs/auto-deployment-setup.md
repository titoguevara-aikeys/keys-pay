# Vercel Auto-Deployment Setup Guide

This guide explains how to set up automated Vercel deployments for your Keys Pay Portal without manual intervention.

## Overview

The auto-deployment system consists of:
- **Supabase Edge Function**: Handles deployment logic and background monitoring
- **API Endpoints**: Trigger deployments and manage configuration
- **GitHub Webhooks**: Automatic deployments on code push
- **Admin Dashboard**: Control panel for managing deployments

## Prerequisites

### Required Environment Variables

Set these in your Vercel project and Supabase:

```bash
# Vercel Configuration
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TOKEN=your_vercel_api_token
VERCEL_TEAM_ID=your_team_id (optional, if using a team)

# Supabase Configuration  
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### Getting Vercel Credentials

1. **Project ID**: Found in your Vercel project settings
2. **API Token**: Generate at https://vercel.com/account/tokens
   - Needs `deployments:write` and `projects:read` permissions

## Setup Steps

### 1. Configure Environment Variables

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the required variables listed above
3. Redeploy to apply changes

### 2. Deploy Supabase Edge Function

The Edge Function is already created at `supabase/functions/vercel-auto-deploy/index.ts`

Deploy it using:
```bash
supabase functions deploy vercel-auto-deploy
```

### 3. GitHub Webhook Setup (Optional)

For automatic deployments on push:

1. Go to your GitHub repository settings
2. Navigate to Webhooks → Add webhook
3. Set Payload URL to: `https://yourdomain.com/api/vercel/webhook`
4. Content type: `application/json`
5. Select individual events: `push`
6. Save webhook

### 4. Admin Dashboard Configuration

Access the auto-deployment controls:
1. Navigate to Admin Portal → Monitoring tab
2. Scroll to "Deployment Management" section
3. Use the controls to:
   - Start/stop auto-deployment monitoring
   - Trigger manual deployments
   - View deployment status

## Features

### Auto-Deployment Modes

1. **Background Monitoring**: 
   - Checks every 30 minutes
   - Auto-deploys if no deployment in 6 hours
   - Runs as background task in Supabase Edge Function

2. **GitHub Webhook**:
   - Immediate deployment on push to main/master/production branches
   - Includes commit info and pusher details
   - Ignores pushes to other branches

3. **Manual Deployment**:
   - One-click deployment from admin dashboard
   - Specify branch for deployment
   - Real-time status updates

### API Endpoints

- `GET /api/vercel/health` - Check Vercel connection
- `GET /api/vercel/deployments` - List recent deployments
- `POST /api/vercel/deploy` - Trigger deployment
- `POST /api/vercel/webhook` - GitHub webhook handler

## Usage

### Start Auto-Deployment

From the admin dashboard:
1. Click "Start Auto-Deploy" in the deployment control panel
2. Background monitoring begins immediately
3. Status indicator shows active monitoring

### Manual Deployment

1. Click "Deploy Now" button
2. Monitor status in deployment list
3. Check logs in Vercel dashboard if needed

### Webhook Deployment

Automatic when:
- Push to main, master, or production branch
- Webhook is properly configured
- Environment variables are set

## Troubleshooting

### Common Issues

1. **"Vercel credentials not configured"**
   - Verify VERCEL_PROJECT_ID and VERCEL_TOKEN are set
   - Check token permissions

2. **"Supabase configuration missing"**
   - Verify SUPABASE_URL and SUPABASE_SERVICE_KEY
   - Ensure Edge Function is deployed

3. **GitHub webhook not triggering**
   - Check webhook URL is correct
   - Verify webhook is active in GitHub settings
   - Check push is to allowed branch

### Monitoring

- Check Edge Function logs in Supabase dashboard
- Monitor deployment status in admin portal
- View Vercel deployment logs for detailed information

## Security

- API tokens are stored securely in environment variables
- Webhook signatures can be verified (optional)
- Background tasks run in secure Supabase environment
- All API endpoints include proper error handling

## Limitations

- Background monitoring checks every 30 minutes
- Auto-deployment triggers after 6 hours of inactivity
- Only deploys main, master, and production branches
- Requires active Supabase project and Vercel account

## Support

If you encounter issues:
1. Check environment variable configuration
2. Verify Supabase Edge Function is deployed
3. Review logs in both Supabase and Vercel dashboards
4. Test API endpoints directly for troubleshooting