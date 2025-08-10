import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Zap,
  Shield,
  Database,
  Lock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface FlagsResponse {
  flags: {
    beta_monitoring: 'on' | 'off';
  };
  force_full_monitoring: boolean;
  store: string;
}

export const BetaPerformanceOptimizer = () => {
  const [flagsData, setFlagsData] = useState<FlagsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBetaEnabled = flagsData?.flags.beta_monitoring === 'on';
  const isForceDisabled = flagsData?.force_full_monitoring === true;

  const fetchFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with proper RBAC authentication
      const adminSecret = import.meta.env.VITE_ADMIN_API_SECRET || 'temp-admin-secret';
      
      const response = await fetch('/api/admin/flags', {
        method: 'GET',
        headers: {
          'x-admin-secret': adminSecret,
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch flags: ${response.status}`);
      }

      const data: FlagsResponse = await response.json();
      setFlagsData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error('Failed to load system flags');
    } finally {
      setLoading(false);
    }
  };

  const toggleBetaMode = async () => {
    if (!flagsData || isForceDisabled) return;

    try {
      setUpdating(true);
      const newValue = isBetaEnabled ? 'off' : 'on';
      
      // TODO: Replace with proper RBAC authentication
      const adminSecret = import.meta.env.VITE_ADMIN_API_SECRET || 'temp-admin-secret';
      
      const response = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          key: 'beta_monitoring',
          value: newValue
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      // Refresh flags data
      await fetchFlags();
      
      toast.success(`Beta monitoring ${newValue === 'on' ? 'enabled' : 'disabled'}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(`Failed to update setting: ${message}`);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading system flags...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading system flags: {error}</span>
            </div>
            <Button onClick={fetchFlags} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Server-Controlled Security Monitoring
                  {isForceDisabled && (
                    <Lock className="h-4 w-4 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  Enterprise-grade monitoring with admin-controlled performance modes
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isBetaEnabled ? "default" : "secondary"}>
                  {isBetaEnabled ? "Beta Mode" : "Production"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {flagsData?.store}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Security Monitoring</p>
                    <p className="text-sm text-muted-foreground">
                      {isBetaEnabled ? 'Reduced frequency (5 min)' : 'Full monitoring (30 sec)'}
                    </p>
                  </div>
                  {isBetaEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  ) : (
                    <Shield className="h-4 w-4 text-blue-500 ml-auto" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Database className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Background Processes</p>
                    <p className="text-sm text-muted-foreground">
                      {isBetaEnabled ? 'Optimized for beta' : 'Production ready'}
                    </p>
                  </div>
                  {isBetaEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Settings className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Security Scanning</p>
                    <p className="text-sm text-muted-foreground">
                      {isBetaEnabled ? 'Essential checks only' : 'Comprehensive'}
                    </p>
                  </div>
                  {isBetaEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Risk Assessment</p>
                    <p className="text-sm text-muted-foreground">
                      {isBetaEnabled ? 'Periodic updates' : 'Real-time analysis'}
                    </p>
                  </div>
                  {isBetaEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        onClick={toggleBetaMode}
                        disabled={isForceDisabled || updating}
                        className="flex items-center gap-2"
                        variant={isBetaEnabled ? "outline" : "default"}
                      >
                        {updating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : isBetaEnabled ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        {isBetaEnabled ? 'Restore Production Mode' : 'Enable Beta Mode'}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isForceDisabled && (
                    <TooltipContent>
                      <p>Beta mode disabled by FORCE_FULL_MONITORING environment override</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchFlags}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {isForceDisabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Production monitoring enforced by environment configuration
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    FORCE_FULL_MONITORING is active. Beta mode cannot be enabled until this override is removed.
                  </p>
                </div>
              )}

              {isBetaEnabled && !isForceDisabled && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Beta monitoring mode is active - optimized for development performance
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Security monitoring frequency is reduced to improve system responsiveness during testing.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};