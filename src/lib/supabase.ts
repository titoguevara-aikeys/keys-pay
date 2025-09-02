import { createClient } from '@supabase/supabase-js';

// Using the current valid Supabase credentials from system configuration
const supabaseUrl = 'https://emolyyvmvvfjyxbguhyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MDI3NDIsImV4cCI6MjA0OTk3ODc0Mn0.pk3Uln3jPZnQUye4hlUc68PBSA2CXVNJRcGM22VDt9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window?.localStorage || undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});