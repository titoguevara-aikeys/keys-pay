import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VerificationStatus from '@/components/VerificationStatus';
import { useAuth } from '@/contexts/MockAuthContext';
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
  CheckCircle
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { to: '/crypto', icon: (props: any) => <img src="/lovable-uploads/f90e4085-4c59-4872-9955-14e5aa8b7243.png" alt="Crypto Hub icon" className={props.className || "h-4 w-4"} />, label: 'Crypto Hub' },
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
    { to: '/super-app', icon: Zap, label: 'Super App' },
    { to: '/cards', icon: CreditCard, label: 'Cards' },
    { to: '/family', icon: Users, label: 'Family' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/mobile-app', icon: Smartphone, label: 'Mobile App' },
  ];

  const isVerified = profile?.email && profile?.phone;
  
  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a href="https://keys-pay.com" aria-label="Keys Pay home">
                <img 
                  src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
                  alt="Keys Pay logo" 
                  className="h-8 w-auto dark:opacity-90"
                />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                {item.to === '/crypto' ? (
                  <img src="/lovable-uploads/f90e4085-4c59-4872-9955-14e5aa8b7243.png" alt="Crypto Logo" className="h-4 w-4" />
                ) : (
                  React.createElement(item.icon, { className: "h-4 w-4" })
                )}
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Currency Selector */}
          <div className="hidden md:block">
            <CurrencySelector showLabel={false} className="text-sm" />
          </div>

          {/* User Section */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email?.split('@')[0] || 'User'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      ID: {user.id?.slice(-8)?.toUpperCase() || 'N/A'}
                    </span>
                    {isVerified && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs">
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <CurrencySelector showLabel={false} className="text-xs" />
            <select 
              className="bg-background border border-border rounded-md px-3 py-2 text-sm"
              onChange={(e) => window.location.href = e.target.value}
              value={window.location.pathname}
            >
              {navItems.map((item) => (
                <option key={item.to} value={item.to}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;