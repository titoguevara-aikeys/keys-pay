import { useState } from 'react';
import MegaNav from '@/components/nav/MegaNav';
import RadialNavMenu from '@/components/nav/RadialNavMenu';
import ComplianceFooter from '@/components/ComplianceFooter';
import { StagingBackground } from '@/components/effects/StagingBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpCircle, 
  CreditCard, 
  Globe, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  ArrowRight,
  DollarSign,
  Bitcoin,
  Activity,
  Settings,
  BarChart3
} from 'lucide-react';

export default function Index() {
  const [activeProvider, setActiveProvider] = useState('ramp');

  return (
    <div className="min-h-screen relative">
      {/* Staging Background */}
      <StagingBackground />
      
      <div className="relative z-10">
        <MegaNav />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 min-h-screen flex items-center">
          <div className="container mx-auto text-center relative z-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" alt="Keys Pay Logo" className="h-10 w-10 drop-shadow-2xl" />
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/10 text-white border-white/20">
                Dubai DED License 1483958 · CR 2558995
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Keys </span>
              <span className="bg-gradient-to-r from-teal-300 to-green-400 bg-clip-text text-transparent">Pay Wallet</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Claim your free Keys Pay WalletID. Connect the money management you know today with the ecosystem of tomorrow
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-full text-lg hover:from-teal-400 hover:to-green-400 transition-all duration-300 shadow-2xl">
                Touch the Future Now
              </button>
            </div>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Virtual Cards</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Create and manage virtual payment cards instantly with advanced security features.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Global Payments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Send and receive money worldwide with competitive exchange rates and low fees.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Secure Wallet</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Enterprise-grade security with multi-layer protection for your digital assets.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Provider Status */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Technology Partners</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="outline" className="px-4 py-2 bg-green-500/20 border-green-400/20 text-green-300">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Ramp Network (Live)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-green-500/20 border-green-400/20 text-green-300">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Nium Services (Live)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-orange-500/20 border-orange-400/20 text-orange-300">
                <Clock className="h-4 w-4 mr-2" />
                OpenPayd (Coming Soon)
              </Badge>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2">
                    <Bitcoin className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Crypto Trading</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm">
                    Buy, sell and trade cryptocurrencies with real-time market data.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-2">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm">
                    Track your spending patterns and financial insights.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Family Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm">
                    Manage family finances with shared accounts and controls.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm">
                    Get personalized financial advice and smart insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Radial Navigation */}
      <RadialNavMenu />
      
      {/* Footer */}
      <div className="relative z-10">
        <ComplianceFooter />
      </div>
    </div>
  );
}