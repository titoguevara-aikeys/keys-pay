import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MegaPanel from './MegaPanel';
import MobileNav from './MobileNav';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { 
  User, 
  LogOut, 
  CheckCircle,
  Menu,
  Sun,
  Moon,
  Command
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  panel?: {
    title: string;
    description: string;
    sections: Array<{
      title: string;
      items: Array<{
        title: string;
        description: string;
        href: string;
        icon: React.ReactNode;
      }>;
    }>;
    featured?: {
      title: string;
      description: string;
      href: string;
      image: string;
    };
  };
}

const MegaNav = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();

  useEffect(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/',
      panel: {
        title: 'Dashboard & Overview',
        description: 'Your financial command center',
        sections: [
          {
            title: 'Analytics',
            items: [
              { title: 'Portfolio Overview', description: 'Complete asset overview', href: '/analytics', icon: '📊' },
              { title: 'Performance Metrics', description: 'Track your growth', href: '/analytics', icon: '📈' },
              { title: 'Risk Assessment', description: 'Portfolio risk analysis', href: '/analytics', icon: '🛡️' }
            ]
          },
          {
            title: 'Quick Actions',
            items: [
              { title: 'Send Money', description: 'Transfer funds instantly', href: '/transactions', icon: '💸' },
              { title: 'Receive Payment', description: 'Generate payment links', href: '/transactions', icon: '📥' },
              { title: 'Pay Bills', description: 'Manage recurring payments', href: '/transactions', icon: '🏠' }
            ]
          }
        ]
      }
    },
    {
      label: 'Transactions',
      href: '/transactions',
      panel: {
        title: 'Transaction Management',
        description: 'Complete payment ecosystem',
        sections: [
          {
            title: 'Payment Methods',
            items: [
              { title: 'Bank Transfers', description: 'Instant bank-to-bank transfers', href: '/transactions', icon: '🏦' },
              { title: 'Card Payments', description: 'Credit and debit card processing', href: '/cards', icon: '💳' },
              { title: 'Crypto Payments', description: 'Digital asset transactions', href: '/crypto', icon: '₿' }
            ]
          },
          {
            title: 'International',
            items: [
              { title: 'Cross-border Transfers', description: 'Global money movement', href: '/transactions', icon: '🌍' },
              { title: 'Currency Exchange', description: 'Real-time FX rates', href: '/transactions', icon: '💱' },
              { title: 'Trade Finance', description: 'Import/export solutions', href: '/transactions', icon: '🚢' }
            ]
          }
        ]
      }
    },
    {
      label: 'Crypto Hub',
      href: '/crypto',
      panel: {
        title: 'Cryptocurrency Center',
        description: 'Your gateway to digital assets',
        sections: [
          {
            title: 'Trading',
            items: [
              { title: 'Spot Trading', description: 'Buy and sell crypto instantly', href: '/crypto', icon: '⚡' },
              { title: 'DeFi Integration', description: 'Decentralized finance access', href: '/crypto', icon: '🔗' },
              { title: 'Staking Rewards', description: 'Earn passive income', href: '/crypto', icon: '💰' }
            ]
          },
          {
            title: 'Portfolio',
            items: [
              { title: 'Asset Management', description: 'Multi-chain portfolio tracking', href: '/crypto', icon: '📱' },
              { title: 'Market Analysis', description: 'Real-time market insights', href: '/analytics', icon: '📊' },
              { title: 'Price Alerts', description: 'Never miss opportunities', href: '/crypto', icon: '🔔' }
            ]
          }
        ]
      }
    },
    {
      label: 'AI Assistant',
      href: '/ai-assistant',
      panel: {
        title: 'AI Financial Intelligence',
        description: 'Your personal financial advisor',
        sections: [
          {
            title: 'Smart Insights',
            items: [
              { title: 'Spending Analysis', description: 'AI-powered spending patterns', href: '/ai-assistant', icon: '🧠' },
              { title: 'Investment Advice', description: 'Personalized recommendations', href: '/ai-assistant', icon: '💡' },
              { title: 'Risk Management', description: 'Automated risk assessment', href: '/ai-assistant', icon: '🛡️' }
            ]
          },
          {
            title: 'Automation',
            items: [
              { title: 'Smart Budgeting', description: 'Automated budget optimization', href: '/ai-assistant', icon: '🎯' },
              { title: 'Goal Planning', description: 'AI-driven financial planning', href: '/ai-assistant', icon: '🎪' },
              { title: 'Tax Optimization', description: 'Maximize your savings', href: '/ai-assistant', icon: '📋' }
            ]
          }
        ]
      }
    },
    {
      label: 'Super App',
      href: '/super-app',
      panel: {
        title: 'Integrated Services',
        description: 'All-in-one financial ecosystem',
        sections: [
          {
            title: 'Banking',
            items: [
              { title: 'Digital Banking', description: 'Full-service banking features', href: '/super-app', icon: '🏛️' },
              { title: 'Loans & Credit', description: 'Access to credit solutions', href: '/super-app', icon: '💳' },
              { title: 'Investment Products', description: 'Wealth management tools', href: '/super-app', icon: '📈' }
            ]
          },
          {
            title: 'Lifestyle',
            items: [
              { title: 'Travel Services', description: 'Booking and travel management', href: '/super-app', icon: '✈️' },
              { title: 'Insurance', description: 'Comprehensive coverage options', href: '/super-app', icon: '🛡️' },
              { title: 'Rewards Program', description: 'Earn points and benefits', href: '/super-app', icon: '🎁' }
            ]
          }
        ]
      }
    },
    {
      label: 'Cards',
      href: '/cards'
    },
    {
      label: 'Family',
      href: '/family'
    },
    {
      label: 'Analytics',
      href: '/analytics'
    }
  ];

  const handlePanelEnter = (label: string) => {
    if (navItems.find(item => item.label === label)?.panel) {
      setActivePanel(label);
    }
  };

  const handlePanelLeave = () => {
    setActivePanel(null);
  };

  const isVerified = profile?.email && profile?.phone;

  return (
    <>
      <nav className="relative bg-background/95 backdrop-blur-md border-b border-border/50 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
                  alt="Keys Pay" 
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Keys Pay
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handlePanelEnter(item.label)}
                  onMouseLeave={handlePanelLeave}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-[17px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/80 hover:text-foreground hover:bg-accent'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Command Palette Trigger */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true
                  });
                  document.dispatchEvent(event);
                }}
                className="hidden md:flex items-center gap-2"
                title="Command Palette (⌘K)"
              >
                <Command className="h-4 w-4" />
                <span className="text-sm">⌘K</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hidden md:flex"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

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
                    onClick={signOut}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mega Panel */}
        {activePanel && (
          <div
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 shadow-2xl"
            onMouseEnter={() => setActivePanel(activePanel)}
            onMouseLeave={handlePanelLeave}
          >
            <MegaPanel 
              panel={navItems.find(item => item.label === activePanel)?.panel!}
            />
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};

export default MegaNav;