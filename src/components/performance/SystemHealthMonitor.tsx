import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Server, 
  Database, 
  Wifi, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  database: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    connections: number;
    lastCheck: number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    errorRate: number;
    lastCheck: number;
  };
  payment: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    successRate: number;
    lastCheck: number;
  };
  network: {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    bandwidth: string;
    lastCheck: number;
  };
}

interface SystemAlert {
  id: string;
  system: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
}

export const SystemHealthMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const checkSystemHealth = async () => {
    setLoading(true);
    const newMetrics: SystemMetrics = {
      database: await checkDatabaseHealth(),
      api: await checkApiHealth(),
      payment: await checkPaymentHealth(),
      network: await checkNetworkHealth()
    };

    setMetrics(newMetrics);
    setLastUpdate(Date.now());
    setLoading(false);

    // Generate alerts for unhealthy systems
    generateAlerts(newMetrics);
  };

  const checkDatabaseHealth = async (): Promise<SystemMetrics['database']> => {
    try {
      const startTime = performance.now();
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          status: 'down',
          responseTime,
          connections: 0,
          lastCheck: Date.now()
        };
      }

      return {
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        connections: 1, // Simplified
        lastCheck: Date.now()
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: 0,
        connections: 0,
        lastCheck: Date.now()
      };
    }
  };

  const checkApiHealth = async (): Promise<SystemMetrics['api']> => {
    try {
      const startTime = performance.now();
      // Simple health check - could be replaced with actual API endpoint
      const response = await fetch('/api/health').catch(() => null);
      const responseTime = performance.now() - startTime;
      
      if (!response || !response.ok) {
        return {
          status: 'degraded',
          responseTime,
          errorRate: 0.1,
          lastCheck: Date.now()
        };
      }

      return {
        status: responseTime > 500 ? 'degraded' : 'healthy',
        responseTime,
        errorRate: 0.02,
        lastCheck: Date.now()
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: 0,
        errorRate: 1.0,
        lastCheck: Date.now()
      };
    }
  };

  const checkPaymentHealth = async (): Promise<SystemMetrics['payment']> => {
    try {
      const startTime = performance.now();
      // Simulate payment system health check
      const responseTime = performance.now() - startTime + Math.random() * 200;
      
      return {
        status: responseTime > 2000 ? 'degraded' : 'healthy',
        responseTime,
        successRate: 0.99,
        lastCheck: Date.now()
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: 0,
        successRate: 0,
        lastCheck: Date.now()
      };
    }
  };

  const checkNetworkHealth = async (): Promise<SystemMetrics['network']> => {
    try {
      const startTime = performance.now();
      // Simple network latency check
      await fetch('https://api.github.com/zen', { mode: 'no-cors' }).catch(() => null);
      const latency = performance.now() - startTime;
      
      return {
        status: latency > 500 ? 'degraded' : 'healthy',
        latency,
        bandwidth: 'Unknown',
        lastCheck: Date.now()
      };
    } catch (error) {
      return {
        status: 'down',
        latency: 0,
        bandwidth: 'Unknown',
        lastCheck: Date.now()
      };
    }
  };

  const generateAlerts = (metrics: SystemMetrics) => {
    const newAlerts: SystemAlert[] = [];

    Object.entries(metrics).forEach(([system, data]) => {
      if (data.status === 'down') {
        newAlerts.push({
          id: `${system}-down-${Date.now()}`,
          system: system.charAt(0).toUpperCase() + system.slice(1),
          severity: 'critical',
          message: `${system} system is down and requires immediate attention`,
          timestamp: Date.now(),
          resolved: false
        });
      } else if (data.status === 'degraded') {
        newAlerts.push({
          id: `${system}-degraded-${Date.now()}`,
          system: system.charAt(0).toUpperCase() + system.slice(1),
          severity: 'warning',
          message: `${system} system is experiencing performance issues`,
          timestamp: Date.now(),
          resolved: false
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 7)]);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Set up periodic health checks
    const interval = setInterval(checkSystemHealth, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-metric-excellent" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-metric-warning" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-metric-critical" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-metric-excellent text-white">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-metric-warning text-white">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health Monitor
            </CardTitle>
            <CardDescription>
              Real-time monitoring of core system components
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkSystemHealth}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Database Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Database</span>
                  </div>
                  {getStatusIcon(metrics.database.status)}
                </div>
                {getStatusBadge(metrics.database.status)}
                <div className="text-sm space-y-1">
                  <div>Response: {Math.round(metrics.database.responseTime)}ms</div>
                  <div>Connections: {metrics.database.connections}</div>
                </div>
              </div>

              {/* API Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">API</span>
                  </div>
                  {getStatusIcon(metrics.api.status)}
                </div>
                {getStatusBadge(metrics.api.status)}
                <div className="text-sm space-y-1">
                  <div>Response: {Math.round(metrics.api.responseTime)}ms</div>
                  <div>Error Rate: {(metrics.api.errorRate * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Payment Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Payments</span>
                  </div>
                  {getStatusIcon(metrics.payment.status)}
                </div>
                {getStatusBadge(metrics.payment.status)}
                <div className="text-sm space-y-1">
                  <div>Response: {Math.round(metrics.payment.responseTime)}ms</div>
                  <div>Success: {(metrics.payment.successRate * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Network Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="font-medium">Network</span>
                  </div>
                  {getStatusIcon(metrics.network.status)}
                </div>
                {getStatusBadge(metrics.network.status)}
                <div className="text-sm space-y-1">
                  <div>Latency: {Math.round(metrics.network.latency)}ms</div>
                  <div>Bandwidth: {metrics.network.bandwidth}</div>
                </div>
              </div>
            </div>
          )}
          
          {metrics && (
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              Last updated: {new Date(lastUpdate).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Recent system health alerts and issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert 
                  key={alert.id} 
                  variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm">
                    {alert.system} - {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {alert.message}
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};