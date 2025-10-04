/*
 * AIKEYS FINANCIAL PLATFORM - REAL-TIME SECURITY MONITOR
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * Live Security Event Monitoring Component
 */

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Shield, Eye, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  source: string;
  blocked: boolean;
}

export const RealTimeMonitor: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Listen for security events
    const handleSecurityEvent = (event: CustomEvent) => {
      const newEvent: SecurityEvent = {
        id: `event-${Date.now()}`,
        type: event.detail.type,
        severity: event.detail.severity,
        message: getEventMessage(event.detail.type),
        timestamp: new Date(),
        source: event.detail.source || 'security_core',
        blocked: event.detail.blocked || false
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    };

    window.addEventListener('securityEvent', handleSecurityEvent as EventListener);
    
    // Simulate some security events for demo
    simulateSecurityEvents();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    window.removeEventListener('securityEvent', () => {});
  };

  const simulateSecurityEvents = () => {
    const eventTypes = [
      { type: 'LOGIN_SUCCESS', severity: 'low' as const },
      { type: 'DEVICE_FINGERPRINTED', severity: 'low' as const },
      { type: 'SESSION_EXTENDED', severity: 'low' as const },
      { type: 'API_ACCESS', severity: 'low' as const },
      { type: 'LOCATION_VERIFIED', severity: 'low' as const }
    ];

    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70% chance of event
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const event = new CustomEvent('securityEvent', {
          detail: {
            type: eventType.type,
            severity: eventType.severity,
            source: 'monitor_demo',
            blocked: false
          }
        });
        window.dispatchEvent(event);
      }
    }, 5000); // Every 5 seconds

    // Clean up interval after 1 minute
    setTimeout(() => clearInterval(interval), 60000);
  };

  const getEventMessage = (type: string): string => {
    const messages: Record<string, string> = {
      'LOGIN_SUCCESS': 'User authentication successful',
      'DEVICE_FINGERPRINTED': 'Device fingerprint generated',
      'SESSION_EXTENDED': 'User session activity detected',
      'API_ACCESS': 'API endpoint accessed',
      'LOCATION_VERIFIED': 'Geographic location verified',
      'DEVELOPER_TOOLS_DETECTED': 'Developer tools usage detected',
      'CONSOLE_ACCESS_DETECTED': 'Console access attempt blocked',
      'FRAUD_DETECTED': 'Fraudulent activity pattern identified',
      'IMPOSSIBLE_TRAVEL': 'Impossible travel pattern detected',
      'AUTOMATION_DETECTED': 'Automated access pattern detected',
      'EXCESSIVE_REQUESTS': 'Rate limit exceeded',
      'STORAGE_ENUMERATION': 'Storage enumeration attempt',
      'POTENTIAL_SCRAPING': 'Content scraping attempt detected',
      'NEW_DEVICE': 'New device login detected',
      'GEOLOCATION_BLOCKED': 'Location access denied by user'
    };
    
    return messages[type] || `Security event: ${type}`;
  };

  const getEventIcon = (type: string) => {
    if (type.includes('DETECTED') || type.includes('BLOCKED')) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    if (type.includes('SUCCESS') || type.includes('VERIFIED')) {
      return <Shield className="h-4 w-4 text-green-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Real-Time Security Monitor
          {isMonitoring && (
            <Badge variant="default" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>Waiting for security events...</p>
                <p className="text-sm">Monitoring active</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    {getEventIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{event.type}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(event.severity)}`}
                        >
                          {event.severity.toUpperCase()}
                        </Badge>
                        {event.blocked && (
                          <Badge variant="destructive" className="text-xs">
                            BLOCKED
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {event.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Source: {event.source}</span>
                        <span>{event.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};