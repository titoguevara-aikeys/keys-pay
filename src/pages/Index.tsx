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
    <div className="min-h-screen crypto-movie-background">
      <Navigation />
      
      {/* Cinema scanning line effects */}
      <div className="fx-data-streams"></div>
      
      {/* Film dust particles */}
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      <div className="crypto-particles"></div>
      
      {/* Cinema spotlight overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'var(--cinema-spotlight)',
        animation: 'spotlight-sweep 8s ease-in-out infinite'
      }}></div>
      
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

      <ComplianceFooter />
    </div>
  );
}