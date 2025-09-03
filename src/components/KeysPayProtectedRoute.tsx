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
  // TEMPORARILY DISABLED - Authentication bypassed
  return <>{children}</>;
};