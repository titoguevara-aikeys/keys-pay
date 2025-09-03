import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink,
  RefreshCw,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Zap,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  url: string;
  state: string;
  createdAt: string;
  creator: string;
}

interface VercelHealthResponse {
  ok: boolean;
  projectId: string | null;
  message: string;
}

export const VercelDeploymentManager = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [healthStatus, setHealthStatus] = useState<VercelHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVercelHealth = async () => {
    try {
      const response = await fetch('/api/vercel/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Error fetching Vercel health:', error);
      setHealthStatus({
        ok: false,
        projectId: null,
        message: 'Failed to connect to Vercel API'
      });
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/vercel/deployments');
      const data = await response.json();
      
      if (data.ok) {
        setDeployments(data.items || []);
      } else {
        console.error('Error fetching deployments:', data.error);
        toast.error('Failed to fetch deployments');
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
      toast.error('Failed to connect to Vercel API');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchVercelHealth(), fetchDeployments()]);
    setRefreshing(false);
    toast.success('Deployment data refreshed');
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchVercelHealth(), fetchDeployments()]);
      setLoading(false);
    };

    initializeData();
  }, []);

  const getStatusBadge = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'ready':
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case 'building':
      case 'queued':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Building
          </Badge>
        );
      case 'error':
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {state || 'Unknown'}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Vercel Deployment Manager
            </CardTitle>
            <CardDescription>Loading deployment information...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vercel Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <CardTitle>Vercel Integration Status</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>Vercel API connectivity and project status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                healthStatus?.ok ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">
                  {healthStatus?.ok ? 'Connected' : 'Connection Failed'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {healthStatus?.message || 'Status unknown'}
                </p>
                {healthStatus?.projectId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Project ID: {healthStatus.projectId}
                  </p>
                )}
              </div>
            </div>
            {healthStatus?.ok ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Operational
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment List */}
      {healthStatus?.ok && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Recent Deployments
            </CardTitle>
            <CardDescription>Latest deployments from Vercel</CardDescription>
          </CardHeader>
          <CardContent>
            {deployments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No deployments found
              </div>
            ) : (
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{deployment.url}</p>
                          {deployment.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(`https://${deployment.url}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Deployed by {deployment.creator} • {formatDate(deployment.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(deployment.createdAt)} • ID: {deployment.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(deployment.state)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {deployments.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Showing {deployments.length} recent deployments
                  </span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Vercel Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deployment Actions */}
      {healthStatus?.ok && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Deployment Actions
            </CardTitle>
            <CardDescription>Manage your Vercel deployments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => toast.info('Feature coming soon')}
              >
                <Zap className="h-5 w-5" />
                <span className="text-sm">Trigger Deploy</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => toast.info('Feature coming soon')}
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm">View Domains</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-2 h-20"
                onClick={() => toast.info('Feature coming soon')}
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm">Configure</span>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Deployment Configuration</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Make sure your Vercel environment variables (VERCEL_PROJECT_ID, VERCEL_TOKEN) are properly configured 
                    for full deployment management capabilities.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};