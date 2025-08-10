/*
 * AIKEYS FINANCIAL PLATFORM - SERVER-CONTROLLED FEATURE FLAGS
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY MODULE - SERVER-ONLY FLAGS
 * Compliant with Zero Trust Architecture
 */

import { supabase } from '@/integrations/supabase/client';

export type FlagValue = 'on' | 'off';
export type FlagKey = 'beta_monitoring';

interface FlagStore {
  getFlag(key: FlagKey): Promise<FlagValue | null>;
  setFlag(key: FlagKey, value: FlagValue, actorUserId?: string): Promise<boolean>;
}

class SupabaseFlagStore implements FlagStore {
  async getFlag(key: FlagKey): Promise<FlagValue | null> {
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

  async setFlag(key: FlagKey, value: FlagValue, actorUserId?: string): Promise<boolean> {
    try {
      // Check for env override first
      const envOverride = process.env[`FLAG_${key.toUpperCase()}`] as FlagValue;
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
      await this.writeAuditLog('flag_changed', {
        key,
        value,
        actor_user_id: actorUserId,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Supabase flag store set error:', error);
      return false;
    }
  }

  private async writeAuditLog(action: string, meta: any): Promise<void> {
    try {
      await supabase
        .from('admin_audit')
        .insert({
          action,
          meta,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}

// Initialize flag store based on configuration
const getFlagStore = (): FlagStore => {
  const storeType = process.env.FLAG_STORE || 'supabase';
  
  switch (storeType) {
    case 'supabase':
      return new SupabaseFlagStore();
    default:
      console.warn(`Unknown flag store type: ${storeType}, defaulting to Supabase`);
      return new SupabaseFlagStore();
  }
};

const flagStore = getFlagStore();

/**
 * Get a server-side feature flag value
 * Priority: Environment override > Database store > null
 */
export async function getServerFlag(key: FlagKey): Promise<FlagValue | null> {
  // Check environment override first
  const envOverride = process.env[`FLAG_${key.toUpperCase()}`] as FlagValue;
  if (envOverride === 'on' || envOverride === 'off') {
    return envOverride;
  }

  // Fall back to store
  return await flagStore.getFlag(key);
}

/**
 * Set a server-side feature flag value
 * Returns false if environment override is active
 */
export async function setServerFlag(key: FlagKey, value: FlagValue, actorUserId?: string): Promise<boolean> {
  return await flagStore.setFlag(key, value, actorUserId);
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