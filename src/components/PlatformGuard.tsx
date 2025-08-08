import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlatformGuardProps {
  children: React.ReactNode;
}

export const PlatformGuard: React.FC<PlatformGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Check domain authorization
        const currentDomain = window.location.hostname;
        const authorizedDomains = [
          'www.aikeys.ai',
          'www.aikeys-hub.com',
          'aikeys.ai',
          'aikeys-hub.com',
          'localhost'
        ];

        if (!authorizedDomains.includes(currentDomain)) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Additional license verification can be added here
        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Platform validation error:', error);
        setIsAuthorized(false);
        setLoading(false);
      }
    };

    validateAccess();

    // Add runtime protection
    const protectionInterval = setInterval(() => {
      if (window.location.hostname !== 'localhost' && 
          !window.location.hostname.includes('aikeys')) {
        setIsAuthorized(false);
      }
    }, 5000);

    return () => clearInterval(protectionInterval);
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
              This platform is licensed exclusively for AIKEYS Financial Platform.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact: tito.guevara@aikeys.ai or tito.guevara@gmail.com for authorization.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};