/*
 * AIKEYS FINANCIAL PLATFORM - SERVER-SIDE SUPABASE CLIENT
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY MODULE - SERVICE ROLE CLIENT
 * Server-side only client with service role key
 */

import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client with service role (never expose to client)
export const getServiceRoleClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role configuration');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

/**
 * Check if user is admin using session data
 * Priority: app_metadata > profiles table
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    
    // Check profiles table for admin status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to check admin status:', error);
      return false;
    }

    return profile?.is_admin === true;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}