import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroCircularNav from './HeroCircularNav';
import FloatingLogos from './FloatingLogos';

export default function DarkHero() {
  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-blue-900/20" />
      
      {/* Large blurred shapes in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      
      {/* Floating logos */}
      <FloatingLogos />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Left column - Text content */}
          <div className="space-y-8 pt-12 lg:pt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-white">Keys </span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Pay Wallet
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
              Claim your free Keys Pay WalletID. Connect the money management you know today with the ecosystem of tomorrow
            </p>
            
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-6 rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
              >
                Touch the Future Now
              </Button>
            </Link>
          </div>

          {/* Right column - Circular navigation */}
          <div className="relative h-[600px] flex items-center justify-center">
            <HeroCircularNav />
          </div>
        </div>
      </div>
    </section>
  );
}
