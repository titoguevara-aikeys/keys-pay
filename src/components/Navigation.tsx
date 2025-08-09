import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Send
} from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: Send, label: 'Transactions' },
    { to: '/crypto', icon: (props: any) => <img src="/lovable-uploads/f90e4085-4c59-4872-9955-14e5aa8b7243.png" alt="Crypto Hub icon" className={props.className || "h-4 w-4"} />, label: 'Crypto Hub' },
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
    { to: '/super-app', icon: Zap, label: 'Super App' },
    { to: '/cards', icon: CreditCard, label: 'Cards' },
    { to: '/family', icon: Users, label: 'Family' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/kyc', icon: BadgeCheck, label: 'KYC' },
    { to: '/security', icon: Shield, label: 'Security' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/ad78c06f-06c1-4a99-b7fc-aefe5def66cc.png" 
                alt="Keys Logo" 
                className="h-8 w-auto"
              />
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

          {/* Mobile Navigation */}
          <div className="md:hidden">
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