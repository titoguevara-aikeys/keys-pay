import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Eye, Zap, Users, Globe, Lock, Activity,
  TrendingUp, BarChart3, Clock, Bell, Settings, RefreshCw, 
  Download, Upload, Search, Filter, ChevronDown, ChevronRight,
  Phone, Mail, MessageSquare, FileText, Target, Brain, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SecurityIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  category: string;
  description: string;
  timestamp: string;
  affectedSystems: string[];
  assignee: string;
  estimatedImpact: string;
  actionsTaken: string[];
}

interface ThreatIntelFeed {
  id: string;
  source: string;
  threatType: string;
  severity: string;
  description: string;
  indicators: string[];
  timestamp: string;
  confidence: number;
}

interface SecurityMetrics {
  totalIncidents: number;
  activeThreats: number;
  blockedAttacks: number;
  riskScore: number;
  complianceScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const SecurityCenterDashboard = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [threatFeeds, setThreatFeeds] = useState<ThreatIntelFeed[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);

  useEffect(() => {
    loadSecurityData();
    if (autoRefresh) {
      const interval = setInterval(loadSecurityData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadSecurityData = async () => {
    try {
      // Load security incidents
      const mockIncidents: SecurityIncident[] = [
        {
          id: 'INC-001',
          title: 'Suspicious Login Attempts from Unknown IP',
          severity: 'high',
          status: 'investigating',
          category: 'Authentication',
          description: 'Multiple failed login attempts detected from IP 192.168.1.100',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          affectedSystems: ['Authentication Service', 'User Management'],
          assignee: 'Security Team',
          estimatedImpact: 'Potential account compromise',
          actionsTaken: ['IP blocked', 'User notified', 'Enhanced monitoring enabled']
        },
        {
          id: 'INC-002',
          title: 'Unusual API Access Pattern Detected',
          severity: 'medium',
          status: 'open',
          category: 'Data Access',
          description: 'Abnormal API usage pattern suggesting potential data scraping',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          affectedSystems: ['API Gateway', 'Data Layer'],
          assignee: 'DevSecOps Team',
          estimatedImpact: 'Data exposure risk',
          actionsTaken: ['Rate limiting applied', 'Monitoring increased']
        },
        {
          id: 'INC-003',
          title: 'Critical Vulnerability in Payment Processing',
          severity: 'critical',
          status: 'contained',
          category: 'Vulnerability',
          description: 'SQL injection vulnerability discovered in payment gateway',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          affectedSystems: ['Payment Gateway', 'Transaction Processing'],
          assignee: 'Security Team',
          estimatedImpact: 'Financial data at risk',
          actionsTaken: ['Service isolated', 'Patch deployed', 'Security review initiated']
        }
      ];

      const mockThreatFeeds: ThreatIntelFeed[] = [
        {
          id: 'TI-001',
          source: 'Cybersecurity Intelligence',
          threatType: 'Malware',
          severity: 'high',
          description: 'New banking trojan targeting financial institutions',
          indicators: ['hash:a1b2c3d4e5f6', 'domain:malicious-bank.com'],
          timestamp: new Date().toISOString(),
          confidence: 95
        },
        {
          id: 'TI-002',
          source: 'Threat Hunter Team',
          threatType: 'Phishing',
          severity: 'medium',
          description: 'Phishing campaign mimicking financial services',
          indicators: ['domain:fake-bank.net', 'email:noreply@fake-bank.net'],
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          confidence: 88
        }
      ];

      const mockMetrics: SecurityMetrics = {
        totalIncidents: 15,
        activeThreats: 3,
        blockedAttacks: 247,
        riskScore: 75,
        complianceScore: 94,
        vulnerabilities: {
          critical: 0,
          high: 2,
          medium: 8,
          low: 15
        }
      };

      setIncidents(mockIncidents);
      setThreatFeeds(mockThreatFeeds);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  };

  const handleIncidentStatusChange = (incidentId: string, newStatus: SecurityIncident['status']) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, status: newStatus } : inc
    ));
    toast.success(`Incident ${incidentId} status updated to ${newStatus}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contained': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Security Center
          </h1>
          <p className="text-muted-foreground">
            Advanced threat detection, incident response, and security analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm">Auto-refresh</span>
          </div>
          <Button variant="outline" onClick={loadSecurityData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{metrics?.riskScore}/100</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={metrics?.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold">{incidents.filter(i => i.status !== 'resolved').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="destructive" className="mr-2">
                {incidents.filter(i => i.severity === 'critical').length} Critical
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blocked Attacks</p>
                <p className="text-2xl font-bold">{metrics?.blockedAttacks}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{metrics?.complianceScore}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={metrics?.complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vulnerabilities</p>
                <p className="text-2xl font-bold">
                  {(metrics?.vulnerabilities.critical || 0) + (metrics?.vulnerabilities.high || 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Critical + High</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="incidents">Incident Response</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Security Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-6">
          {/* Incident Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Incidents</CardTitle>
                  <CardDescription>
                    Monitor, investigate, and respond to security incidents
                  </CardDescription>
                </div>
                <Button onClick={() => setShowIncidentDialog(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Create Incident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters and Search */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search incidents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Incidents List */}
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <Card key={incident.id} className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => setSelectedIncident(incident)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {incident.id}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-1">{incident.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {incident.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Category: {incident.category}</span>
                            <span>Assignee: {incident.assignee}</span>
                            <span>
                              Created: {new Date(incident.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={incident.status}
                            onValueChange={(value) => 
                              handleIncidentStatusChange(incident.id, value as SecurityIncident['status'])
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="investigating">Investigating</SelectItem>
                              <SelectItem value="contained">Contained</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Intelligence Feeds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Threat Intelligence Feeds
                </CardTitle>
                <CardDescription>
                  Real-time threat intelligence from multiple sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatFeeds.map((feed) => (
                    <div key={feed.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{feed.source}</Badge>
                          <Badge className={getSeverityColor(feed.severity)}>
                            {feed.severity}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Confidence: {feed.confidence}%
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{feed.threatType}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feed.description}
                      </p>
                      <div className="space-y-1">
                        <span className="text-xs font-medium">Indicators:</span>
                        {feed.indicators.map((indicator, index) => (
                          <Badge key={index} variant="outline" className="mr-1 text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threat Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Global Threat Landscape
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">847</div>
                      <div className="text-sm text-muted-foreground">Active Campaigns</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">23</div>
                      <div className="text-sm text-muted-foreground">New Malware Families</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">156</div>
                      <div className="text-sm text-muted-foreground">CVEs This Week</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-muted-foreground">Detection Rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Top Threat Categories</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Phishing</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-xs">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Malware</span>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="w-20" />
                          <span className="text-xs">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ransomware</span>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-20" />
                          <span className="text-xs">45%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Real-time Monitoring Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '14:32:15', event: 'Login attempt blocked', severity: 'medium', ip: '192.168.1.100' },
                    { time: '14:31:08', event: 'API rate limit triggered', severity: 'low', ip: '10.0.0.50' },
                    { time: '14:30:45', event: 'Suspicious file upload detected', severity: 'high', ip: '203.45.67.89' },
                    { time: '14:29:22', event: 'Two-factor authentication bypassed', severity: 'critical', ip: '172.16.0.25' },
                    { time: '14:28:11', event: 'Database query anomaly', severity: 'medium', ip: '10.0.1.100' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <div>
                          <span className="font-medium">{event.event}</span>
                          <div className="text-xs text-muted-foreground">
                            IP: {event.ip}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Slack Integration</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Response</span>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Threshold</label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low and above</SelectItem>
                        <SelectItem value="medium">Medium and above</SelectItem>
                        <SelectItem value="high">High and above</SelectItem>
                        <SelectItem value="critical">Critical only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Security Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg">
                  <p className="text-muted-foreground">Security trends chart placeholder</p>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Management */}
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Vulnerabilities</span>
                    <Badge variant="destructive">{metrics?.vulnerabilities.critical || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Vulnerabilities</span>
                    <Badge className="bg-orange-500">{metrics?.vulnerabilities.high || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Vulnerabilities</span>
                    <Badge className="bg-yellow-500">{metrics?.vulnerabilities.medium || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Vulnerabilities</span>
                    <Badge variant="secondary">{metrics?.vulnerabilities.low || 0}</Badge>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Vulnerability Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>
                  Current compliance posture across frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { framework: 'PCI DSS', score: 98, status: 'Compliant' },
                    { framework: 'SOX', score: 96, status: 'Compliant' },
                    { framework: 'GDPR', score: 94, status: 'Compliant' },
                    { framework: 'ISO 27001', score: 87, status: 'Minor Issues' },
                    { framework: 'NIST', score: 92, status: 'Compliant' }
                  ].map((item) => (
                    <div key={item.framework} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{item.framework}</span>
                        <div className="text-sm text-muted-foreground">{item.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.score} className="w-20" />
                        <span className="text-sm font-medium">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Security policy updated', user: 'admin@aikeys.ai', time: '2 hours ago' },
                    { action: 'Access control review completed', user: 'security@aikeys.ai', time: '1 day ago' },
                    { action: 'Vulnerability scan executed', user: 'system', time: '2 days ago' },
                    { action: 'Compliance report generated', user: 'compliance@aikeys.ai', time: '3 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 mt-1" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{activity.action}</span>
                        <div className="text-xs text-muted-foreground">
                          By {activity.user} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>
                  Configure global security policies and rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Password Complexity</span>
                      <div className="text-xs text-muted-foreground">Enforce strong passwords</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Session Timeout</span>
                      <div className="text-xs text-muted-foreground">Auto-logout after inactivity</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">IP Allowlisting</span>
                      <div className="text-xs text-muted-foreground">Restrict access by IP</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Device Registration</span>
                      <div className="text-xs text-muted-foreground">Require device approval</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Response */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Response</CardTitle>
                <CardDescription>
                  Configure incident response procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <Input placeholder="security@aikeys.ai" className="mt-1" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Escalation Threshold</label>
                    <Select defaultValue="high">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medium">Medium severity</SelectItem>
                        <SelectItem value="high">High severity</SelectItem>
                        <SelectItem value="critical">Critical only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Auto-Response Actions</label>
                    <Textarea 
                      placeholder="Define automated response procedures..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Emergency Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Incident Detail Dialog */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedIncident.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getSeverityColor(selectedIncident.severity)}>
                      {selectedIncident.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(selectedIncident.status)}>
                      {selectedIncident.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedIncident.id}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedIncident(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Affected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedSystems.map((system, index) => (
                      <Badge key={index} variant="outline">{system}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Actions Taken</h3>
                  <ul className="space-y-1">
                    {selectedIncident.actionsTaken.map((action, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Assignee:</span>
                    <p className="text-muted-foreground">{selectedIncident.assignee}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-muted-foreground">
                      {new Date(selectedIncident.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};