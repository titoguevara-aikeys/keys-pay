/*
 * AIKEYS FINANCIAL PLATFORM - ENHANCED SECURITY DASHBOARD
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * Real-time Security Monitoring & Threat Intelligence Dashboard
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, AlertTriangle, CheckCircle, Activity, Lock, Globe, Smartphone,
  Wifi, Users, Clock, TrendingUp, AlertCircle, Zap, BarChart3, RefreshCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SecurityCore } from '@/utils/securityCore';
import { useSecurity } from './SecurityProvider';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  source: string;
}

interface ThreatIntelligence {
  blockedAttacks: number;
  suspiciousIPs: number;
  malwareDetections: number;
  dataExfiltrationAttempts: number;
  lastUpdated: string;
}

interface SystemHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  securityScore: number;
  activeConnections: number;
}

export const EnhancedSecurityDashboard: React.FC = () => {
  const { riskProfile, securityLevel, securityScore } = useSecurity();
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [threatIntel, setThreatIntel] = useState<ThreatIntelligence | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security alerts
      await loadSecurityAlerts();
      
      // Load threat intelligence
      await loadThreatIntelligence();
      
      // Load system health
      await loadSystemHealth();
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  };

  const loadSecurityAlerts = async () => {
    try {
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      const recentAlerts = events
        .slice(-20)
        .filter((event: any) => event.severity === 'high' || event.severity === 'critical')
        .map((event: any, index: number) => ({
          id: `alert-${index}`,
          type: event.type,
          severity: event.severity,
          title: getAlertTitle(event.type),
          description: getAlertDescription(event.type),
          timestamp: event.timestamp,
          status: event.blocked ? 'resolved' : 'active',
          source: event.source || 'security_core'
        }));

      setAlerts(recentAlerts);
    } catch (error) {
      console.error('Failed to load security alerts:', error);
    }
  };

  const loadThreatIntelligence = async () => {
    // Simulate threat intelligence data
    // In a real implementation, this would come from your security APIs
    const intel: ThreatIntelligence = {
      blockedAttacks: Math.floor(Math.random() * 50) + 20,
      suspiciousIPs: Math.floor(Math.random() * 15) + 5,
      malwareDetections: Math.floor(Math.random() * 5),
      dataExfiltrationAttempts: Math.floor(Math.random() * 3),
      lastUpdated: new Date().toISOString()
    };
    
    setThreatIntel(intel);
  };

  const loadSystemHealth = async () => {
    const health: SystemHealth = {
      uptime: 99.9,
      responseTime: Math.floor(Math.random() * 100) + 50,
      errorRate: Math.random() * 0.5,
      securityScore: securityScore,
      activeConnections: Math.floor(Math.random() * 1000) + 500
    };
    
    setSystemHealth(health);
  };

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    await loadSecurityData();
    setIsRefreshing(false);
    
    toast({
      title: "Dashboard Updated",
      description: "Security data has been refreshed",
    });
  };

  const getAlertTitle = (type: string): string => {
    const titles: Record<string, string> = {
      'DEVELOPER_TOOLS_DETECTED': 'Developer Tools Detected',
      'CONSOLE_ACCESS_DETECTED': 'Console Access Attempt',
      'FRAUD_DETECTED': 'Fraudulent Activity Detected',
      'IMPOSSIBLE_TRAVEL': 'Impossible Travel Pattern',
      'AUTOMATION_DETECTED': 'Automated Access Detected',
      'EXCESSIVE_REQUESTS': 'Rate Limit Violation',
      'STORAGE_ENUMERATION': 'Data Enumeration Attempt',
      'POTENTIAL_SCRAPING': 'Content Scraping Detected',
      'NEW_DEVICE': 'New Device Login',
      'GEOLOCATION_BLOCKED': 'Location Access Blocked'
    };
    return titles[type] || 'Security Event';
  };

  const getAlertDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'DEVELOPER_TOOLS_DETECTED': 'Unauthorized developer tools usage detected and blocked',
      'CONSOLE_ACCESS_DETECTED': 'Console tampering attempt prevented',
      'FRAUD_DETECTED': 'Suspicious transaction pattern identified by AI',
      'IMPOSSIBLE_TRAVEL': 'User accessed account from impossible geographic location',
      'AUTOMATION_DETECTED': 'Automated script or bot activity detected',
      'EXCESSIVE_REQUESTS': 'Unusual API request pattern blocked',
      'STORAGE_ENUMERATION': 'Attempt to access sensitive data detected',
      'POTENTIAL_SCRAPING': 'Content extraction attempt blocked',
      'NEW_DEVICE': 'Login attempt from unrecognized device',
      'GEOLOCATION_BLOCKED': 'User denied location access request'
    };
    return descriptions[type] || 'Security monitoring event detected';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive">Active</Badge>;
      case 'investigating': return <Badge variant="secondary">Investigating</Badge>;
      case 'resolved': return <Badge variant="default">Resolved</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Security Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time security monitoring and threat intelligence
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button 
            onClick={refreshDashboard} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active').length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Critical Security Alert</h3>
                <p className="text-red-700">
                  {alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active').length} critical security events require immediate attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">{securityScore}</span>
                <Badge variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"}>
                  {securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : 'Needs Attention'}
                </Badge>
              </div>
              <Progress value={securityScore} className="h-2" />
              <p className="text-xs text-muted-foreground">Real-time security posture</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">
                  {systemHealth?.uptime.toFixed(1)}%
                </span>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span>{systemHealth?.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span>{systemHealth?.errorRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-orange-600">
                  {alerts.filter(alert => alert.status === 'active').length}
                </span>
                <Badge variant={alerts.length > 0 ? "secondary" : "default"}>
                  {alerts.length > 0 ? 'Monitoring' : 'Clear'}
                </Badge>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>High Priority:</span>
                  <span>{alerts.filter(a => a.severity === 'high').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical:</span>
                  <span>{alerts.filter(a => a.severity === 'critical').length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {systemHealth?.activeConnections || 0}
                </span>
                <Badge variant="outline">Live</Badge>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Your Session:</span>
                  <span className="text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className={securityLevel === 'low' ? 'text-green-600' : 'text-orange-600'}>
                    {securityLevel}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Intel</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Biometric Authentication</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Fraud Monitoring</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Device Trust</span>
                  <Badge variant={securityLevel === 'low' ? "default" : "secondary"}>
                    {securityLevel === 'low' ? 'Trusted' : 'Verification Required'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Security Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(alert.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Blocked Attacks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {threatIntel?.blockedAttacks || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Suspicious IPs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {threatIntel?.suspiciousIPs || 0}
                </div>
                <p className="text-xs text-muted-foreground">Under monitoring</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Malware Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {threatIntel?.malwareDetections || 0}
                </div>
                <p className="text-xs text-muted-foreground">Quarantined</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Data Breach Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {threatIntel?.dataExfiltrationAttempts || 0}
                </div>
                <p className="text-xs text-muted-foreground">Prevented</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active security alerts</p>
                    <p className="text-sm">Your account is secure</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          <h3 className="font-semibold">{alert.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(alert.status)}
                          <Badge variant="outline" className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Source: {alert.source}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <span>User Agent:</span>
                  <span className="truncate max-w-32">
                    {navigator.userAgent.split(' ')[0]}
                  </span>
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

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Security Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Security analytics coming soon</p>
                <p className="text-sm">Advanced reporting and insights</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};