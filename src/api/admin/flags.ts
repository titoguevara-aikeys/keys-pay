/*
 * AIKEYS FINANCIAL PLATFORM - ADMIN FLAGS API
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY MODULE - ADMIN-ONLY API
 * Server-side feature flags management
 */

import { getServerFlag, setServerFlag, isForceFullMonitoring, getFlagStoreType, type FlagKey, type FlagValue } from '@/lib/flags';

// Rate limiting - simple in-memory store for temporary use
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function validateAdminAccess(request: Request): boolean {
  // TODO: Replace with proper RBAC authentication
  const adminSecret = request.headers.get('x-admin-secret');
  const expectedSecret = import.meta.env.VITE_ADMIN_API_SECRET || 'temp-admin-secret';
  
  return adminSecret === expectedSecret;
}

export async function handleFlagsRequest(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Auth check
    if (!validateAdminAccess(request)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid or missing x-admin-secret header' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (request.method === 'GET') {
      // Get all flags
      const betaMonitoring = await getServerFlag('beta_monitoring');
      const forceFullMonitoring = isForceFullMonitoring();
      const storeType = getFlagStoreType();

      return new Response(
        JSON.stringify({
          flags: {
            beta_monitoring: betaMonitoring || 'off'
          },
          force_full_monitoring: forceFullMonitoring,
          store: storeType
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (request.method === 'POST') {
      // Parse request body
      const body = await request.json();
      const { key, value } = body;

      // Validate input
      if (!key || !value) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: key, value' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (key !== 'beta_monitoring') {
        return new Response(
          JSON.stringify({ error: 'Invalid flag key' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (value !== 'on' && value !== 'off') {
        return new Response(
          JSON.stringify({ error: 'Invalid flag value, must be "on" or "off"' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Check for environment override conflict
      if (isForceFullMonitoring() && value === 'on') {
        return new Response(
          JSON.stringify({ 
            error: 'Cannot enable beta monitoring: FORCE_FULL_MONITORING environment override is active',
            force_full_monitoring: true
          }),
          { 
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Set the flag
      const success = await setServerFlag(key as FlagKey, value as FlagValue, 'admin-api');
      
      if (!success) {
        return new Response(
          JSON.stringify({ error: 'Failed to set flag - may be overridden by environment' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log(`Admin flag changed: ${key}=${value} via IP ${clientIP}`);

      return new Response(
        JSON.stringify({
          ok: true,
          key,
          value,
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Admin flags API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}