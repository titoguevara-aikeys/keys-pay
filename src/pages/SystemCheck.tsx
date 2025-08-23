import React, { useEffect, useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Activity,
  Database,
  Shield,
  Cloud,
  CreditCard,
  Building2,
  Ban
} from 'lucide-react';
import { env } from '@/lib/env';

interface CheckResult {
  ok: boolean;
  latencyMs?: number;
  error?: string;
  message?: string;
  status?: number;
  featureEnabled?: boolean;
  disabled?: boolean;
  lastChecked?: Date;
  [key: string]: any;
}

interface Deployment {
  id: string;
  url: string;
  state: string;
  createdAt: string;
  creator: string;
}

const healthChecks = [
  { 
    key: 'app', 
    name: 'Application', 
    description: 'Basic app health and uptime',
    url: '/api/health',
    icon: Activity,
    critical: true
  },
  { 
    key: 'db', 
    name: 'Database', 
    description: 'Supabase database connectivity',
    url: '/api/health/db',
    icon: Database,
    critical: true
  },
  { 
    key: 'auth', 
    name: 'Authentication', 
    description: 'Supabase Auth service status',
    url: '/api/health/auth',
    icon: Shield,
    critical: true
  },
  { 
    key: 'vercel', 
    name: 'Vercel API', 
    description: 'Vercel deployment API access',
    url: '/api/vercel/health',
    icon: Cloud,
    critical: false
  },
  { 
    key: 'nium', 
    name: 'NIUM Provider', 
    description: 'NIUM sandbox API connectivity',
    url: '/api/nium/health',
    icon: CreditCard,
    critical: false
  },
  { 
    key: 'ramp', 
    name: 'Ramp Provider', 
    description: 'Ramp Network API connectivity',
    url: '/api/ramp/health',
    icon: CreditCard,
    critical: false
  },
  { 
    key: 'openpayd', 
    name: 'OpenPayd Provider', 
    description: 'OpenPayd API (Coming Soon)',
    url: '/api/openpayd/health',
    icon: Building2,
    critical: false
  },
];

