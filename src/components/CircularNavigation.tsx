import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import CurrencySelector from '@/components/CurrencySelector';
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield,
  Wallet,
  Zap,
  Bitcoin,
  Brain,
  BadgeCheck,
  ArrowRightLeft,
  Smartphone,
  LogOut,
  User,
  CheckCircle,
  Star,
  Settings,
  HelpCircle
} from 'lucide-react';

const CircularNavigation = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Core platform features
  const coreFeatures = [
    { to: '/', icon: Home, label: 'Dashboard', category: 'CORE' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions', category: 'CORE' },
    { to: '/cards', icon: CreditCard, label: 'Cards', category: 'FINANCIAL' },
    { to: '/crypto', icon: (props: any) => <img src="/lovable-uploads/f90e4085-4c59-4872-9955-14e5aa8b7243.png" alt="Crypto Hub" className={props.className || "h-6 w-6"} />, label: 'Crypto Hub', category: 'CRYPTO' },
  ];

  // Extended features
  const extendedFeatures = [
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant', category: 'INTELLIGENCE' },
    { to: '/super-app', icon: Zap, label: 'Super App', category: 'PRODUCTIVITY' },
    { to: '/family', icon: Users, label: 'Family', category: 'FAMILY' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', category: 'INSIGHTS' },
    { to: '/mobile-app', icon: Smartphone, label: 'Mobile App', category: 'MOBILE' },
  ];

  // Business services
  const businessServices = [
    { to: '/security', icon: Shield, label: 'Security', category: 'SECURITY' },
    { to: '/kyc', icon: BadgeCheck, label: 'KYC', category: 'COMPLIANCE' },
    { to: '/education', icon: HelpCircle, label: 'Education', category: 'SUPPORT' },
  ];

  const isVerified = profile?.email && profile?.phone;
  
  const handleLogout = () => {
    signOut();
  };

  const NavItem = ({ item, radius, angle, index }: { item: any, radius: number, angle: number, index: number }) => {
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        }}
        onMouseEnter={() => setHoveredItem(item.to)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 group relative ${
              isActive
                ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40'
            }`
          }
        >
          <div className="flex flex-col items-center">
            {item.to === '/crypto' ? (
              <img src="/lovable-uploads/f90e4085-4c59-4872-9955-14e5aa8b7243.png" alt="Crypto" className="h-6 w-6 mb-1" />
            ) : (
              React.createElement(item.icon, { className: "h-6 w-6 mb-1" })
            )}
            <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
          </div>
          
          {/* Category label */}
          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold opacity-0 transition-opacity duration-300 ${
            hoveredItem === item.to ? 'opacity-100' : ''
          }`}>
            <span className="bg-black/50 px-2 py-1 rounded text-white whitespace-nowrap">
              {item.category}
            </span>
          </div>
        </NavLink>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-cyan-700/50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
            alt="Keys Pay logo" 
            className="h-8 w-auto"
          />
          <span className="text-white font-semibold text-lg">Keys Pay Platform</span>
        </div>
        
        <div className="flex items-center gap-4">
          <CurrencySelector showLabel={false} className="text-white" />
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <User className="h-4 w-4 text-white" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email?.split('@')[0] || 'User'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/70">
                      ID: {user.id?.slice(-8)?.toUpperCase() || 'N/A'}
                    </span>
                    {isVerified && (
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main circular navigation */}
      <div className="relative flex-1 flex items-center justify-center p-8">
        <div className="relative w-[800px] h-[600px]">
          
          {/* Central hubs */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl border-4 border-white/20">
                <div className="text-center text-white">
                  <h2 className="text-xl font-bold mb-2">Keys Pay</h2>
                  <h3 className="text-lg">Platform</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-xl border-4 border-white/20">
                <div className="text-center text-white">
                  <h2 className="text-lg font-bold mb-1">Business</h2>
                  <h3 className="text-md">Services</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Core features around main hub */}
          {coreFeatures.map((item, index) => (
            <NavItem
              key={item.to}
              item={item}
              radius={140}
              angle={-90 + (index * 90)}
              index={index}
            />
          ))}

          {/* Extended features in outer ring */}
          {extendedFeatures.map((item, index) => (
            <NavItem
              key={item.to}
              item={item}
              radius={220}
              angle={-72 + (index * 72)}
              index={index}
            />
          ))}

          {/* Business services around right hub */}
          {businessServices.map((item, index) => (
            <NavItem
              key={item.to}
              item={item}
              radius={120}
              angle={-90 + (index * 120)}
              index={index}
            />
          ))}

          {/* Category labels */}
          <div className="absolute top-8 left-8 text-white/80 font-bold text-sm tracking-wider transform -rotate-45">
            PRODUCTIVITY
          </div>
          <div className="absolute top-8 right-8 text-white/80 font-bold text-sm tracking-wider transform rotate-45">
            INTELLIGENCE
          </div>
          <div className="absolute bottom-8 left-8 text-white/80 font-bold text-sm tracking-wider transform rotate-45">
            FINANCIAL
          </div>
          <div className="absolute bottom-8 right-8 text-white/80 font-bold text-sm tracking-wider transform -rotate-45">
            SECURITY
          </div>
          <div className="absolute top-1/2 left-0 text-white/80 font-bold text-sm tracking-wider transform -rotate-90 -translate-y-1/2">
            FAMILY
          </div>
          <div className="absolute top-1/2 right-0 text-white/80 font-bold text-sm tracking-wider transform rotate-90 translate-y-1/2">
            COMPLIANCE
          </div>
        </div>
      </div>

      {/* Ecosystem footer */}
      <footer className="relative z-10 p-6 bg-black/20 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Ecosystem</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Ramp Network
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Nium Services
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              OpenPayd
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Circle APIs
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Guardarian
            </Badge>
          </div>
        </div>
      </footer>

      {/* Mobile fallback */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
        <select 
          className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
          onChange={(e) => window.location.href = e.target.value}
          value={window.location.pathname}
        >
          {[...coreFeatures, ...extendedFeatures, ...businessServices].map((item) => (
            <option key={item.to} value={item.to} className="bg-gray-800">
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CircularNavigation;