# AIKEYS Financial Platform

A comprehensive financial platform built with modern web technologies.

## Seeding an Admin (Supabase)

To promote an existing user to admin status, you'll need to update both the database and auth metadata:

### Getting User ID from Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Authentication > Users
3. Find your user and copy their UUID (User ID)

### Setup Environment Variables

Add these to your `.env` file:

```bash
# Prefer USER_ID if available (more direct)
ADMIN_USER_ID=your-user-uuid-here
# OR use email as fallback
ADMIN_EMAIL=admin@example.com

# Required Supabase credentials
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Run the Seeding Script

```bash
npm run seed:admin
```

This script will:
- Look up the user by ID (preferred) or email (fallback)
- Create/update their profile with `is_admin = true`
- Add admin role to their auth metadata (`roles: ['admin'], is_admin: true`)
- Print success confirmation

**Security Note**: The service role key is only used server-side in this script, never exposed to the client.

## Project info

**URL**: https://lovable.dev/projects/f44c23a1-66a8-4cd0-9d92-d6761abf4d0a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f44c23a1-66a8-4cd0-9d92-d6761abf4d0a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)

## Beta flags & safety

This platform implements server-controlled security monitoring with enterprise-grade safety controls.

### Environment Variables

```bash
# Security monitoring control (production default: true)
FORCE_FULL_MONITORING=true

# Temporary admin API authentication (replace with proper RBAC)
VITE_ADMIN_API_SECRET=your-secure-secret

# Feature flag storage backend
FLAG_STORE=supabase

# Override specific flags via environment (bypasses database)
FLAG_BETA_MONITORING=on
```

### Admin API Endpoints

#### GET /api/admin/flags
Returns current flag status and system configuration.

**Headers:** `x-admin-secret: your-secret`

**Response:**
```json
{
  "flags": { "beta_monitoring": "on" },
  "force_full_monitoring": false,
  "store": "supabase"
}
```

#### POST /api/admin/flags  
Updates feature flags (admin only).

**Headers:** 
- `x-admin-secret: your-secret`
- `Content-Type: application/json`

**Body:**
```json
{
  "key": "beta_monitoring",
  "value": "on"
}
```

### Override Priority

1. **Environment override** (`FORCE_FULL_MONITORING=true`) - Highest priority
2. **Database flags** (admin-controlled via API) - Standard operation  
3. **Safe defaults** (30s monitoring) - Fallback

### Security Monitoring Intervals

- **Production mode:** 30 seconds (comprehensive security checks)
- **Beta mode:** 5 minutes (optimized for development performance)

The system defaults to production mode for maximum security. Beta mode can only be enabled by admins through the secure API, and is automatically disabled if `FORCE_FULL_MONITORING=true`.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f44c23a1-66a8-4cd0-9d92-d6761abf4d0a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
