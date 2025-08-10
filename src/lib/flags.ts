/*
 * AIKEYS FINANCIAL PLATFORM - SERVER-CONTROLLED FEATURE FLAGS
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY MODULE - SERVER-ONLY FLAGS
 * Uses Supabase Service Role for secure server-side operations
 */

import { getServiceRoleClient } from './supabase-client';

export type FlagValue = 'on' | 'off';
export type FlagKey = 'beta_monitoring';

/**
 * Get a server-side feature flag value
 * Priority: Environment override > Database store > null
 * SECURITY: Only use on server-side, never expose service role to client
 */
export async function getServerFlag(key: FlagKey): Promise<FlagValue | null> {
  try {
    // Check environment override first (highest priority)
    const envOverride = process.env[`FLAG_${key.toUpperCase()}`] as FlagValue;
    if (envOverride === 'on' || envOverride === 'off') {
      console.debug(`Flag ${key} overridden by environment: ${envOverride}`);
      return envOverride;
    }

    // Fall back to database store
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.error('Failed to read flag from Supabase:', error);
      return null;
    }
    
    const value = data?.value as FlagValue || null;
    console.debug(`Flag ${key} read from database: ${value}`);
    return value;
  } catch (error) {
    console.error('Server flag store error:', error);
    return null;
  }
}

/**
 * Set a server-side feature flag value
 * Returns false if environment override is active
 * SECURITY: Only use on server-side with proper admin authorization
 */
export async function setServerFlag(
  key: FlagKey, 
  value: FlagValue, 
  actorUserId?: string
): Promise<boolean> {
  try {
    // Check for env override first - cannot override environment flags
    const envOverride = process.env[`FLAG_${key.toUpperCase()}`];
    if (envOverride) {
      console.warn(`Cannot set flag ${key}: environment override active`);
      return false;
    }

    const supabase = getServiceRoleClient();
    
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
    const { error: auditError } = await supabase
      .from('admin_audit')
      .insert({
        action: 'flag_changed',
        meta: {
          key,
          value,
          actor_user_id: actorUserId,
          timestamp: new Date().toISOString()
        },
        actor: actorUserId,
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.error('Failed to write audit log:', auditError);
      // Don't fail the operation if audit log fails
    }

    console.info(`Admin flag changed: ${key}=${value} by user ${actorUserId}`);
    return true;
  } catch (error) {
    console.error('Server flag store set error:', error);
    return false;
  }
}

/**
 * Check if full monitoring is forced via environment
 * Default is true (safe default)
 */
export function isForceFullMonitoring(): boolean {
  const forced = process.env.FORCE_FULL_MONITORING;
  return forced !== 'false'; // Default to true unless explicitly set to 'false'
}

/**
 * Get current flag store type for debugging
 */
export function getFlagStoreType(): string {
  return process.env.FLAG_STORE || 'supabase';
}