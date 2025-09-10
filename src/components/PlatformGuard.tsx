/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY COMPONENT
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED ACCESS PROHIBITED
 */

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// IntellectualPropertyProtection import removed for development
import { IntruderWarning } from '@/components/security/IntruderWarning';

console.log('React in PlatformGuard:', React);
console.log('useState in PlatformGuard:', useState);

interface PlatformGuardProps {
  children: React.ReactNode;
}

export const PlatformGuard: React.FC<PlatformGuardProps> = ({ children }) => {
  console.log('PlatformGuard component rendering, React available:', !!React);
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [violationType, setViolationType] = useState('');

  useEffect(() => {
    // SECURITY DISABLED FOR BETA TESTING
    setIsAuthorized(true);
    setLoading(false);
    console.log('🔓 Platform security disabled for beta testing');
  }, []);

  // Listen for intruder warning events
  useEffect(() => {
    const handleWarningEvent = (event: CustomEvent) => {
      setViolationType(event.detail.violationType);
      setShowWarning(true);
    };

    window.addEventListener('showIntruderWarning', handleWarningEvent as EventListener);
    
    return () => {
      window.removeEventListener('showIntruderWarning', handleWarningEvent as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary animate-pulse" />
            <CardTitle>Validating Platform Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">
              Verifying authorization...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive/5">
        <Card className="w-96 border-destructive">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="text-destructive">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Access denied. Please contact support.
            </p>
            <div className="text-xs text-muted-foreground font-mono break-all">
              support@keyspay.ai
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      <IntruderWarning 
        violationType={violationType}
        show={showWarning}
        onClose={() => setShowWarning(false)}
      />
    </>
  );
};