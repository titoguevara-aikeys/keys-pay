import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Users, Zap, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VercelDeploymentManager } from './VercelDeploymentManager';

interface MonitoringData {
  ttfb: number;
  lcp: number;
  apiErrorRate: number;
  currentUsers: number;
  requestsPerSecond: number;
  uptime: number;
  mode: 'NORMAL' | 'DEGRADED' | 'KILL';
  timestamp: string;
}

const MonitoringDashboard: React.FC = () => {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  const fetchMonitoringData = async (action: string = 'monitor') => {
    setLoading(true);
    try {
      const response = await fetch(`/functions/v1/aikeys-monitor?action=${action}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch monitoring data');
      
      const result = await response.json();
      setData(result.data);
      setLastUpdate(new Date().toLocaleString());
      
      toast({
        title: "Dashboard Updated",
        description: `Status: ${result.data.mode} | Last updated: ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch monitoring data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    await fetchMonitoringData('force');
    toast({
      title: "Force Refresh Sent",
      description: "Emergency alerts sent to both engineering and executive teams",
    });
  };

  const triggerResolve = async () => {
    await fetchMonitoringData('resolve');
    toast({
      title: "Resolve Alert Triggered",
      description: "Recovery notification sent to executive team",
    });
  };

  useEffect(() => {
    fetchMonitoringData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchMonitoringData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'NORMAL': return 'bg-green-500';
      case 'DEGRADED': return 'bg-yellow-500';
      case 'KILL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'NORMAL': return <CheckCircle className="h-4 w-4" />;
      case 'DEGRADED': return <AlertTriangle className="h-4 w-4" />;
      case 'KILL': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (value: number, warning: number, critical: number) => {
    if (value > critical) return 'text-red-500';
    if (value > warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AIKeys Platform Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring with automated alerts and self-healing
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchMonitoringData()} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={forceRefresh}
            variant="secondary"
          >
            <Zap className="h-4 w-4 mr-2" />
            Force Alert
          </Button>
          {data.mode !== 'NORMAL' && (
            <Button 
              onClick={triggerResolve}
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Send Resolve
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Platform Status
          </CardTitle>
          <CardDescription>Current operational status and key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge className={`${getModeColor(data.mode)} text-white`}>
                {getModeIcon(data.mode)}
                <span className="ml-1">{data.mode}</span>
              </Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdate}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{data.uptime}%</div>
              <div className="text-sm text-muted-foreground">Uptime (24h)</div>
            </div>
          </div>

          {data.mode !== 'NORMAL' && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {data.mode === 'KILL' 
                  ? '🚨 CRITICAL: Platform in emergency kill mode - immediate action required!'
                  : '⚠️ WARNING: Platform experiencing performance degradation - monitoring closely'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTFB</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(data.ttfb, 1000, 3000)}`}>
              {data.ttfb}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Time to First Byte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LCP</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(data.lcp, 2500, 4000)}`}>
              {data.lcp}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Largest Contentful Paint
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(data.apiErrorRate, 5, 10)}`}>
              {data.apiErrorRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              API Error Rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.requestsPerSecond} req/sec
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Current thresholds and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Warning Thresholds</h4>
              <div className="text-sm space-y-1">
                <div>TTFB: 1000ms</div>
                <div>LCP: 2500ms</div>
                <div>Error Rate: 5%</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Critical Thresholds</h4>
              <div className="text-sm space-y-1">
                <div>TTFB: 3000ms</div>
                <div>LCP: 4000ms</div>
                <div>Error Rate: 10%</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Alert Recipients</h4>
              <div className="text-sm space-y-1">
                <div>Engineering: tito.guevara@aikeys.ai</div>
                <div>Executive: tito.guevara@gmail.com</div>
                <div>Frequency: 5min monitoring, hourly reports</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vercel Deployment Management */}
      <div className="space-y-4">
        <Separator />
        <h3 className="text-xl font-semibold">Deployment Management</h3>
        <VercelDeploymentManager />
      </div>
    </div>
  );
};

export default MonitoringDashboard;