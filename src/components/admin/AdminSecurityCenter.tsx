import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Ban, 
  Clock, 
  Lock, 
  Key, 
  Activity,
  TrendingUp,
  Globe,
  Smartphone,
  MonitorSpeaker
} from 'lucide-react';

export const AdminSecurityCenter = () => {
  const [fraudDetection, setFraudDetection] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
  const [ipBlocking, setIpBlocking] = useState(true);

  // Mock security events
  const securityEvents = [
    {
      id: 1,
      type: 'Suspicious Login',
      user: 'john.doe@example.com',
      details: 'Login from unusual location (Russia)',
      severity: 'high',
      timestamp: '2024-01-20 14:30:22',
      status: 'investigating',
      ipAddress: '185.220.101.123'
    },
    {
      id: 2,
      type: 'Multiple Failed Logins',
      user: 'jane.smith@example.com',
      details: '5 failed login attempts in 2 minutes',
      severity: 'medium',
      timestamp: '2024-01-20 14:25:18',
      status: 'resolved',
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      type: 'Large Transaction',
      user: 'mike.johnson@example.com',
      details: 'Transaction amount $50,000 exceeds daily limit',
      severity: 'medium',
      timestamp: '2024-01-20 14:20:45',
      status: 'approved',
      ipAddress: '203.0.113.45'
    },
    {
      id: 4,
      type: 'Device Fingerprint Mismatch',
      user: 'sarah.wilson@example.com',
      details: 'New device detected for existing user',
      severity: 'low',
      timestamp: '2024-01-20 14:15:32',
      status: 'pending',
      ipAddress: '198.51.100.78'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      case 'investigating':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Investigating</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked IPs</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Ban className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2FA Enabled</p>
                <p className="text-2xl font-bold">8,947</p>
                <p className="text-xs text-muted-foreground">68% of users</p>
              </div>
              <Key className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure system-wide security parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Fraud Detection</p>
                <p className="text-sm text-muted-foreground">AI-powered transaction monitoring</p>
              </div>
              <Switch 
                checked={fraudDetection} 
                onCheckedChange={setFraudDetection}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Monitoring</p>
                <p className="text-sm text-muted-foreground">Live security event tracking</p>
              </div>
              <Switch 
                checked={realTimeMonitoring} 
                onCheckedChange={setRealTimeMonitoring}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic IP Blocking</p>
                <p className="text-sm text-muted-foreground">Block suspicious IP addresses</p>
              </div>
              <Switch 
                checked={ipBlocking} 
                onCheckedChange={setIpBlocking}
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Security Thresholds</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Login Attempts</span>
                  <Badge variant="outline">5 attempts</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Large Transaction Alert</span>
                  <Badge variant="outline">$10,000</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Timeout</span>
                  <Badge variant="outline">30 minutes</Badge>
                </div>
              </div>
            </div>

            <Button className="w-full">Update Security Settings</Button>
          </CardContent>
        </Card>

        {/* Device Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Device & Location Analytics</CardTitle>
            <CardDescription>Security insights from user devices and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Geographic Anomalies</p>
                    <p className="text-sm text-muted-foreground">Unusual login locations</p>
                  </div>
                </div>
                <Badge variant="destructive">12</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Mobile Devices</p>
                    <p className="text-sm text-muted-foreground">Trusted mobile devices</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">6,847</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <MonitorSpeaker className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Desktop Sessions</p>
                    <p className="text-sm text-muted-foreground">Active desktop users</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">4,123</Badge>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-3">Risk Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Risk Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Risk Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-3 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Risk Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-1 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>Recent security alerts and incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      {event.type}
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    {event.user}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {event.details}
                  </TableCell>
                  
                  <TableCell>
                    {getSeverityBadge(event.severity)}
                  </TableCell>
                  
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {event.ipAddress}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(event.status)}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {event.timestamp}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Ban className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};