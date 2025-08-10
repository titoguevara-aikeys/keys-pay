import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BetaPerformanceOptimizer } from '@/components/BetaPerformanceOptimizer';
import { 
  Activity, 
  Database, 
  Server, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export const AdminSystemHealth = () => {
  // Mock system health data
  const systemStats = {
    uptime: '99.8%',
    responseTime: '245ms',
    totalRequests: '1,234,567',
    errorRate: '0.02%'
  };

  const services = [
    { name: 'Authentication Service', status: 'operational', uptime: 99.9, responseTime: 120 },
    { name: 'Payment Processing', status: 'operational', uptime: 99.8, responseTime: 340 },
    { name: 'Database Cluster', status: 'operational', uptime: 99.95, responseTime: 50 },
    { name: 'Notification Service', status: 'degraded', uptime: 97.2, responseTime: 890 },
    { name: 'Backup System', status: 'maintenance', uptime: 95.0, responseTime: 0 },
    { name: 'Monitoring API', status: 'operational', uptime: 99.7, responseTime: 180 }
  ];

  const infrastructure = [
    { name: 'CPU Usage', value: 68, status: 'normal', icon: Cpu },
    { name: 'Memory Usage', value: 74, status: 'normal', icon: MemoryStick },
    { name: 'Disk Usage', value: 45, status: 'normal', icon: HardDrive },
    { name: 'Network I/O', value: 32, status: 'normal', icon: Wifi }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      case 'outage':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Outage
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Beta Performance Optimizer */}
      <BetaPerformanceOptimizer />
      
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.uptime}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{systemStats.responseTime}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{systemStats.totalRequests}</p>
              </div>
              <Server className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.errorRate}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current status of all system services</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Uptime: {service.uptime}%</span>
                        {service.responseTime > 0 && (
                          <span>Response: {service.responseTime}ms</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Monitoring</CardTitle>
            <CardDescription>Real-time system resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {infrastructure.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{resource.name}</span>
                      </div>
                      <span className="text-sm font-medium">{resource.value}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={resource.value} className="h-2" />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(resource.value)}`}
                        style={{ width: `${resource.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">System Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Server Nodes</p>
                  <p className="font-medium">12 Active</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Load Balancer</p>
                  <p className="font-medium">Healthy</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Database Replicas</p>
                  <p className="font-medium">3 Synced</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Backup Status</p>
                  <p className="font-medium">Up to Date</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Recent system events and maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { event: 'Database backup completed successfully', time: '5 minutes ago', type: 'success' },
              { event: 'Load balancer configuration updated', time: '12 minutes ago', type: 'info' },
              { event: 'Memory usage spike detected on node-3', time: '25 minutes ago', type: 'warning' },
              { event: 'Notification service scaled up (2 -> 4 instances)', time: '1 hour ago', type: 'info' },
              { event: 'SSL certificate renewed for api.domain.com', time: '2 hours ago', type: 'success' },
              { event: 'Scheduled maintenance completed on payment gateway', time: '4 hours ago', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline">View Full Activity Log</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};