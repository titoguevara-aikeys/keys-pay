import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Settings,
  Database,
  AlertTriangle,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Eye,
  Lock,
  Ban,
  Monitor
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminTransactionMonitor } from '@/components/admin/AdminTransactionMonitor';
import { AdminSystemHealth } from '@/components/admin/AdminSystemHealth';
import { AdminAnalyticsDashboard } from '@/components/admin/AdminAnalyticsDashboard';
import { AdminSecurityCenter } from '@/components/admin/AdminSecurityCenter';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin dashboard data
  const stats = {
    totalUsers: 15247,
    activeUsers: 12389,
    totalTransactions: 89234,
    totalVolume: 2847293.45,
    pendingVerifications: 23,
    securityAlerts: 5,
    systemHealth: 99.8,
    dailyGrowth: 3.2
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-muted-foreground mt-1">System management and monitoring dashboard</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.dailyGrowth}% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalVolume.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalTransactions.toLocaleString()} total transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.securityAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Eye className="h-5 w-5" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Lock className="h-5 w-5" />
                    Freeze Account
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Ban className="h-5 w-5" />
                    Block User
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Settings className="h-5 w-5" />
                    System Config
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                  <CardDescription>Items requiring admin approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">KYC Verifications</span>
                      <Badge variant="secondary">{stats.pendingVerifications}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Merchant Applications</span>
                      <Badge variant="secondary">7</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transaction Disputes</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <Button className="w-full mt-4">Review All</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest administrative actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'User verification approved', user: 'john.doe@example.com', time: '2 min ago', type: 'success' },
                    { action: 'Suspicious transaction flagged', user: 'Transaction #TX89234', time: '5 min ago', type: 'warning' },
                    { action: 'New merchant application', user: 'TechCorp Solutions', time: '12 min ago', type: 'info' },
                    { action: 'Account temporarily locked', user: 'jane.smith@example.com', time: '18 min ago', type: 'error' },
                    { action: 'System backup completed', user: 'Automated Process', time: '1 hour ago', type: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="mt-6">
            <MonitoringDashboard />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <AdminUserManagement />
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <AdminTransactionMonitor />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <AdminAnalyticsDashboard />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <AdminSecurityCenter />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="mt-6">
            <AdminSystemHealth />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPortal;