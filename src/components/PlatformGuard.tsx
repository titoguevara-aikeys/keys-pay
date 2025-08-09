/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY COMPONENT
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED ACCESS PROHIBITED
 */

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntellectualPropertyProtection } from '@/utils/intellectualProperty';
import { IntruderWarning } from '@/components/security/IntruderWarning';

interface PlatformGuardProps {
  children: React.ReactNode;
}

export const PlatformGuard: React.FC<PlatformGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [violationType, setViolationType] = useState('');

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

        // Allow all Lovable and development environments
        if (currentDomain.includes('lovableproject.com') || 
            currentDomain.includes('lovable.app') ||
            currentDomain.includes('vercel.app') ||
            currentDomain.includes('netlify.app') ||
            currentDomain === 'localhost' ||
            currentDomain.startsWith('127.0.0.1') ||
            currentDomain.startsWith('192.168') ||
            process.env.NODE_ENV === 'development') {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        if (!authorizedDomains.includes(currentDomain)) {
          // Only log violations for actual production domains
          if (!currentDomain.includes('preview') && !currentDomain.includes('staging')) {
            IntellectualPropertyProtection.logIPViolation('UNAUTHORIZED_DOMAIN_ACCESS', {
              attemptedDomain: currentDomain,
              authorizedDomains: authorizedDomains,
              timestamp: new Date().toISOString()
            });
          }
          
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error('Platform validation error:', error);
        // In case of validation errors, allow access in development
        if (process.env.NODE_ENV === 'development' || 
            window.location.hostname.includes('lovableproject.com')) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
        setLoading(false);
      }
    };

    validateAccess();

    // Disable runtime protection in development and preview environments
    if (window.location.hostname.includes('lovableproject.com') ||
        window.location.hostname.includes('preview') ||
        window.location.hostname.includes('staging') ||
        process.env.NODE_ENV === 'development') {
      return;
    }

    // Runtime protection only for production domains
    const protectionInterval = setInterval(() => {
      const currentHost = window.location.hostname;
      
      const authorizedDomains = [
        'www.aikeys.ai',
        'www.aikeys-hub.com',
        'aikeys.ai',
        'aikeys-hub.com',
        'localhost'
      ];
      
      if (!authorizedDomains.includes(currentHost)) {
        IntellectualPropertyProtection.logIPViolation('DOMAIN_MANIPULATION', {
          currentDomain: currentHost,
          timestamp: new Date().toISOString()
        });
        setIsAuthorized(false);
      }
    }, 30000); // Increased interval to reduce aggressive checking

    return () => clearInterval(protectionInterval);
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
              {IntellectualPropertyProtection.getIPNotice()}
            </p>
            <div className="text-xs text-muted-foreground font-mono break-all">
              {IntellectualPropertyProtection.getViolationContact()}
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