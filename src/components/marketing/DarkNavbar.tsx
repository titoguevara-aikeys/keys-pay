import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, Globe, Menu, X, Command, Wallet, CreditCard, Users, TrendingUp, Shield, Zap, Gift, BarChart3, Globe2, Building2, Phone, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import keysPayLogo from '@/assets/keys-pay-logo.png';
import MegaPanel from '@/components/nav/MegaPanel';

interface NavItem {
  label: string;
  megaPanel?: {
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

const navigationItems: NavItem[] = [
  {
    label: 'Products',
    megaPanel: {
      title: 'Our Products',
      description: 'Comprehensive financial solutions for individuals and businesses',
      sections: [
        {
          title: 'Personal Banking',
          items: [
            {
              title: 'Digital Wallet',
              description: 'Secure crypto and fiat wallet',
              href: '/crypto-hub',
              icon: <Wallet className="w-5 h-5" />
            },
            {
              title: 'Virtual Cards',
              description: 'Instant virtual debit cards',
              href: '/cards',
              icon: <CreditCard className="w-5 h-5" />
            },
            {
              title: 'Family Controls',
              description: 'Manage family finances together',
              href: '/family',
              icon: <Users className="w-5 h-5" />
            }
          ]
        },
        {
          title: 'Investments',
          items: [
            {
              title: 'Crypto Trading',
              description: 'Buy, sell, and trade crypto',
              href: '/crypto-hub',
              icon: <TrendingUp className="w-5 h-5" />
            },
            {
              title: 'Analytics',
              description: 'Track your portfolio performance',
              href: '/analytics',
              icon: <BarChart3 className="w-5 h-5" />
            }
          ]
        }
      ],
      featured: {
        title: 'New: Physical Cards',
        description: 'Order your premium Keys Pay card today',
        href: '/cards',
        image: '/lovable-uploads/platinum-card-bg.png'
      }
    }
  },
  {
    label: 'Business',
    megaPanel: {
      title: 'Business Solutions',
      description: 'Enterprise-grade financial tools for your business',
      sections: [
        {
          title: 'Payment Solutions',
          items: [
            {
              title: 'Merchant Payments',
              description: 'Accept payments globally',
              href: '/payments',
              icon: <Building2 className="w-5 h-5" />
            },
            {
              title: 'International Transfer',
              description: 'Send money worldwide',
              href: '/payments',
              icon: <Globe2 className="w-5 h-5" />
            }
          ]
        },
        {
          title: 'Business Tools',
          items: [
            {
              title: 'API Integration',
              description: 'Developer-friendly APIs',
              href: '/admin',
              icon: <Zap className="w-5 h-5" />
            },
            {
              title: 'Security Center',
              description: 'Enterprise security features',
              href: '/security',
              icon: <Shield className="w-5 h-5" />
            }
          ]
        }
      ]
    }
  },
  {
    label: 'Rewards',
    megaPanel: {
      title: 'Rewards Program',
      description: 'Earn rewards with every transaction',
      sections: [
        {
          title: 'Earn Rewards',
          items: [
            {
              title: 'Cashback',
              description: 'Get up to 5% cashback',
              href: '/analytics',
              icon: <Gift className="w-5 h-5" />
            },
            {
              title: 'Referral Program',
              description: 'Invite friends and earn',
              href: '/analytics',
              icon: <Users className="w-5 h-5" />
            }
          ]
        }
      ]
    }
  },
  {
    label: 'Support',
    megaPanel: {
      title: 'Customer Support',
      description: '24/7 support for all your needs',
      sections: [
        {
          title: 'Get Help',
          items: [
            {
              title: 'Help Center',
              description: 'Find answers to common questions',
              href: '/support',
              icon: <HeadphonesIcon className="w-5 h-5" />
            },
            {
              title: 'Contact Us',
              description: 'Reach out to our team',
              href: '/support',
              icon: <Phone className="w-5 h-5" />
            }
          ]
        }
      ]
    }
  }
];

export default function DarkNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handlePanelEnter = (label: string) => {
    setActivePanel(label);
  };

  const handlePanelLeave = () => {
    setActivePanel(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={keysPayLogo} alt="Keys Pay" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Keys Pay</span>
            <span className="text-xs text-gray-400 tracking-wider">FINANCIAL PLATFORM</span>
          </div>
        </Link>

        {/* Desktop Navigation - Main Menu */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.megaPanel && handlePanelEnter(item.label)}
              onMouseLeave={handlePanelLeave}
            >
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                {item.label}
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Navigation - Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
            <Command size={16} />
            <span className="text-sm">K</span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
            <Globe size={18} />
            <span className="text-sm">EN</span>
          </button>
          
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              Open Account
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mega Navigation Panel */}
      {activePanel && (
        <div
          className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 shadow-2xl"
          onMouseEnter={() => setActivePanel(activePanel)}
          onMouseLeave={handlePanelLeave}
        >
          {navigationItems.map((item) => 
            item.label === activePanel && item.megaPanel ? (
              <MegaPanel key={item.label} panel={item.megaPanel} />
            ) : null
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-slate-950">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.megaPanel?.sections[0]?.items[0]?.href || '/'}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-white/5 pt-4 mt-2">
              <button className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full">
                <Search size={20} />
                <span>Search</span>
              </button>
              
              <button className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full">
                <MessageSquare size={20} />
                <span>Chat</span>
              </button>
            </div>
            
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
