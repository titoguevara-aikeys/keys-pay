import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

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

// Mock users database
const mockUsers = new Map<string, { email: string; password: string; id: string; role: string }>();

// Initialize with a default user
mockUsers.set('tito.guevara@gmail.com', {
  email: 'tito.guevara@gmail.com',
  password: 'M@ski110525',
  id: 'mock-user-1',
  role: 'admin'
});

mockUsers.set('test@example.com', {
  email: 'test@example.com',
  password: 'password123',
  id: 'mock-user-2',
  role: 'user'
});

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProtectedOwner, setIsProtectedOwner] = useState(false);
  const [sanitizedUser, setSanitizedUser] = useState<User | null>(null);

  // Check for stored session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('mock_auth_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession.expires_at > Date.now()) {
          setSession(parsedSession);
          setUser(parsedSession.user);
          setSanitizedUser(parsedSession.user);
          setUserRole(parsedSession.user.role || 'user');
          setIsAdmin(parsedSession.user.role === 'admin');
          setIsProtectedOwner(parsedSession.user.role === 'admin');
        } else {
          localStorage.removeItem('mock_auth_session');
        }
      } catch (error) {
        localStorage.removeItem('mock_auth_session');
      }
    }
    setLoading(false);
  }, []);

  const createSession = (userData: any) => {
    const user: User = {
      id: userData.id,
      email: userData.email,
      user_metadata: {
        first_name: userData.email.split('@')[0],
        last_name: 'User'
      }
    };

    const session: Session = {
      user: { ...user, role: userData.role },
      access_token: `mock_token_${Date.now()}`,
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    } as any;

    setSession(session);
    setUser(user);
    setSanitizedUser(user);
    setUserRole(userData.role);
    setIsAdmin(userData.role === 'admin');
    setIsProtectedOwner(userData.role === 'admin');

    localStorage.setItem('mock_auth_session', JSON.stringify(session));
    
    return session;
  };

  const signUp = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mockUsers.has(email)) {
      return { error: { message: 'User already registered. Please sign in instead.' } };
    }

    // Create new mock user
    const newUser = {
      email,
      password,
      id: `mock-user-${Date.now()}`,
      role: 'user'
    };
    
    mockUsers.set(email, newUser);
    createSession(newUser);

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = mockUsers.get(email);
    
    if (!mockUser || mockUser.password !== password) {
      return { error: { message: 'Invalid email or password. Please check your credentials.' } };
    }

    createSession(mockUser);
    return { error: null };
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    setSanitizedUser(null);
    setUserRole(null);
    setIsAdmin(false);
    setIsProtectedOwner(false);
    localStorage.removeItem('mock_auth_session');
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
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};