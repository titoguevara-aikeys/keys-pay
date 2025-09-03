/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY MONITOR
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * REAL-TIME SECURITY MONITORING COMPONENT
 * Tracks and alerts on security events in real-time
 */

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const SecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState(95);
  const { toast } = useToast();

  useEffect(() => {
    const handleSecurityEvent = (event: CustomEvent) => {
      const { type, severity, metadata } = event.detail;
      
      const securityEvent: SecurityEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity,
        message: generateEventMessage(type, metadata),
        timestamp: new Date(),
        resolved: false
      };

      setEvents(prev => [securityEvent, ...prev.slice(0, 9)]); // Keep last 10 events
      
      // Update security score based on event severity
      const scoreImpact = {
        low: -1,
        medium: -3,
        high: -5,
        critical: -10
      };
      
      setSecurityScore(prev => Math.max(0, prev + scoreImpact[severity]));
      
      // Show critical alerts to user
      if (severity === 'critical' || severity === 'high') {
        toast({
          title: "Security Alert",
          description: securityEvent.message,
          variant: severity === 'critical' ? "destructive" : "default",
        });
      }
    };

    window.addEventListener('securityEvent', handleSecurityEvent as EventListener);
    
    // Simulate periodic security score recovery
    const scoreRecovery = setInterval(() => {
      setSecurityScore(prev => Math.min(100, prev + 0.5));
    }, 30000); // Recover 0.5 points every 30 seconds

    return () => {
      window.removeEventListener('securityEvent', handleSecurityEvent as EventListener);
      clearInterval(scoreRecovery);
    };
  }, [toast]);

  const generateEventMessage = (type: string, metadata: any): string => {
    switch (type) {
      case 'RATE_LIMIT_EXCEEDED':
        return `Rate limit exceeded from ${metadata?.identifier || 'unknown IP'}. Blocked for ${Math.round((metadata?.blockDuration || 0) / 60000)} minutes.`;
      case 'SUSPICIOUS_LOGIN':
        return 'Suspicious login attempt detected and blocked.';
      case 'API_KEY_INVALID':
        return 'Invalid API key usage detected.';
      case 'CSRF_TOKEN_MISMATCH':
        return 'CSRF token validation failed - potential attack blocked.';
      default:
        return `Security event: ${type}`;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 95) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="h-4 w-4" />;
    if (score >= 80) return <Shield className="h-4 w-4" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitor
          <Badge variant="outline" className={`ml-auto ${getScoreColor(securityScore)}`}>
            {getScoreIcon(securityScore)}
            {securityScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No security events detected</p>
            <p className="text-sm">System is secure</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                <div className={`mt-1 ${
                  event.severity === 'critical' ? 'text-red-500' :
                  event.severity === 'high' ? 'text-orange-500' :
                  event.severity === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}>
                  {event.severity === 'critical' || event.severity === 'high' ? 
                    <XCircle className="h-4 w-4" /> : 
                    <AlertTriangle className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant={
                  event.severity === 'critical' ? 'destructive' :
                  event.severity === 'high' ? 'secondary' :
                  'outline'
                } className="text-xs">
                  {event.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};