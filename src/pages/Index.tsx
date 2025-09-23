import Navigation from '@/components/Navigation';
import ComplianceFooter from '@/components/ComplianceFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-orange-400">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-white leading-tight">
            One app
            <br />
            for all needs
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 font-medium">
            Single account for all your payments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="text-lg px-12 py-4 bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-full shadow-2xl">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 py-4 border-white text-white hover:bg-white/10 font-semibold rounded-full">
              Learn More
            </Button>
          </div>

          {/* Provider Status Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Ramp Network Live
            </Badge>
            <Badge className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Nium Services Live
            </Badge>
            <Badge className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Clock className="h-4 w-4 mr-2" />
              OpenPayd Coming Soon
            </Badge>
          </div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
        
        {/* License badge */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Badge variant="outline" className="px-4 py-2 bg-white/10 text-white border-white/30 backdrop-blur-sm">
            Dubai DED License 1483958 · CR 2558995
          </Badge>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
}