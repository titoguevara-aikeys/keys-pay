import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield,
  Wallet
} from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/cards', icon: CreditCard, label: 'Cards' },
    { to: '/family', icon: Users, label: 'Family' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/security', icon: Shield, label: 'Security' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">AIKEYS Wallet</span>
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
                <item.icon className="h-4 w-4" />
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