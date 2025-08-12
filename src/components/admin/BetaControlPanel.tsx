import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Zap, 
  Users, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Power,
  Pause,
  Play,
  RotateCcw,
  Database,
  Monitor
} from 'lucide-react';
import { BetaTestingDashboard } from '../performance/BetaTestingDashboard';
import { useToast } from '@/hooks/use-toast';

interface SystemToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
  category: 'payment' | 'security' | 'feature' | 'monitoring';
}

interface EmergencyControl {
  id: string;
  name: string;
  description: string;
  action: 'disable' | 'enable' | 'restart' | 'emergency_stop';
  confirmRequired: boolean;
}

export const BetaControlPanel: React.FC = () => {
  const { toast } = useToast();
  const [systemToggles, setSystemToggles] = useState<SystemToggle[]>([
    {
      id: 'payment_processing',
      name: 'Payment Processing',
      description: 'Enable/disable payment processing system',
      enabled: true,
      critical: true,
      category: 'payment'
    },
    {
      id: 'crypto_trading',
      name: 'Crypto Trading',
      description: 'Enable/disable cryptocurrency trading features',
      enabled: true,
      critical: false,
      category: 'feature'
    },
    {
      id: 'ai_assistant',
      name: 'AI Assistant',
      description: 'Enable/disable AI financial assistant',
      enabled: true,
      critical: false,
      category: 'feature'
    },
    {
      id: 'security_monitoring',
      name: 'Security Monitoring',
      description: 'Real-time security threat monitoring',
      enabled: true,
      critical: true,
      category: 'security'
    },
    {
      id: 'performance_monitoring',
      name: 'Performance Monitoring',
      description: 'System performance and health monitoring',
      enabled: true,
      critical: false,
      category: 'monitoring'
    },
    {
      id: 'family_controls',
      name: 'Family Controls',
      description: 'Parental controls and family management',
      enabled: true,
      critical: false,
      category: 'feature'
    }
  ]);

  const [emergencyControls] = useState<EmergencyControl[]>([
    {
      id: 'kill_payments',
      name: 'Emergency Payment Stop',
      description: 'Immediately halt all payment processing',
      action: 'emergency_stop',
      confirmRequired: true
    },
    {
      id: 'restart_system',
      name: 'System Restart',
      description: 'Restart all system components',
      action: 'restart',
      confirmRequired: true
    },
    {
      id: 'enable_maintenance',
      name: 'Maintenance Mode',
      description: 'Put system in maintenance mode',
      action: 'disable',
      confirmRequired: false
    },
    {
      id: 'clear_cache',
      name: 'Clear System Cache',
      description: 'Clear all system caches and reset',
      action: 'restart',
      confirmRequired: false
    }
  ]);

  const handleToggleSystem = (toggleId: string) => {
    setSystemToggles(prev => 
      prev.map(toggle => 
        toggle.id === toggleId 
          ? { ...toggle, enabled: !toggle.enabled }
          : toggle
      )
    );

    const toggle = systemToggles.find(t => t.id === toggleId);
    if (toggle) {
      toast({
        title: `${toggle.name} ${toggle.enabled ? 'Disabled' : 'Enabled'}`,
        description: toggle.description,
        variant: toggle.critical ? 'destructive' : 'default'
      });
    }
  };

  const handleEmergencyAction = (controlId: string) => {
    const control = emergencyControls.find(c => c.id === controlId);
    if (!control) return;

    if (control.confirmRequired) {
      const confirmed = window.confirm(
        `Are you sure you want to execute: ${control.name}?\n\n${control.description}`
      );
      if (!confirmed) return;
    }

    // Simulate emergency action
    toast({
      title: `${control.name} Executed`,
      description: control.description,
      variant: control.action === 'emergency_stop' ? 'destructive' : 'default'
    });

    // Log emergency action
    console.log(`Emergency action executed: ${control.name}`, {
      controlId,
      action: control.action,
      timestamp: new Date().toISOString(),
      user: 'admin' // In real app, get from auth context
    });
  };

  const getCategoryIcon = (category: SystemToggle['category']) => {
    switch (category) {
      case 'payment':
        return <Zap className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'feature':
        return <Settings className="h-4 w-4" />;
      case 'monitoring':
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: EmergencyControl['action']) => {
    switch (action) {
      case 'disable':
        return <Pause className="h-4 w-4" />;
      case 'enable':
        return <Play className="h-4 w-4" />;
      case 'restart':
        return <RotateCcw className="h-4 w-4" />;
      case 'emergency_stop':
        return <Power className="h-4 w-4" />;
    }
  };

  const enabledCriticalSystems = systemToggles.filter(t => t.critical && t.enabled).length;
  const totalCriticalSystems = systemToggles.filter(t => t.critical).length;

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Alert variant={enabledCriticalSystems === totalCriticalSystems ? 'default' : 'destructive'}>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>System Status</AlertTitle>
        <AlertDescription>
          {enabledCriticalSystems}/{totalCriticalSystems} critical systems operational
          {enabledCriticalSystems < totalCriticalSystems && (
            <span className="ml-2 text-destructive">
              - Some critical systems are disabled
            </span>
          )}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="controls">System Controls</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Actions</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
        </TabsList>

        {/* System Controls */}
        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Component Controls
              </CardTitle>
              <CardDescription>
                Enable or disable individual system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemToggles.map((toggle) => (
                  <div 
                    key={toggle.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(toggle.category)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {toggle.name}
                          {toggle.critical && (
                            <Badge variant="destructive" className="text-xs">
                              Critical
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {toggle.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={toggle.enabled ? 'default' : 'secondary'}
                        className={toggle.enabled ? 'bg-metric-excellent' : ''}
                      >
                        {toggle.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={toggle.enabled}
                        onCheckedChange={() => handleToggleSystem(toggle.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Actions */}
        <TabsContent value="emergency" className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Controls</AlertTitle>
            <AlertDescription>
              These actions can immediately impact system operations. Use with caution.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Actions
              </CardTitle>
              <CardDescription>
                Critical system controls for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyControls.map((control) => (
                  <div 
                    key={control.id}
                    className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getActionIcon(control.action)}
                      <div>
                        <div className="font-medium">{control.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {control.description}
                        </div>
                        {control.confirmRequired && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Confirmation Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant={control.action === 'emergency_stop' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => handleEmergencyAction(control.id)}
                    >
                      Execute
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Monitoring */}
        <TabsContent value="monitoring" className="space-y-4">
          <BetaTestingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};