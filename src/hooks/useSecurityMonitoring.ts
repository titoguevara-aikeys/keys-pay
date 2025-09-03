/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY MONITORING HOOK
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * REACT HOOK FOR SECURITY EVENT MONITORING
 * Provides real-time security monitoring capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { securityAlerting, SecurityMetrics } from '@/lib/security/alerting';
import { useToast } from '@/components/ui/use-toast';

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metadata?: any;
}

export const useSecurityMonitoring = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    highRiskEvents: 0,
    blockedEvents: 0,
    recentEvents: 0,
    securityScore: 100
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  // Process incoming security events
  const handleSecurityEvent = useCallback(async (event: CustomEvent) => {
    const { type, severity, metadata } = event.detail;
    
    const securityEvent: SecurityEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message: generateEventMessage(type, metadata),
      timestamp: new Date(),
      metadata
    };

    // Add to events list (keep last 50 events)
    setEvents(prev => [securityEvent, ...prev.slice(0, 49)]);
    
    // Process through security alerting system
    await securityAlerting.processSecurityEvent({
      type,
      severity,
      metadata,
      userId: metadata?.userId,
      ipAddress: metadata?.ipAddress || metadata?.identifier
    });
    
    // Update metrics
    setMetrics(securityAlerting.getMetrics());
    
    // Show user notifications for high-severity events
    if (severity === 'critical' || severity === 'high') {
      toast({
        title: severity === 'critical' ? "Critical Security Alert" : "Security Alert",
        description: securityEvent.message,
        variant: severity === 'critical' ? "destructive" : "default",
      });
    }
  }, [toast]);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    window.addEventListener('securityEvent', handleSecurityEvent as EventListener);
    
    console.log('🛡️ Security monitoring started');
  }, [isMonitoring, handleSecurityEvent]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;
    
    setIsMonitoring(false);
    window.removeEventListener('securityEvent', handleSecurityEvent as EventListener);
    
    console.log('🛡️ Security monitoring stopped');
  }, [isMonitoring, handleSecurityEvent]);

  // Trigger a security event (for testing or manual events)
  const triggerSecurityEvent = useCallback((
    type: string, 
    severity: 'low' | 'medium' | 'high' | 'critical', 
    metadata?: any
  ) => {
    window.dispatchEvent(new CustomEvent('securityEvent', {
      detail: { type, severity, metadata }
    }));
  }, []);

  // Clear events history
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Get security score status
  const getSecurityStatus = useCallback(() => {
    const score = metrics.securityScore;
    if (score >= 95) return { status: 'excellent', color: 'green' };
    if (score >= 80) return { status: 'good', color: 'blue' };
    if (score >= 60) return { status: 'warning', color: 'yellow' };
    return { status: 'critical', color: 'red' };
  }, [metrics.securityScore]);

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Periodic metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(securityAlerting.getMetrics());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    events,
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    triggerSecurityEvent,
    clearEvents,
    getSecurityStatus
  };
};

// Helper function to generate human-readable event messages
function generateEventMessage(type: string, metadata: any): string {
  const messages: Record<string, string> = {
    'RATE_LIMIT_EXCEEDED': `Rate limit exceeded${metadata?.identifier ? ` from ${metadata.identifier}` : ''}. ${metadata?.violations ? `${metadata.violations} violations.` : ''}`,
    'SUSPICIOUS_LOGIN': 'Suspicious login attempt detected and blocked.',
    'API_KEY_INVALID': 'Invalid API key usage detected.',
    'CSRF_TOKEN_MISMATCH': 'CSRF token validation failed - potential attack blocked.',
    'MULTIPLE_FAILED_LOGINS': `Multiple failed login attempts${metadata?.identifier ? ` from ${metadata.identifier}` : ''}.`,
    'UNUSUAL_LOCATION': 'Login attempt from unusual location.',
    'BRUTE_FORCE_ATTEMPT': 'Brute force attack detected and blocked.',
    'XSS_ATTEMPT': 'Cross-site scripting attempt blocked.',
    'SQL_INJECTION_ATTEMPT': 'SQL injection attempt detected and blocked.',
    'FILE_UPLOAD_THREAT': 'Malicious file upload attempt blocked.'
  };

  return messages[type] || `Security event: ${type}`;
}
