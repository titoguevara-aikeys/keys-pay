import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    console.log('🔧 KeysPay Auth Context Initializing...');
    
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth Session Error:', error);
        }
        
        if (mounted) {
          console.log('✅ Initial session loaded:', session ? 'Session found' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`🔄 Auth State Change: ${event}`, session ? 'With session' : 'No session');
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('🔄 KeysPay SignUp attempt for:', email);
    
    try {
      // Test connection before attempting signup
      const { data: testSession, error: testError } = await supabase.auth.getSession();
      if (testError && !testError.message.includes('session')) {
        throw new Error(`Connection failed: ${testError.message}`);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('❌ SignUp error:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
      } else {
        console.log('✅ SignUp successful:', data.user ? 'User created' : 'Confirmation email sent');
      }
      
      return { error };
    } catch (err: any) {
      console.error('❌ SignUp exception:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔄 KeysPay SignIn attempt for:', email);
    
    try {
      // Test connection before attempting signin
      const { data: testSession, error: testError } = await supabase.auth.getSession();
      if (testError && !testError.message.includes('session')) {
        throw new Error(`Connection failed: ${testError.message}`);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ SignIn error:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
      } else {
        console.log('✅ SignIn successful:', data.user ? 'User authenticated' : 'No user returned');
      }
      
      return { error };
    } catch (err: any) {
      console.error('❌ SignIn exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('🔄 KeysPay SignOut');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ SignOut error:', error);
      } else {
        console.log('✅ SignOut successful');
      }
    } catch (err) {
      console.error('❌ SignOut exception:', err);
    }
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