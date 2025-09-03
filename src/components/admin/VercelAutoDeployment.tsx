import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Rocket, 
  Clock, 
  GitBranch, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface AutoDeployConfig {
  enabled: boolean;
  branch: string;
  monitorInterval: number;
}

interface DeploymentStatus {
  id?: string;
  url?: string;
  readyState?: string;
  createdAt?: string;
  success: boolean;
  message: string;
}

export function VercelAutoDeployment() {
  const { toast } = useToast();
  const [config, setConfig] = useState<AutoDeployConfig>({
    enabled: false,
    branch: 'main',
    monitorInterval: 360, // 6 hours
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [isStartingMonitoring, setIsStartingMonitoring] = useState(false);
  const [lastDeployment, setLastDeployment] = useState<DeploymentStatus | null>(null);
  const [monitoringActive, setMonitoringActive] = useState(false);

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('vercel-auto-deploy-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setMonitoringActive(parsed.enabled);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
  }, []);

  const saveConfig = (newConfig: AutoDeployConfig) => {
    setConfig(newConfig);
    localStorage.setItem('vercel-auto-deploy-config', JSON.stringify(newConfig));
  };

  const triggerManualDeployment = async () => {
    setIsDeploying(true);
    try {
      const { data, error } = await supabase.functions.invoke('vercel-auto-deploy', {
        body: {
          action: 'deploy',
          config: { branch: config.branch }
        }
      });

      if (error) throw error;

      if (data.success) {
        setLastDeployment(data);
        toast({
          title: "Deployment Started",
          description: `Deployment ${data.deployment.id} triggered successfully`,
        });
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error: any) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to trigger deployment",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const toggleAutoDeployment = async () => {
    const newEnabled = !config.enabled;
    const newConfig = { ...config, enabled: newEnabled };
    
    if (newEnabled) {
      setIsStartingMonitoring(true);
      try {
        const { data, error } = await supabase.functions.invoke('vercel-auto-deploy', {
          body: {
            action: 'start-monitoring',
            config: newConfig
          }
        });

        if (error) throw error;

        if (data.success) {
          saveConfig(newConfig);
          setMonitoringActive(true);
          toast({
            title: "Auto-Deployment Enabled",
            description: `Monitoring started for ${config.branch} branch`,
          });
        } else {
          throw new Error(data.error || 'Failed to start monitoring');
        }
      } catch (error: any) {
        console.error('Monitoring error:', error);
        toast({
          title: "Failed to Enable Auto-Deployment",
          description: error.message || "Could not start monitoring",
          variant: "destructive",
        });
        return;
      } finally {
        setIsStartingMonitoring(false);
      }
    } else {
      saveConfig(newConfig);
      setMonitoringActive(false);
      toast({
        title: "Auto-Deployment Disabled",
        description: "Automatic monitoring stopped",
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case 'building':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Building</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto-Deployment Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Auto-Deployment
          </CardTitle>
          <CardDescription>
            Automatically deploy your application when changes are detected or on a schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-deploy">Enable Auto-Deployment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically trigger deployments every {config.monitorInterval} minutes
              </p>
            </div>
            <div className="flex items-center gap-2">
              {monitoringActive && (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              )}
              <Switch
                id="auto-deploy"
                checked={config.enabled}
                onCheckedChange={toggleAutoDeployment}
                disabled={isStartingMonitoring}
              />
              {isStartingMonitoring && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="branch"
                  value={config.branch}
                  onChange={(e) => saveConfig({ ...config, branch: e.target.value })}
                  placeholder="main"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Check Interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                min="60"
                max="1440"
                value={config.monitorInterval}
                onChange={(e) => saveConfig({ ...config, monitorInterval: parseInt(e.target.value) || 360 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Deployment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Manual Deployment
          </CardTitle>
          <CardDescription>
            Trigger an immediate deployment of your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={triggerManualDeployment}
            disabled={isDeploying}
            className="w-full"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy Now
              </>
            )}
          </Button>

          {lastDeployment && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Deployment</span>
                {lastDeployment.success && getStatusBadge(lastDeployment.readyState)}
              </div>
              
              {lastDeployment.success && lastDeployment.url && (
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  <a 
                    href={`https://${lastDeployment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lastDeployment.url}
                  </a>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {lastDeployment.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Required Environment Variables:</p>
              <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                <li><code>VERCEL_PROJECT_ID</code> - Your Vercel project ID</li>
                <li><code>VERCEL_TOKEN</code> - Your Vercel API token</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Auto-deployment will:</p>
              <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                <li>Check for new commits every {config.monitorInterval} minutes</li>
                <li>Deploy from the <code>{config.branch}</code> branch</li>
                <li>Send notifications on deployment status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}