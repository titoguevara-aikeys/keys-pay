import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, CreditCard, BarChart3, Settings, Menu, X, Bell, Search,
  Wallet, DollarSign, Shield, Users, PlusCircle, Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle hardware back button on mobile
  useEffect(() => {
    const handleBackButton = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        return false; // Prevent default back action
      }
      return true; // Allow default back action
    };

    if (typeof window !== 'undefined' && 'Capacitor' in window) {
      // Add Capacitor back button handler
      document.addEventListener('backbutton', handleBackButton);
      return () => document.removeEventListener('backbutton', handleBackButton);
    }
  }, [isMenuOpen]);

  const mainNavItems = [
    { to: '/', icon: Home, label: 'Dashboard', badge: null },
    { to: '/cards', icon: CreditCard, label: 'Cards', badge: null },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { to: '/crypto-hub', icon: Wallet, label: 'Crypto', badge: null },
    { to: '/family-controls', icon: Users, label: 'Family', badge: null },
  ];

  const quickActions = [
    { icon: PlusCircle, label: 'Add Money', action: () => toast({ title: 'Add Money', description: 'Add money feature coming soon!' }) },
    { icon: Scan, label: 'QR Pay', action: () => toast({ title: 'QR Payment', description: 'QR payment scanner opening...' }) },
    { icon: DollarSign, label: 'Send Money', action: () => toast({ title: 'Send Money', description: 'Quick send feature activated!' }) },
    { icon: Shield, label: 'Security', action: () => toast({ title: 'Security', description: 'Security dashboard opening...' }) },
  ];

  const getNavClassName = (isActive: boolean) => 
    `flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'text-primary bg-primary/10 scale-105' 
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;

  if (!isMobile) {
    return null; // Don't render on desktop
  }

  return (
    <>
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">AIKEYS</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Side Menu */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 space-y-6">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">JD</span>
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">Premium Member</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-3"
                    onClick={action.action}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h3>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Settings */}
            <div className="pt-4 border-t">
              <NavLink
                to="/security"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {mainNavItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => getNavClassName(isActive)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer for bottom navigation */}
      <div className="h-20" />
    </>
  );
};

export default MobileNavigation;