import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TestTube, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Shield,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { PerformanceMonitor } from './PerformanceMonitor';
import { SystemHealthMonitor } from './SystemHealthMonitor';

interface BetaMetrics {
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  errorRate: number;
  performanceScore: number;
  featureAdoption: Record<string, number>;
  feedback: {
    positive: number;
    negative: number;
    suggestions: number;
  };
  systemHealth: {
    overall: 'healthy' | 'degraded' | 'critical';
    uptime: number;
    lastIncident: string | null;
  };
}

interface GoNoGoGate {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'pending';
  score: number;
  threshold: number;
  category: 'performance' | 'security' | 'quality' | 'user_experience';
  description: string;
  lastCheck: number;
}

export const BetaTestingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<BetaMetrics | null>(null);
  const [goNoGoGates, setGoNoGoGates] = useState<GoNoGoGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const initializeBetaMetrics = async () => {
    setLoading(true);
    
    // Simulate fetching real beta metrics
    const mockMetrics: BetaMetrics = {
      activeUsers: 147,
      totalSessions: 1284,
      averageSessionDuration: 18.5,
      errorRate: 0.003, // 0.3%
      performanceScore: 92,
      featureAdoption: {
        'Digital Wallet': 89,
        'Crypto Trading': 76,
        'Family Controls': 94,
        'AI Assistant': 67,
        'Card Management': 98,
        'Analytics': 58
      },
      feedback: {
        positive: 78,
        negative: 12,
        suggestions: 34
      },
      systemHealth: {
        overall: 'healthy',
        uptime: 99.94,
        lastIncident: null
      }
    };

    // Initialize Go/No-Go gates
    const gates: GoNoGoGate[] = [
      {
        id: 'performance-lcp',
        name: 'Largest Contentful Paint',
        status: 'pass',
        score: 2.1,
        threshold: 2.5,
        category: 'performance',
        description: 'Page load performance for largest content element',
        lastCheck: Date.now()
      },
      {
        id: 'security-vulnerabilities',
        name: 'Security Vulnerabilities',
        status: 'pass',
        score: 0,
        threshold: 0,
        category: 'security',
        description: 'Critical security vulnerabilities found',
        lastCheck: Date.now()
      },
      {
        id: 'test-coverage',
        name: 'Test Coverage',
        status: 'pass',
        score: 87,
        threshold: 80,
        category: 'quality',
        description: 'Automated test coverage percentage',
        lastCheck: Date.now()
      },
      {
        id: 'error-rate',
        name: 'Error Rate',
        status: 'pass',
        score: 0.3,
        threshold: 1.0,
        category: 'quality',
        description: 'Application error rate percentage',
        lastCheck: Date.now()
      },
      {
        id: 'user-satisfaction',
        name: 'User Satisfaction',
        status: 'pass',
        score: 4.6,
        threshold: 4.0,
        category: 'user_experience',
        description: 'Average user satisfaction rating',
        lastCheck: Date.now()
      },
      {
        id: 'api-response-time',
        name: 'API Response Time',
        status: 'fail',
        score: 1200,
        threshold: 500,
        category: 'performance',
        description: 'Average API response time in milliseconds',
        lastCheck: Date.now()
      }
    ];

    setMetrics(mockMetrics);
    setGoNoGoGates(gates);
    setLastUpdate(Date.now());
    setLoading(false);
  };

  useEffect(() => {
    initializeBetaMetrics();
    
    // Set up periodic updates
    const interval = setInterval(initializeBetaMetrics, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const getOverallGoNoGoStatus = () => {
    const failedGates = goNoGoGates.filter(gate => gate.status === 'fail');
    if (failedGates.length > 0) return 'fail';
    
    const pendingGates = goNoGoGates.filter(gate => gate.status === 'pending');
    if (pendingGates.length > 0) return 'pending';
    
    return 'pass';
  };

  const getCategoryIcon = (category: GoNoGoGate['category']) => {
    switch (category) {
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'quality':
        return <CheckCircle className="h-4 w-4" />;
      case 'user_experience':
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return 'text-metric-excellent';
      case 'fail':
        return 'text-metric-critical';
      case 'pending':
        return 'text-metric-warning';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Beta Testing Dashboard
          </CardTitle>
          <CardDescription>Loading beta metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Beta Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Keys Pay Beta Testing Dashboard
            </CardTitle>
            <CardDescription>
              Pre-launch monitoring and Go/No-Go gate status
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={initializeBetaMetrics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                <div className="text-xs text-muted-foreground">
                  {metrics.totalSessions} total sessions
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Performance Score</span>
                </div>
                <div className="text-2xl font-bold">{metrics.performanceScore}</div>
                <Progress value={metrics.performanceScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                <div className="text-2xl font-bold">{(metrics.errorRate * 100).toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">
                  Target: &lt; 1.0%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">System Health</span>
                </div>
                <Badge variant={metrics.systemHealth.overall === 'healthy' ? 'default' : 'destructive'}>
                  {metrics.systemHealth.overall}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {metrics.systemHealth.uptime}% uptime
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Go/No-Go Gates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pre-Launch Go/No-Go Gates
          </CardTitle>
          <CardDescription>
            Critical metrics that must pass before public launch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status:</span>
              <Badge 
                variant={getOverallGoNoGoStatus() === 'pass' ? 'default' : 'destructive'}
                className="text-lg px-4 py-1"
              >
                {getOverallGoNoGoStatus() === 'pass' ? 'GO' : 'NO-GO'}
              </Badge>
            </div>

            <div className="grid gap-4">
              {goNoGoGates.map((gate) => (
                <div 
                  key={gate.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(gate.category)}
                    <div>
                      <div className="font-medium">{gate.name}</div>
                      <div className="text-sm text-muted-foreground">{gate.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {gate.score} {gate.category === 'performance' && gate.id.includes('time') ? 'ms' : ''}
                        {gate.category === 'quality' && gate.id.includes('coverage') ? '%' : ''}
                        {gate.category === 'quality' && gate.id.includes('rate') ? '%' : ''}
                        {gate.category === 'user_experience' ? '/5' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {gate.id.includes('vulnerabilities') ? '= 0' : 
                               gate.id.includes('rate') ? `< ${gate.threshold}%` :
                               gate.id.includes('time') ? `< ${gate.threshold}ms` :
                               `> ${gate.threshold}${gate.category === 'quality' && gate.id.includes('coverage') ? '%' : gate.category === 'user_experience' ? '/5' : ''}`}
                      </div>
                    </div>
                    
                    <Badge 
                      variant={gate.status === 'pass' ? 'default' : gate.status === 'fail' ? 'destructive' : 'secondary'}
                      className={getStatusColor(gate.status)}
                    >
                      {gate.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance Monitor</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealthMonitor />
        </TabsContent>
      </Tabs>

      {/* Feature Adoption */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption Rates</CardTitle>
            <CardDescription>
              How beta users are engaging with different features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.featureAdoption).map(([feature, rate]) => (
                <div key={feature} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{feature}</span>
                    <span className="text-sm text-muted-foreground">{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};