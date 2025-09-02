import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Direct Supabase client for KeysPay auth to ensure fresh connection
const keysPaySupabase = createClient(
  'https://emolyyvmvvfjyxbguhyn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU',
  {
    auth: {
      storage: window.localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

interface KeysPayAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const KeysPayAuthContext = createContext<KeysPayAuthContextType | undefined>(undefined);

export const KeysPayAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    keysPaySupabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(error => {
      console.error('Error getting initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = keysPaySupabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('KeysPay Auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('KeysPay SignUp attempt:', email);
    const { error } = await keysPaySupabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      console.error('SignUp error:', error);
    } else {
      console.log('SignUp success');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('KeysPay SignIn attempt:', email);
    const { error } = await keysPaySupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('SignIn error:', error);
    } else {
      console.log('SignIn success');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('KeysPay SignOut');
    const { error } = await keysPaySupabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <KeysPayAuthContext.Provider value={value}>
      {children}
    </KeysPayAuthContext.Provider>
  );
};

export const useKeysPayAuth = () => {
  const context = useContext(KeysPayAuthContext);
  if (context === undefined) {
    throw new Error('useKeysPayAuth must be used within a KeysPayAuthProvider');
  }
  return context;
};