export default function SystemCheck() {
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [lastFullCheck, setLastFullCheck] = useState<Date | null>(null);

  const runCheck = useCallback(async (check: typeof healthChecks[0]) => {
    setLoading(check.key);
    
    try {
      const response = await fetch(check.url, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      setResults(prev => ({ 
        ...prev, 
        [check.key]: { 
          ...data,
          status: response.status,
          lastChecked: new Date()
        }
      }));
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        [check.key]: { 
          ok: false,
          error: error.message,
          lastChecked: new Date()
        }
      }));
    } finally {
      setLoading(null);
    }
  }, []);

  const fetchDeployments = useCallback(async () => {
    try {
      const response = await fetch('/api/vercel/deployments', { 
        cache: 'no-store' 
      });
      
      if (response.ok) {
        const data = await response.json();
        setDeployments(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
    }
  }, []);

  const runAllChecks = useCallback(async () => {
    setLoading('all');
    
    await Promise.all([
      ...healthChecks.map(check => runCheck(check)),
      fetchDeployments()
    ]);
    
    setLastFullCheck(new Date());
    setLoading(null);
  }, [runCheck, fetchDeployments]);

  useEffect(() => {
    runAllChecks();
  }, [runAllChecks]);

  const getStatusBadge = (result: CheckResult | undefined) => {
    if (!result || result.ok === undefined) {
      return <Badge variant="outline">Checking...</Badge>;
    }
    
    if (result.disabled) {
      return <Badge variant="secondary" className="gap-1"><Ban className="h-3 w-3" />Disabled</Badge>;
    }
    
    if (result.featureEnabled === false) {
      return <Badge variant="outline" className="gap-1"><Ban className="h-3 w-3" />Feature Off</Badge>;
    }
    
    if (result.ok) {
      return <Badge variant="default" className="bg-green-100 text-green-700 gap-1">
        <CheckCircle className="h-3 w-3" />OK
      </Badge>;
    }
    
    if (result.status && result.status >= 400 && result.status < 500) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />WARN
      </Badge>;
    }
    
    return <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />FAIL
    </Badge>;
  };

  const formatLatency = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 100) return `${ms}ms`;
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getOverallStatus = () => {
    const criticalChecks = healthChecks.filter(c => c.critical);
    const criticalResults = criticalChecks.map(c => results[c.key]).filter(Boolean);
    
    if (criticalResults.length === 0) return 'checking';
    if (criticalResults.every(r => r.ok)) return 'healthy';
    if (criticalResults.some(r => r.ok === false)) return 'unhealthy';
    return 'degraded';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">System Health Check</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of all platform components and external services
            </p>
          </div>
          <div className="flex items-center gap-3">
            {env.APP_ENV === 'staging' && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Staging Environment
              </Badge>
            )}
            <Button
              onClick={runAllChecks}
              disabled={loading === 'all'}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading === 'all' ? 'animate-spin' : ''}`} />
              Run All Checks
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overall System Status</CardTitle>
                <CardDescription>
                  {lastFullCheck && `Last checked: ${lastFullCheck.toLocaleTimeString()}`}
                </CardDescription>
              </div>
              <div className="text-right">
                {overallStatus === 'healthy' && (
                  <Badge variant="default" className="bg-green-100 text-green-700 text-lg gap-2 px-4 py-2">
                    <CheckCircle className="h-5 w-5" />
                    All Systems Operational
                  </Badge>
                )}
                {overallStatus === 'degraded' && (
                  <Badge variant="secondary" className="text-lg gap-2 px-4 py-2">
                    <AlertTriangle className="h-5 w-5" />
                    Some Services Degraded
                  </Badge>
                )}
                {overallStatus === 'unhealthy' && (
                  <Badge variant="destructive" className="text-lg gap-2 px-4 py-2">
                    <XCircle className="h-5 w-5" />
                    Critical Issues Detected
                  </Badge>
                )}
                {overallStatus === 'checking' && (
                  <Badge variant="outline" className="text-lg gap-2 px-4 py-2">
                    <Clock className="h-5 w-5" />
                    Checking Status...
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Health Check Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {healthChecks.map(check => {
            const Icon = check.icon;
            const result = results[check.key];
            const isLoading = loading === check.key;
            
            return (
              <Card key={check.key} className={check.critical ? 'border-l-4 border-l-primary' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-base">{check.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {check.description}
                        </CardDescription>
                      </div>
                    </div>
                    {check.critical && (
                      <Badge variant="outline" className="text-xs">Critical</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      {getStatusBadge(result)}
                    </div>
                    
                    {result.latencyMs !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Latency</span>
                        <span className="text-sm font-mono">{formatLatency(result.latencyMs)}</span>
                      </div>
                    )}
                    
                    {result.lastChecked && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Checked</span>
                        <span className="text-xs text-muted-foreground">
                          {result.lastChecked.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    
                    {result.error && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {result.error}
                      </div>
                    )}
                    
                    {result.message && !result.error && (
                      <div className="text-xs text-muted-foreground">
                        {result.message}
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runCheck(check)}
                      disabled={isLoading}
                      className="w-full gap-2"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                      Recheck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Deployments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Recent Deployments
            </CardTitle>
            <CardDescription>
              Latest deployments from Vercel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deployments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deployment ID</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployments.map(deployment => (
                    <TableRow key={deployment.id}>
                      <TableCell className="font-mono text-xs">
                        {deployment.id.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {deployment.url}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={deployment.state === 'READY' ? 'default' : 'secondary'}
                          className={deployment.state === 'READY' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {deployment.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(deployment.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{deployment.creator}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://${deployment.url}`, '_blank')}
                          className="gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No deployment data available. Check Vercel API configuration.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}