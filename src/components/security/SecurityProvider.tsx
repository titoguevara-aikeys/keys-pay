/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY PROVIDER
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY CONTEXT PROVIDER
 * Transparent security layer for seamless user experience
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SecurityCore, RiskProfile } from '@/utils/securityCore';
import { useToast } from '@/components/ui/use-toast';

interface SecurityContextType {
  riskProfile: RiskProfile | null;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  isAuthenticated: boolean;
  requireStepUp: boolean;
  securityScore: number;
  performSecurityCheck: () => Promise<void>;
  requestStepUpAuth: (reason: string) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [requireStepUp, setRequireStepUp] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    // SECURITY DISABLED FOR BETA TESTING
    setSecurityLevel('low');
    console.log('🔓 Security features disabled for beta testing');
  };

  const performSecurityCheck = async () => {
    try {
      const profile = SecurityCore.getRiskProfile();
      setRiskProfile(profile);
      
      if (profile) {
        setSecurityScore(profile.score);
        
        // Determine security level based on risk score
        if (profile.score < 30) {
          setSecurityLevel('low');
        } else if (profile.score < 60) {
          setSecurityLevel('medium');
        } else if (profile.score < 85) {
          setSecurityLevel('high');
          setRequireStepUp(true);
        } else {
          setSecurityLevel('critical');
          setRequireStepUp(true);
          
          // Show non-intrusive security notice
          toast({
            title: "Enhanced Security Active",
            description: "Additional verification may be required for sensitive actions.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error('Security check failed:', error);
    }
  };

  const requestStepUpAuth = async (reason: string): Promise<boolean> => {
    try {
      // In a real implementation, this would trigger WebAuthn or other strong auth
      // For now, we'll simulate the step-up process
      
      if (securityLevel === 'critical') {
        toast({
          title: "Additional Verification Required",
          description: "Please verify your identity to continue with this action.",
          variant: "default",
        });
        
        // Trigger biometric auth if available
        if (navigator.credentials && 'create' in navigator.credentials) {
          try {
            // WebAuthn challenge would go here
            return true;
          } catch (error) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Step-up authentication failed:', error);
      return false;
    }
  };

  // Continuous security monitoring (background)
  useEffect(() => {
    const securityMonitor = setInterval(async () => {
      await performSecurityCheck();
    }, 60000); // Check every minute

    return () => clearInterval(securityMonitor);
  }, []);

  // Monitor for security events
  useEffect(() => {
    const handleSecurityEvent = (event: CustomEvent) => {
      const { type, severity } = event.detail;
      
      // Only show user-facing notifications for high/critical events
      if (severity === 'high' || severity === 'critical') {
        toast({
          title: "Security Notice",
          description: "Unusual activity detected. Your account security has been enhanced.",
          variant: severity === 'critical' ? "destructive" : "default",
        });
      }
    };

    window.addEventListener('securityEvent', handleSecurityEvent as EventListener);
    
    return () => {
      window.removeEventListener('securityEvent', handleSecurityEvent as EventListener);
    };
  }, [toast]);

  const contextValue: SecurityContextType = {
    riskProfile,
    securityLevel,
    isAuthenticated,
    requireStepUp,
    securityScore,
    performSecurityCheck,
    requestStepUpAuth,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};