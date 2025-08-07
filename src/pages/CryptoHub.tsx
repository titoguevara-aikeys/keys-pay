import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CryptoWallet } from '@/components/CryptoWallet';
import { InternationalTransfer } from '@/components/InternationalTransfer';
import { MerchantPayments } from '@/components/MerchantPayments';
import { PaymentHub } from '@/components/PaymentHub';
import { AIKEYSFinancial } from '@/components/AIKEYSFinancial';
import { AIKEYSWealth } from '@/components/AIKEYSWealth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bitcoin, 
  Globe, 
  Store, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  DollarSign,
  CreditCard,
  Building,
  Crown
} from 'lucide-react';

export default function CryptoHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/lovable-uploads/56bfc0ef-2406-42fb-9655-3157c844950c.png" alt="Keys Logo" className="h-4 w-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Keys Crypto Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Spend crypto like fiat with seamless blockchain payments worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Bank-grade security
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Trusted by 4M+ users
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Instant transactions
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supported Cryptos</p>
                  <p className="text-2xl font-bold">50+</p>
                </div>
                <img src="/lovable-uploads/56bfc0ef-2406-42fb-9655-3157c844950c.png" alt="Keys Logo" className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Global Merchants</p>
                  <p className="text-2xl font-bold">130M+</p>
                </div>
                <Store className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Countries</p>
                  <p className="text-2xl font-bold">200+</p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                  <p className="text-2xl font-bold">$50M+</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="payments" className="space-y-6" key="crypto-hub-tabs" onValueChange={(value) => console.log('Tab changed to:', value)}>
          <TabsList className="grid w-full grid-cols-6 h-12">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Hub
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto Wallet
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              International
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="wealth" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Wealth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <PaymentHub />
          </TabsContent>

          <TabsContent value="wallet">
            <CryptoWallet />
          </TabsContent>

          <TabsContent value="transfers">
            <InternationalTransfer />
          </TabsContent>

          <TabsContent value="merchants">
            <MerchantPayments />
          </TabsContent>

          <TabsContent value="financial">
            <AIKEYSFinancial />
          </TabsContent>

          <TabsContent value="wealth">
            <AIKEYSWealth />
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Keys Crypto?</CardTitle>
            <CardDescription>
              Advanced features inspired by the best crypto payment platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Custodian</h3>
                  <p className="text-sm text-muted-foreground">
                    Licensed trust company with multi-signature security and insurance coverage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Instant Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time crypto to fiat conversion with no advance conversion needed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Send money to 200+ countries with competitive exchange rates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent pricing with minimal fees and competitive exchange rates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Store className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Universal Acceptance</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible with Apple Pay, Google Pay, and 130M+ merchants worldwide
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock customer support and fraud protection
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}