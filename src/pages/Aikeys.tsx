/*
 * AIKEYS ECOSYSTEM - MOTHER PORTAL
 * © 2025 Aikeys Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Plane, 
  GraduationCap, 
  Truck,
  Users,
  Shield,
  Settings,
  BarChart3,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const productPortals = [
  {
    id: 'keys-pay',
    name: 'Keys Pay',
    description: 'Digital wallet, crypto trading, family finance, and secure payments',
    icon: CreditCard,
    url: '/',
    color: 'from-blue-500 to-blue-600',
    features: ['Digital Wallet', 'Crypto Trading', 'Family Controls', 'International Transfers']
  },
  {
    id: 'keys-travel',
    name: 'Keys Travel',
    description: 'Flight bookings, hotels, travel wallet, and seamless payments',
    icon: Plane,
    url: '/travel',
    color: 'from-emerald-500 to-emerald-600',
    features: ['Flight Booking', 'Hotel Reservations', 'Travel Insurance', 'Multi-currency Wallet']
  },
  {
    id: 'keys-education',
    name: 'Keys Education Services',
    description: 'Tuition payments, educational marketplace, and parental controls',
    icon: GraduationCap,
    url: '/education',
    color: 'from-purple-500 to-purple-600',
    features: ['Tuition Payments', 'Educational Marketplace', 'Student Finance', 'Parent Dashboard']
  },
  {
    id: 'keys-logistics',
    name: 'Keys Logistics',
    description: 'Freight booking, delivery tracking, and payment solutions',
    icon: Truck,
    url: '/logistics',
    color: 'from-orange-500 to-orange-600',
    features: ['Freight Booking', 'Last-mile Delivery', 'Package Tracking', 'Payment on Delivery']
  }
];

const corporateLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Investor Relations', href: '/investors' },
  { name: 'Press & Media', href: '/press' },
  { name: 'Contact', href: '/contact' }
];

function upsertMeta(name: string, content: string) {
  const existing = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (existing) {
    existing.content = content;
  } else {
    const tag = document.createElement('meta');
    tag.name = name;
    tag.content = content;
    document.head.appendChild(tag);
  }
}

function upsertLink(rel: string, href: string) {
  const existing = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
  } else {
    const tag = document.createElement('link');
    tag.rel = rel;
    tag.href = href;
    document.head.appendChild(tag);
  }
}

const Aikeys: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Aikeys - Financial Ecosystem Platform';
    upsertMeta('description', 'Aikeys: Unified financial ecosystem with Keys Pay, Keys Travel, Keys Education, and Keys Logistics.');
    upsertLink('canonical', window.location.origin + '/aikeys');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-32 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-tr from-primary/8 to-accent/15 rounded-full blur-xl"></div>
        
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-primary/20 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border border-accent/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/10 rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/eaa662fb-eaab-40db-8fcf-323d0e6e6852.png?v=2" 
                alt="Aikeys Logo" 
                className="h-16 w-16 mx-auto mb-6"
              />
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Aikeys Ecosystem
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Unified financial services platform connecting payments, travel, education, and logistics
              </p>
            </div>

            {user && (
              <div className="mb-12 p-6 bg-card border rounded-lg inline-block">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Welcome back, {user.email?.split('@')[0]}</p>
                    <p className="text-sm text-muted-foreground">Access all your Keys services</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Product Portals */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Product Ecosystem</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive financial and business solutions for modern life
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {productPortals.map((portal) => {
                const IconComponent = portal.icon;
                return (
                  <Card key={portal.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${portal.color} text-white`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{portal.name}</CardTitle>
                            <CardDescription className="text-base mt-1">
                              {portal.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {portal.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <ChevronRight className="h-3 w-3 text-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => window.location.href = portal.url}
                        >
                          Launch {portal.name}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Corporate Information */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {corporateLinks.map((link) => (
                    <Button 
                      key={link.name}
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = link.href}
                    >
                      {link.name}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Global Presence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Global Presence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">EMEA Headquarters</p>
                      <p className="text-sm text-muted-foreground">London, United Kingdom</p>
                    </div>
                    <div>
                      <p className="font-medium">Operational Centers</p>
                      <p className="text-sm text-muted-foreground">Dubai, UAE • Lagos, Nigeria</p>
                    </div>
                    <div>
                      <p className="font-medium">Licensed in</p>
                      <p className="text-sm text-muted-foreground">UK, EU, UAE, Nigeria, Kenya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      support@aikeys.com
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      +44 20 7946 0958
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      24/7 Security Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Platform Performance</h2>
              <p className="text-lg text-muted-foreground">
                Trusted by users across EMEA region
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">£2.5B+</div>
                <div className="text-muted-foreground">Transaction Volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">45+</div>
                <div className="text-muted-foreground">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Aikeys;