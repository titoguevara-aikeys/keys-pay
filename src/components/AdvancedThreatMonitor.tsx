import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Lock, Eye, Activity, Zap,
  TrendingUp, BarChart3, RefreshCw, Settings, Bell, Clock,
  Globe, Smartphone, Wifi, Users, CheckCircle, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  blocked: boolean;
  source: string;
  location: string;
}

interface ThreatMetrics {
  blockedThreats: number;
  suspiciousIPs: number;
  malwareDetections: number;
  phishingAttempts: number;
  vulnerabilities: number;
}

export const AdvancedThreatMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<ThreatMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoResponse, setAutoResponse] = useState(true);

  useEffect(() => {
    loadSecurityEvents();
    loadThreatMetrics();
    
    if (isMonitoring) {
      const interval = setInterval(() => {
        loadSecurityEvents();
        loadThreatMetrics();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const loadSecurityEvents = () => {
    // Simulate real-time security events
    const newEvents: SecurityEvent[] = [
      {
        id: 'EVT-001',
        type: 'SUSPICIOUS_LOGIN',
        severity: 'high',
        timestamp: new Date().toISOString(),
        description: 'Multiple failed login attempts from unknown IP',
        blocked: true,
        source: '192.168.1.100',
        location: 'Unknown Location'
      },
      {
        id: 'EVT-002',
        type: 'MALWARE_DETECTED',
        severity: 'critical',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: 'Malicious file upload attempt blocked',
        blocked: true,
        source: '10.0.0.50',
        location: 'File Upload Service'
      },
      {
        id: 'EVT-003',
        type: 'API_ABUSE',
        severity: 'medium',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        description: 'Unusual API access pattern detected',
        blocked: false,
        source: '203.45.67.89',
        location: 'API Gateway'
      }
    ];
    
    setEvents(newEvents);
  };

  const loadThreatMetrics = () => {
    const newMetrics: ThreatMetrics = {
      blockedThreats: Math.floor(Math.random() * 50) + 200,
      suspiciousIPs: Math.floor(Math.random() * 20) + 15,
      malwareDetections: Math.floor(Math.random() * 10) + 5,
      phishingAttempts: Math.floor(Math.random() * 30) + 25,
      vulnerabilities: Math.floor(Math.random() * 5) + 2
    };
    
    setMetrics(newMetrics);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleBlockThreat = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, blocked: true } : event
    ));
    toast.success('Threat blocked successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Threat Monitor</h2>
          <p className="text-muted-foreground">
            Real-time threat detection and automated response system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch 
              checked={isMonitoring} 
              onCheckedChange={setIsMonitoring}
            />
            <span className="text-sm">Active Monitoring</span>
          </div>
          <Button variant="outline" onClick={loadSecurityEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Threat Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blocked Threats</p>
                <p className="text-2xl font-bold text-green-600">{metrics?.blockedThreats}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suspicious IPs</p>
                <p className="text-2xl font-bold text-orange-600">{metrics?.suspiciousIPs}</p>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Under investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Malware Detected</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.malwareDetections}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Quarantined</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phishing Attempts</p>
                <p className="text-2xl font-bold text-purple-600">{metrics?.phishingAttempts}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Blocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vulnerabilities</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics?.vulnerabilities}</p>
              </div>
              <Lock className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">To patch</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Threat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Threat Feed
              {isMonitoring && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </CardTitle>
            <CardDescription>
              Real-time security events and automated responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.type.replace('_', ' ')}</span>
                        {event.blocked ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Source: {event.source}</span>
                        <span>Location: {event.location}</span>
                        <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  {!event.blocked && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleBlockThreat(event.id)}
                    >
                      Block
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Response Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Real-time Alerts</span>
                  <div className="text-xs text-muted-foreground">Instant notifications</div>
                </div>
                <Switch 
                  checked={alertsEnabled} 
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Auto-Response</span>
                  <div className="text-xs text-muted-foreground">Automatic threat blocking</div>
                </div>
                <Switch 
                  checked={autoResponse} 
                  onCheckedChange={setAutoResponse}
                />
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Response Rules</span>
                <div className="space-y-2">
                  <div className="text-xs p-2 bg-muted rounded">
                    • Block IPs with 5+ failed logins
                  </div>
                  <div className="text-xs p-2 bg-muted rounded">
                    • Quarantine suspicious files
                  </div>
                  <div className="text-xs p-2 bg-muted rounded">
                    • Rate limit unusual API patterns
                  </div>
                </div>
              </div>
              
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Threat Intelligence Summary
          </CardTitle>
          <CardDescription>
            Latest threat landscape and security insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Top Attack Vectors</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credential Stuffing</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Malware Injection</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Abuse</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Geographic Threats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Eastern Europe</span>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Southeast Asia</span>
                  <Badge className="bg-orange-500">Medium</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>North America</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Recent IOCs</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-muted rounded">
                  <span className="font-mono">192.168.1.100</span>
                  <div className="text-muted-foreground">Brute force attempts</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <span className="font-mono">malicious-domain.com</span>
                  <div className="text-muted-foreground">Phishing campaign</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <span className="font-mono">a1b2c3d4e5f6</span>
                  <div className="text-muted-foreground">Malware hash</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};