/*
 * AIKEYS FINANCIAL PLATFORM - ADMIN FLAGS EDGE FUNCTION
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY MODULE - SERVER-SIDE FEATURE FLAGS
 * Deployed as Supabase Edge Function for production use
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const adminSecret = Deno.env.get('ADMIN_API_SECRET') || 'temp-admin-secret';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Server-controlled feature flags
type FlagValue = 'on' | 'off';
type FlagKey = 'beta_monitoring';

// Rate limiting store
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
  const providedSecret = request.headers.get('x-admin-secret');
  return providedSecret === adminSecret;
}

async function getServerFlag(key: FlagKey): Promise<FlagValue | null> {
  // Check environment override first
  const envOverride = Deno.env.get(`FLAG_${key.toUpperCase()}`) as FlagValue;
  if (envOverride === 'on' || envOverride === 'off') {
    return envOverride;
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to read flag from Supabase:', error);
      return null;
    }
    
    return data?.value as FlagValue || null;
  } catch (error) {
    console.error('Supabase flag store error:', error);
    return null;
  }
}

async function setServerFlag(key: FlagKey, value: FlagValue, actorUserId?: string): Promise<boolean> {
  try {
    // Check for env override first
    const envOverride = Deno.env.get(`FLAG_${key.toUpperCase()}`) as FlagValue;
    if (envOverride) {
      console.warn(`Cannot set flag ${key}: environment override active`);
      return false;
    }

    // Upsert the flag
    const { error: upsertError } = await supabase
      .from('admin_settings')
      .upsert({
        key,
        value,
        updated_by: actorUserId,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Failed to set flag in Supabase:', upsertError);
      return false;
    }

    // Write audit log
    await supabase
      .from('admin_audit')
      .insert({
        action: 'flag_changed',
        meta: {
          key,
          value,
          actor_user_id: actorUserId,
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      });

    return true;
  } catch (error) {
    console.error('Supabase flag store set error:', error);
    return false;
  }
}

function isForceFullMonitoring(): boolean {
  const forced = Deno.env.get('FORCE_FULL_MONITORING');
  return forced !== 'false'; // Default to true unless explicitly set to 'false'
}

function getFlagStoreType(): string {
  return Deno.env.get('FLAG_STORE') || 'supabase';
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(req);
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
    if (!validateAdminAccess(req)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid or missing x-admin-secret header' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method === 'GET') {
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

    if (req.method === 'POST') {
      // Parse request body
      const body = await req.json() as { key?: string; value?: string };
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
});