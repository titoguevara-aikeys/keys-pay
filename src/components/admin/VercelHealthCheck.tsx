import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface VercelHealthStatus {
  health: {
    ok: boolean;
    projectId: string | null;
    message: string;
  };
  deployments: {
    ok: boolean;
    items?: any[];
    error?: string;
  };
  edgeFunction: {
    ok: boolean;
    message?: string;
    error?: string;
  };
}

export const VercelHealthCheck = () => {
  const [status, setStatus] = useState<VercelHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const performHealthCheck = async () => {
    setChecking(true);
    const results: VercelHealthStatus = {
      health: { ok: false, projectId: null, message: 'Not checked' },
      deployments: { ok: false },
      edgeFunction: { ok: false }
    };

    try {
      // Check Vercel API health
      console.log('Checking Vercel health...');
      const healthResponse = await fetch('/api/vercel/health');
      results.health = await healthResponse.json();
      console.log('Vercel health result:', results.health);

      // Check deployments if health is OK
      if (results.health.ok) {
        console.log('Checking Vercel deployments...');
        try {
          const deploymentsResponse = await fetch('/api/vercel/deployments');
          results.deployments = await deploymentsResponse.json();
          console.log('Vercel deployments result:', results.deployments);
        } catch (error) {
          results.deployments = { 
            ok: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      // Check Edge Function availability
      console.log('Checking Edge Function...');
      try {
        const edgeFunctionResponse = await fetch('/api/vercel/deploy', {
          method: 'GET'
        });
        const edgeResult = await edgeFunctionResponse.json();
        results.edgeFunction = {
          ok: edgeFunctionResponse.ok,
          message: edgeResult.message || 'Edge function available'
        };
        console.log('Edge function result:', results.edgeFunction);
      } catch (error) {
        results.edgeFunction = {
          ok: false,
          error: error instanceof Error ? error.message : 'Edge function unavailable'
        };
      }

    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to perform health check');
    }

    setStatus(results);
    setChecking(false);
  };

  useEffect(() => {
    const runInitialCheck = async () => {
      setLoading(true);
      await performHealthCheck();
      setLoading(false);
    };

    runInitialCheck();
  }, []);

  const getStatusIcon = (ok: boolean) => {
    if (ok) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (ok: boolean, label: string) => {
    if (ok) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          {label}
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Vercel Connection Status
          </CardTitle>
          <CardDescription>Checking Vercel integration health...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Vercel Health Check Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to check Vercel integration status</p>
          <Button onClick={performHealthCheck} className="mt-4">
            Retry Health Check
          </Button>
        </CardContent>
      </Card>
    );
  }

  const overallHealthy = status.health.ok && status.deployments.ok && status.edgeFunction.ok;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallHealthy)}
              Vercel Integration Status
            </CardTitle>
            <CardDescription>
              {overallHealthy 
                ? 'Vercel is fully connected and operational'
                : 'Issues detected with Vercel integration'
              }
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={performHealthCheck}
            disabled={checking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Check Again
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Vercel API Health */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.health.ok)}
              <div>
                <p className="font-medium">Vercel API Connection</p>
                <p className="text-sm text-muted-foreground">
                  {status.health.message}
                </p>
                {status.health.projectId && (
                  <p className="text-xs text-muted-foreground">
                    Project ID: {status.health.projectId}
                  </p>
                )}
              </div>
            </div>
            {getStatusBadge(status.health.ok, 'Connected')}
          </div>

          {/* Deployments Access */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.deployments.ok)}
              <div>
                <p className="font-medium">Deployments Access</p>
                <p className="text-sm text-muted-foreground">
                  {status.deployments.ok 
                    ? `Found ${status.deployments.items?.length || 0} deployments`
                    : status.deployments.error || 'Unable to access deployments'
                  }
                </p>
              </div>
            </div>
            {getStatusBadge(status.deployments.ok, 'Accessible')}
          </div>

          {/* Edge Function */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.edgeFunction.ok)}
              <div>
                <p className="font-medium">Auto-Deploy Function</p>
                <p className="text-sm text-muted-foreground">
                  {status.edgeFunction.message || status.edgeFunction.error || 'Status unknown'}
                </p>
              </div>
            </div>
            {getStatusBadge(status.edgeFunction.ok, 'Ready')}
          </div>
        </div>

        {/* Setup Instructions */}
        {!overallHealthy && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Setup Required</p>
                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                  {!status.health.ok && (
                    <p>• Configure VERCEL_PROJECT_ID and VERCEL_TOKEN environment variables</p>
                  )}
                  {!status.edgeFunction.ok && (
                    <p>• Deploy Supabase Edge Function for auto-deployments</p>
                  )}
                  <p>• Check the setup guide in docs/auto-deployment-setup.md</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Actions */}
        {overallHealthy && (
          <div className="mt-6 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://vercel.com/${status.health.projectId}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Vercel Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Vercel integration is fully operational!')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              All Systems Go
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};