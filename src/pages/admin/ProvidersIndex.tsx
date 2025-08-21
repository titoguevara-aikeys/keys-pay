import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

export default function ProvidersIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Providers</h1>
            <p className="text-muted-foreground">Manage payment and financial service providers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* NIUM Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                NIUM
                <Badge variant="secondary">Sandbox Connected</Badge>
              </CardTitle>
              <CardDescription>
                Cards, Payouts & FX services via NIUM sandbox environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant="outline">Sandbox</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Live</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="text-sm">Cards, Payouts, FX</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link to="/admin/providers/nium">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://sandbox.nium.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ramp Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Ramp
                <Badge variant="default">Live</Badge>
              </CardTitle>
              <CardDescription>
                Crypto on/off-ramp services for buy/sell operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant="default">Production</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Live</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="text-sm">Buy/Sell Crypto</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>
                  <Settings className="w-4 h-4 mr-1" />
                  Auto-configured
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://ramp.network" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* OpenPayd Provider */}
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                OpenPayd
                <Badge variant="outline">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>
                eIBAN and virtual account services (feature flagged)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant="secondary">Sandbox</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="text-sm">eIBAN, Accounts</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>
                  <Settings className="w-4 h-4 mr-1" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Overview</CardTitle>
            <CardDescription>Current provider configuration and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Active Providers</h3>
                <div className="space-y-1">
                  <Badge variant="default" className="mr-2">NIUM</Badge>
                  <Badge variant="default">Ramp</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Services Available</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Card Issuing (Virtual/Physical)</li>
                  <li>• International Payouts</li>
                  <li>• Crypto Buy/Sell</li>
                  <li>• FX & Currency Exchange</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Compliance</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Dubai DED License: 1483958</div>
                  <div>CR Number: 2558995</div>
                  <div>Model: Non-custodial Aggregator</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}