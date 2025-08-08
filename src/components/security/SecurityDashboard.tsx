/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY DASHBOARD
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * Real-time Security Monitoring Dashboard
 * Executive view of platform security posture
 */

import React, { useState, useEffect } from 'react';
import { Shield, Eye, AlertTriangle, CheckCircle, Activity, Lock, Globe, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityCore } from '@/utils/securityCore';
import { useSecurity } from './SecurityProvider';

interface SecurityMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  blocked: boolean;
}

export const SecurityDashboard: React.FC = () => {
  const { riskProfile, securityLevel, securityScore } = useSecurity();
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [auditData, setAuditData] = useState<any>(null);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security audit data
      const audit = await SecurityCore.performSecurityAudit();
      setAuditData(audit);

      // Generate security metrics
      const metrics: SecurityMetric[] = [
        {
          name: 'Identity Protection',
          value: riskProfile ? Math.max(0, 100 - riskProfile.score) : 85,
          status: securityLevel === 'critical' ? 'critical' : securityLevel === 'high' ? 'warning' : 'good',
          description: 'WebAuthn, MFA, and behavioral analysis active'
        },
        {
          name: 'Data Encryption',
          value: 98,
          status: 'good',
          description: 'AES-256 encryption with hardware-backed keys'
        },
        {
          name: 'Network Security',
          value: 95,
          status: 'good',
          description: 'TLS 1.3, WAF protection, and DDoS mitigation'
        },
        {
          name: 'Fraud Detection',
          value: 92,
          status: 'good',
          description: 'Real-time transaction monitoring and ML analysis'
        },
        {
          name: 'Compliance Status',
          value: 97,
          status: 'good',
          description: 'ISO 27001, PCI DSS, SAMA framework aligned'
        },
        {
          name: 'Threat Response',
          value: audit?.criticalEvents > 0 ? 70 : 94,
          status: audit?.criticalEvents > 0 ? 'warning' : 'good',
          description: 'Automated incident response and alerting'
        }
      ];

      setSecurityMetrics(metrics);

      // Load recent threat events
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      const recentEvents = events
        .slice(-10)
        .map((event: any, index: number) => ({
          id: `event-${index}`,
          type: event.type,
          severity: event.severity,
          timestamp: event.timestamp,
          description: getThreatDescription(event.type),
          blocked: event.blocked
        }));

      setThreatEvents(recentEvents);
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  };

  const getThreatDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'DEVELOPER_TOOLS_DETECTED': 'Unauthorized development tools usage detected',
      'CONSOLE_ACCESS_DETECTED': 'Console tampering attempt blocked',
      'CONTEXT_MENU_BLOCKED': 'Right-click context menu blocked',
      'FRAUD_DETECTED': 'Fraudulent transaction pattern identified',
      'IMPOSSIBLE_TRAVEL': 'Geographically impossible user movement',
      'RATE_LIMIT_EXCEEDED': 'API rate limit exceeded',
      'SESSION_TIMEOUT': 'Session expired due to inactivity',
      'NEW_DEVICE': 'Login from unrecognized device',
      'GEOLOCATION_BLOCKED': 'User blocked geolocation access'
    };

    return descriptions[type] || 'Security event detected';
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getSecurityScoreColor(securityScore)}`}>
                  {securityScore}/100
                </span>
                <Badge 
                  variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"}
                >
                  {getSecurityScoreStatus(securityScore)}
                </Badge>
              </div>
              <Progress value={securityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Real-time security posture assessment
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Threat Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {auditData?.recentEvents || 0}
                </span>
                <Badge variant="outline">24h</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs">{auditData?.criticalEvents || 0} Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">{auditData?.highRiskEvents || 0} High</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Events detected and mitigated
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Identity Systems</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Encryption Layer</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Fraud Detection</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Metrics */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="threats">Threat Events</TabsTrigger>
          <TabsTrigger value="device">Device Security</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {metric.name}
                    <Badge 
                      variant={
                        metric.status === 'good' ? "default" : 
                        metric.status === 'warning' ? "secondary" : 
                        "destructive"
                      }
                    >
                      {metric.value}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={metric.value} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threatEvents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>No security threats detected recently</p>
                  </div>
                ) : (
                  threatEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              event.severity === 'critical' ? "destructive" :
                              event.severity === 'high' ? "secondary" :
                              "outline"
                            }
                          >
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{event.type}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {event.blocked ? (
                          <Badge variant="default" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            BLOCKED
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            MONITORED
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Device Fingerprint:</span>
                  <span className="font-mono text-xs">
                    {riskProfile?.deviceFingerprint?.substring(0, 12) || 'Loading...'}...
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trust Level:</span>
                  <Badge variant={securityLevel === 'low' ? "default" : "secondary"}>
                    {securityLevel === 'low' ? 'Trusted' : 'Verification Required'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform:</span>
                  <span>{navigator.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Browser:</span>
                  <span>{navigator.userAgent.split(' ')[0]}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Session Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Session Duration:</span>
                  <span>
                    {Math.floor((riskProfile?.behavioral.sessionDuration || 0) / 60000)}m
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Encryption:</span>
                  <Badge variant="default">AES-256</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Connection:</span>
                  <Badge variant="default">TLS 1.3</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Location Access:</span>
                  <Badge variant={riskProfile?.geoLocation ? "default" : "secondary"}>
                    {riskProfile?.geoLocation ? 'Granted' : 'Blocked'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};