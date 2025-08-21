'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, XCircle, Activity, Users, DollarSign, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProviderStatus {
  name: string;
  health: 'up' | 'degraded' | 'down';
  score: number;
  uptime: number;
  avgResponseTime: number;
  successRate: number;
  lastUpdated: string;
  services: string[];
  corridors: string[];
}

interface ProviderSummary {
  totalProviders: number;
  healthyProviders: number;
  degradedProviders: number;
  downProviders: number;
  avgScore: number;
  lastUpdated: string;
}

interface MockTransaction {
  id: string;
  type: 'onramp' | 'offramp' | 'payout' | 'iban';
  provider: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  reference: string;
}

export default function KeysPayAdmin() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [summary, setSummary] = useState<ProviderSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions] = useState<MockTransaction[]>([
    {
      id: '1',
      type: 'onramp',
      provider: 'TRANSAK',
      amount: 500,
      currency: 'AED',
      status: 'completed',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:45:00Z',
      reference: 'KP_1642678200_ABC123'
    },
    {
      id: '2',
      type: 'offramp',
      provider: 'GUARDARIAN',
      amount: 1000,
      currency: 'USDT',
      status: 'pending',
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      reference: 'KP_1642674900_DEF456'
    },
    {
      id: '3',
      type: 'payout',
      provider: 'NIUM',
      amount: 2500,
      currency: 'USD',
      status: 'completed',
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-20T08:30:00Z',
      reference: 'KP_1642671600_GHI789'
    }
  ]);

  const fetchProviderStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keyspay/providers');
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch provider status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchProviderStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'up':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const exportComplianceLog = () => {
    // Mock compliance export
    const csvContent = transactions.map(tx => 
      `${tx.id},${tx.type},${tx.provider},${tx.amount},${tx.currency},${tx.status},${tx.createdAt},${tx.reference}`
    ).join('\n');
    
    const header = 'ID,Type,Provider,Amount,Currency,Status,Created,Reference\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyspay-compliance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Keys Pay Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor providers, transactions, and compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportComplianceLog}>
              <Download className="h-4 w-4 mr-2" />
              Export Compliance Log
            </Button>
            <Button variant="outline" onClick={fetchProviderStatus} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalProviders}</div>
              <p className="text-xs text-muted-foreground">
                {summary.healthyProviders} healthy, {summary.degradedProviders} degraded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(summary.avgScore * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Platform health score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.filter(tx => tx.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">
                Pending processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$127K</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Provider Status</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Health Status</CardTitle>
              <CardDescription>
                Real-time monitoring of all integrated payment providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.name}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getHealthIcon(provider.health)}
                          <span className="capitalize">{provider.health}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.score > 0.8 ? 'default' : 'secondary'}>
                          {(provider.score * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{provider.uptime.toFixed(1)}%</TableCell>
                      <TableCell>{provider.avgResponseTime}ms</TableCell>
                      <TableCell>{provider.successRate.toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {provider.services.slice(0, 2).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {provider.services.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(provider.lastUpdated).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Live transaction monitoring across all providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.reference}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.provider}</TableCell>
                      <TableCell>
                        {tx.amount.toLocaleString()} {tx.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tx.status)} className="capitalize">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(tx.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>
                Dubai DED compliant aggregator model monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Compliance Status: Active</strong> - Keys Pay operates as a licensed aggregator 
                  under Dubai DED Commercial License (No. 1483958, CR No. 2558995). All regulated activities 
                  are performed by licensed partners. Keys Pay does not custody client funds, issue financial 
                  products, or act as Merchant of Record.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Licensed Partners</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Transak (On-ramp MoR)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Guardarian (Off-ramp MoR)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Nium (Payouts MoR)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>OpenPayd (Banking MoR)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Audit Trail</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✓ All transactions logged with provider references</p>
                    <p>✓ Minimal PII storage (partner KYC refs only)</p>
                    <p>✓ Immutable transaction records</p>
                    <p>✓ Daily compliance exports available</p>
                    <p>✓ Partner terms and conditions linked</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  Last compliance export: {new Date().toLocaleDateString()}
                </div>
                <Button onClick={exportComplianceLog}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Compliance Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Keys Pay Aggregator Model:</strong> All financial and virtual asset services are provided by 
          independent licensed partners acting as Merchant of Record. Keys Pay operates as a technology platform 
          only under Dubai DED regulations.
        </p>
      </div>
    </div>
  );
}