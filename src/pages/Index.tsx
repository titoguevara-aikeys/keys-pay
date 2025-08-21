import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ComplianceFooter from '@/components/ComplianceFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpCircle, 
  CreditCard, 
  Globe, 
  Shield, 
  Building, 
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
  Wallet,
  ArrowRight,
  Play
} from 'lucide-react';

export default function Index() {
  const [activeProvider, setActiveProvider] = useState('ramp');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" alt="Keys Pay Logo" className="h-10 w-10" />
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              Dubai DED License 1483958 · CR 2558995
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide leading-tight">
            Keys Pay Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            DED-licensed <strong>non-custodial aggregator</strong> for virtual assets and financial services
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Ramp Network (Live)
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Nium Services (Live)
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              OpenPayd (Coming Soon)
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              Launch Platform
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="mr-2 h-4 w-4" />
              View Architecture
            </Button>
          </div>
        </div>
      </section>

      {/* Service Matrix */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Matrix</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No redundancy - each provider handles specific capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    Ramp Network
                  </span>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Live</Badge>
                </CardTitle>
                <CardDescription>Fiat ↔ Crypto on/off-ramp</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Buy Crypto (Fiat→Crypto)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Sell Crypto (Crypto→Fiat)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Nium Services
                  </span>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Live</Badge>
                </CardTitle>
                <CardDescription>Cards & Cross-border payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Virtual/Physical Cards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Payouts & FX
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Family Controls
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-orange-500" />
                    OpenPayd
                  </span>
                  <Badge variant="outline" className="border-orange-500/20 text-orange-500">Coming Soon</Badge>
                </CardTitle>
                <CardDescription>European eIBAN accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    eIBAN / Accounts
                  </li>
                  <li className="text-xs text-muted-foreground">
                    Feature-flagged until approval
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Architecture</h2>
            <p className="text-xl text-muted-foreground">
              Non-custodial aggregator with feature-flagged provider routing
            </p>
          </div>

          <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>High-Level Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-2">User Devices</h3>
                      <p className="text-sm text-muted-foreground">Web App & Mobile App</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-2">Keys Pay BFF</h3>
                      <p className="text-sm text-muted-foreground">API Gateway + Feature Flags</p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-2">Provider APIs</h3>
                      <p className="text-sm text-muted-foreground">Ramp, Nium, OpenPayd</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoint Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ArrowUpCircle className="h-4 w-4 text-green-500" />
                        Ramp (Live)
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li><code>POST /api/ramp/session</code></li>
                        <li><code>POST /api/ramp/webhook</code></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        Nium (Live)
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li><code>POST /api/payouts/quote</code></li>
                        <li><code>POST /api/payouts/execute</code></li>
                        <li><code>POST /api/cards/issue</code></li>
                        <li><code>POST /api/cards/controls</code></li>
                        <li><code>POST /api/nium/webhook</code></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-orange-500" />
                        OpenPayd (Coming Soon)
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li><code>POST /api/openpayd/accounts/apply</code></li>
                        <li><code>GET /api/openpayd/accounts/:id</code></li>
                        <li><code>POST /api/openpayd/webhook</code></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Common
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li><code>GET /api/status/:ref</code></li>
                        <li><code>GET /api/providers</code></li>
                        <li><code>GET /api/health</code></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Data Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Authentication</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          HMAC signature verification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Webhook signature verification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          OAuth2 + RBAC
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Data Protection</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          PII minimization
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Masked IBAN/card data only
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Rate limits (100 req/min/user)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Legal Framework</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Entity:</strong> AIKEYS</li>
                        <li><strong>License:</strong> Dubai DED License 1483958</li>
                        <li><strong>CR Number:</strong> 2558995</li>
                        <li><strong>Model:</strong> Non-custodial aggregator</li>
                        <li><strong>VARA:</strong> Not required (aggregator model)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Feature Flags (Aug 25)</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <code>RAMP_ENABLED=true</code>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <code>NIUM_ENABLED=true</code>
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <code>OPENPAYD_ENABLED=false</code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Provider Status */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Provider Status</h2>
            <p className="text-xl text-muted-foreground">Real-time integration monitoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ramp Network</h3>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-3">Operational</Badge>
                <p className="text-sm text-muted-foreground">Buy/Sell crypto services active</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nium Services</h3>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-3">Operational</Badge>
                <p className="text-sm text-muted-foreground">Cards & payouts fully operational</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">OpenPayd</h3>
                <Badge variant="outline" className="border-orange-500/20 text-orange-500 mb-3">Coming Soon</Badge>
                <p className="text-sm text-muted-foreground">eIBAN accounts in development</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of DED-compliant virtual asset services through our aggregator platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              Start Trading
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Building className="mr-2 h-4 w-4" />
              API Documentation
            </Button>
          </div>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}