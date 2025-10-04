import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  userRole: string | null;
  isProtectedOwner: boolean;
  sanitizedUser: User | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProtectedOwner, setIsProtectedOwner] = useState(false);
  const [sanitizedUser, setSanitizedUser] = useState<User | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      // SECURITY: Use server-side function to check roles from secure user_roles table
      const { data: primaryRole, error: roleError } = await supabase
        .rpc('get_user_primary_role', { _user_id: userId });
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setUserRole('user');
        setIsAdmin(false);
        setIsProtectedOwner(false);
        return;
      }
      
      // Check if user is admin using security definer function
      const { data: isAdminCheck, error: adminError } = await supabase
        .rpc('is_admin_user', { _user_id: userId });
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }
      
      // Check protected owner status from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_protected_owner')
        .eq('user_id', userId)
        .maybeSingle();
      
      const role = primaryRole || 'user';
      const isAdminUser = isAdminCheck || false;
      const isOwner = profile?.is_protected_owner || false;
      
      setUserRole(role);
      setIsAdmin(isAdminUser);
      setIsProtectedOwner(isOwner);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
      setIsAdmin(false);
      setIsProtectedOwner(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Test Supabase client connection first
    const testConnection = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.error('Supabase client test failed:', error);
      }
    };
    
    testConnection();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setSanitizedUser(session?.user ?? null);
        
        // Fetch user role when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 100);
        } else {
          setUserRole(null);
          setIsAdmin(false);
          setIsProtectedOwner(false);
          setSanitizedUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setSanitizedUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 100);
      }
      
      setLoading(false);
    }).catch(error => {
      console.error('Session check failed:', error);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    userRole,
    isProtectedOwner,
    sanitizedUser,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};