import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useKeysPayAuth } from '@/contexts/KeysPayAuthContext';

interface KeysPayProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const KeysPayProtectedRoute: React.FC<KeysPayProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { user, loading } = useKeysPayAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};