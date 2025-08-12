import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  tti: number;
  timestamp: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Performance thresholds based on Web Vitals
  const thresholds = {
    lcp: { good: 2500, poor: 4000 }, // Largest Contentful Paint
    fid: { good: 100, poor: 300 },   // First Input Delay
    cls: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
    ttfb: { good: 800, poor: 1800 }, // Time to First Byte
    fcp: { good: 1800, poor: 3000 }, // First Contentful Paint
    tti: { good: 3800, poor: 7300 }  // Time to Interactive
  };

  useEffect(() => {
    // Initialize performance monitoring
    const initPerformanceMonitoring = async () => {
      try {
        // Get Web Vitals
        const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        const currentMetrics: Partial<PerformanceMetrics> = {
          timestamp: Date.now()
        };

        onLCP((metric) => {
          currentMetrics.lcp = metric.value;
          checkThreshold('lcp', metric.value);
        });

        onFID((metric) => {
          currentMetrics.fid = metric.value;
          checkThreshold('fid', metric.value);
        });

        onCLS((metric) => {
          currentMetrics.cls = metric.value;
          checkThreshold('cls', metric.value);
        });

        onFCP((metric) => {
          currentMetrics.fcp = metric.value;
          checkThreshold('fcp', metric.value);
        });

        onTTFB((metric) => {
          currentMetrics.ttfb = metric.value;
          checkThreshold('ttfb', metric.value);
        });

        // Calculate TTI (approximation)
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              currentMetrics.tti = navEntry.domInteractive;
              checkThreshold('tti', navEntry.domInteractive);
            }
          }
        });
        observer.observe({ entryTypes: ['navigation'] });

        // Update metrics after a delay to ensure all are captured
        setTimeout(() => {
          setMetrics(currentMetrics as PerformanceMetrics);
          setLoading(false);
        }, 3000);

      } catch (error) {
        console.error('Failed to initialize performance monitoring:', error);
        setLoading(false);
      }
    };

    initPerformanceMonitoring();
  }, []);

  const checkThreshold = (metric: string, value: number) => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return;

    let alertType: 'warning' | 'critical' | 'info' = 'info';
    
    if (value > threshold.poor) {
      alertType = 'critical';
    } else if (value > threshold.good) {
      alertType = 'warning';
    }

    if (alertType !== 'info') {
      const alert: PerformanceAlert = {
        id: `${metric}-${Date.now()}`,
        type: alertType,
        metric: metric.toUpperCase(),
        value,
        threshold: alertType === 'critical' ? threshold.poor : threshold.good,
        timestamp: Date.now(),
        resolved: false
      };

      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    }
  };

  const getScoreColor = (metric: string, value: number) => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'hsl(var(--muted))';
    
    if (value <= threshold.good) return 'hsl(var(--metric-excellent))';
    if (value <= threshold.poor) return 'hsl(var(--metric-warning))';
    return 'hsl(var(--metric-critical))';
  };

  const getScorePercentage = (metric: string, value: number) => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 0;
    
    const maxValue = threshold.poor * 1.5;
    return Math.max(0, Math.min(100, 100 - (value / maxValue) * 100));
  };

  const formatMetricValue = (metric: string, value: number) => {
    if (metric === 'cls') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <CardDescription>Collecting performance metrics...</CardDescription>
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
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Performance Metrics
          </CardTitle>
          <CardDescription>
            Core Web Vitals and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(metrics).map(([key, value]) => {
                if (key === 'timestamp') return null;
                
                const score = getScorePercentage(key, value);
                const color = getScoreColor(key, value);
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase">{key}</span>
                      <Badge variant={score > 75 ? 'default' : score > 50 ? 'secondary' : 'destructive'}>
                        {formatMetricValue(key, value)}
                      </Badge>
                    </div>
                    <Progress 
                      value={score} 
                      className="h-2"
                      style={{ 
                        '--progress-background': color 
                      } as React.CSSProperties}
                    />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {score > 75 ? (
                        <CheckCircle className="h-3 w-3 text-metric-excellent" />
                      ) : score > 50 ? (
                        <TrendingUp className="h-3 w-3 text-metric-warning" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-metric-critical" />
                      )}
                      Score: {Math.round(score)}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Performance Alerts
            </CardTitle>
            <CardDescription>
              Recent performance threshold violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert 
                  key={alert.id} 
                  variant={alert.type === 'critical' ? 'destructive' : 'default'}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm">
                    {alert.metric} Threshold Exceeded
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    Value: {formatMetricValue(alert.metric.toLowerCase(), alert.value)} 
                    (Threshold: {formatMetricValue(alert.metric.toLowerCase(), alert.threshold)})
                    <br />
                    <span className="text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
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