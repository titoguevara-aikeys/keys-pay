import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Zap,
  Shield,
  Database
} from 'lucide-react';

export const BetaPerformanceOptimizer = () => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [performanceStats, setPerformanceStats] = useState({
    securityMonitoring: 'reduced',
    backgroundTasks: 'optimized',
    databaseConnections: 'pooled',
    apiCalls: 'batched'
  });

  useEffect(() => {
    // Check if performance optimizations are active
    const optimizations = localStorage.getItem('beta_optimizations');
    if (optimizations === 'enabled') {
      setIsOptimized(true);
    }
  }, []);

  const enableOptimizations = () => {
    localStorage.setItem('beta_optimizations', 'enabled');
    setIsOptimized(true);
    
    // Disable heavy background processes during beta
    console.log('🚀 Beta performance optimizations enabled');
  };

  const disableOptimizations = () => {
    localStorage.removeItem('beta_optimizations');
    setIsOptimized(false);
    console.log('🔒 Full security monitoring restored');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Beta Performance Optimizer
              </CardTitle>
              <CardDescription>
                Optimize system performance during beta testing by reducing background processes
              </CardDescription>
            </div>
            <Badge variant={isOptimized ? "default" : "secondary"}>
              {isOptimized ? "Optimized" : "Standard"}
            </Badge>
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
                    {isOptimized ? 'Reduced frequency (5 min)' : 'Full monitoring (30 sec)'}
                  </p>
                </div>
                {isOptimized ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 ml-auto" />
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Database className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Background Tasks</p>
                  <p className="text-sm text-muted-foreground">
                    {isOptimized ? 'Minimized' : 'Standard load'}
                  </p>
                </div>
                {isOptimized ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Settings className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">API Call Frequency</p>
                  <p className="text-sm text-muted-foreground">
                    {isOptimized ? 'Batched & throttled' : 'Real-time'}
                  </p>
                </div>
                {isOptimized ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Activity className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Real-time Updates</p>
                  <p className="text-sm text-muted-foreground">
                    {isOptimized ? 'Essential only' : 'Full tracking'}
                  </p>
                </div>
                {isOptimized ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500 ml-auto" />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {!isOptimized ? (
                <Button onClick={enableOptimizations} className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Enable Beta Optimizations
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={disableOptimizations}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Restore Full Monitoring
                </Button>
              )}
            </div>

            {isOptimized && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Beta optimizations are active. Performance should be significantly improved.
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  These optimizations reduce background security monitoring and API calls while maintaining core functionality.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};