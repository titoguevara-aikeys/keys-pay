/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY WARNING COMPONENT
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED ACCESS PROHIBITED
 */

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Eye, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IntruderWarningProps {
  violationType: string;
  show: boolean;
  onClose?: () => void;
}

export const IntruderWarning: React.FC<IntruderWarningProps> = ({ 
  violationType, 
  show, 
  onClose 
}) => {
  const [countdown, setCountdown] = useState(30);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsVisible(false);
            onClose?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  const warningMessages = {
    UNAUTHORIZED_DOMAIN_ACCESS: "Unauthorized domain access detected",
    DEVELOPER_TOOLS_DETECTED: "Developer tools usage monitored",
    CONSOLE_TAMPERING: "Console manipulation attempt blocked",
    DOMAIN_MANIPULATION: "Domain manipulation detected",
    CODE_INSPECTION: "Code inspection attempt logged",
    REVERSE_ENGINEERING: "Reverse engineering attempt blocked"
  };

  return (
    <div className="fixed inset-0 bg-destructive/20 backdrop-blur-sm z-[10000] flex items-center justify-center">
      <Card className="w-96 border-destructive bg-destructive/5 animate-pulse">
        <CardHeader className="text-center border-b border-destructive/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <AlertTriangle className="h-8 w-8 text-destructive animate-bounce" />
            <Shield className="h-8 w-8 text-destructive" />
            <Eye className="h-8 w-8 text-destructive animate-pulse" />
          </div>
          <CardTitle className="text-destructive text-xl">
            🚨 SECURITY VIOLATION DETECTED 🚨
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 pt-6">
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <Ban className="h-6 w-6 mx-auto text-destructive mb-2" />
            <p className="text-sm font-medium text-destructive">
              {warningMessages[violationType as keyof typeof warningMessages] || 
               "Unauthorized activity detected"}
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-destructive">
              ⚠️ LEGAL WARNING ⚠️
            </p>
            <p>
              This platform is protected by intellectual property laws.
              Your activities are being monitored and logged.
            </p>
            <p>
              Unauthorized access, reverse engineering, or cloning attempts 
              constitute violations of copyright and trade secret law.
            </p>
            <p className="font-medium">
              Violations are subject to legal action and prosecution.
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded text-xs">
            <p className="font-mono">
              Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p className="font-mono">
              Timestamp: {new Date().toISOString()}
            </p>
            <p className="font-mono text-destructive">
              Auto-close in: {countdown}s
            </p>
          </div>

          <div className="text-xs opacity-60">
            <p>© 2025 AIKEYS Financial Technologies</p>
            <p>All violations reported to platform owner</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};