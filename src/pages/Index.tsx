import { useState } from 'react';
import MegaNav from '@/components/nav/MegaNav';
import RadialNavMenu from '@/components/nav/RadialNavMenu';
import ComplianceFooter from '@/components/ComplianceFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpCircle, 
  CreditCard, 
  Globe, 
  Shield, 
  Users,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Layers,
  BarChart3
} from 'lucide-react';

export default function Index() {
  const [activeProvider, setActiveProvider] = useState('ramp');

  return (
    <div className="min-h-screen bg-background">
      <MegaNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" alt="Keys Pay Logo" className="h-10 w-10 drop-shadow-2xl" />
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium fx-card">
              Dubai DED License 1483958 · CR 2558995
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent tracking-wide leading-tight crypto-text">
            Keys Pay Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto mb-8 drop-shadow-lg">
            DED-licensed <strong className="text-primary">non-custodial aggregator</strong> for virtual assets and financial services
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="outline" className="px-4 py-2 fx-card border-green-400/20">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 drop-shadow-lg" />
              Ramp Network (Live)
            </Badge>
            <Badge variant="outline" className="px-4 py-2 fx-card border-green-400/20">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 drop-shadow-lg" />
              Nium Services (Live)
            </Badge>
            <Badge variant="outline" className="px-4 py-2 fx-card border-orange-400/20">
              <Clock className="h-4 w-4 mr-2 text-orange-400 drop-shadow-lg" />
              OpenPayd (Coming Soon)
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-2xl fx-card">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              Launch Platform
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 fx-card border-primary/30 hover:bg-primary/10">
              <Play className="mr-2 h-4 w-4" />
              View Architecture
            </Button>
          </div>
        </div>
        
        {/* Subtle cinematic vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-black/15"></div>
      </section>

      {/* Quick Access Cards */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Comprehensive Financial Ecosystem
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Experience the future of digital finance with our integrated platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Smart Analytics Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">AI-Powered</Badge>
                </div>
                <CardTitle className="text-xl">Smart Analytics</CardTitle>
                <CardDescription>
                  Advanced financial insights with real-time market data and predictive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Portfolio Growth</span>
                    <span className="font-semibold text-emerald-500">+24.7%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-semibold text-blue-500">Moderate</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crypto Trading Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                  </div>
                  <Badge variant="outline" className="border-green-400/20 text-green-400">Live Trading</Badge>
                </div>
                <CardTitle className="text-xl">Crypto Hub</CardTitle>
                <CardDescription>
                  Multi-chain cryptocurrency trading with DeFi integration and advanced charting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">24h Volume</span>
                    <span className="font-semibold">$2.4M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assets Supported</span>
                    <span className="font-semibold">500+</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Start Trading
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Management Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <Badge variant="outline" className="border-purple-400/20 text-purple-400">Family Suite</Badge>
                </div>
                <CardTitle className="text-xl">Family Banking</CardTitle>
                <CardDescription>
                  Complete family financial management with parental controls and savings goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Family Members</span>
                    <span className="font-semibold">Up to 8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Parental Controls</span>
                    <span className="font-semibold text-emerald-500">Active</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <Target className="mr-2 h-4 w-4" />
                    Manage Family
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">Beta</Badge>
                </div>
                <CardTitle className="text-xl">AI Financial Advisor</CardTitle>
                <CardDescription>
                  Personalized financial guidance powered by advanced machine learning algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy Rate</span>
                    <span className="font-semibold text-emerald-500">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recommendations</span>
                    <span className="font-semibold">Real-time</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <Layers className="mr-2 h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Cards Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CreditCard className="h-6 w-6 text-emerald-500" />
                  </div>
                  <Badge variant="outline" className="border-emerald-400/20 text-emerald-400">Instant Issue</Badge>
                </div>
                <CardTitle className="text-xl">Virtual Cards</CardTitle>
                <CardDescription>
                  Instant virtual card generation with advanced security and spending controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issue Time</span>
                    <span className="font-semibold text-emerald-500">Instant</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Security Level</span>
                    <span className="font-semibold text-blue-500">Military Grade</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <Shield className="mr-2 h-4 w-4" />
                    Create Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Global Transfers Card */}
            <Card className="fx-card group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="h-6 w-6 text-indigo-500" />
                  </div>
                  <Badge variant="outline" className="border-indigo-400/20 text-indigo-400">Worldwide</Badge>
                </div>
                <CardTitle className="text-xl">Global Transfers</CardTitle>
                <CardDescription>
                  Cross-border payments with competitive rates and lightning-fast settlement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Countries</span>
                    <span className="font-semibold">180+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Settlement Time</span>
                    <span className="font-semibold text-emerald-500">&lt; 1 min</span>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-primary/90">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Send Money
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Radial Navigation Menu */}
      <RadialNavMenu />

      <ComplianceFooter />
    </div>
  );
}