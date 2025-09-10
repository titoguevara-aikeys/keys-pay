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

      <ComplianceFooter />
    </div>
  );
}