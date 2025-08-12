/*
 * KEYS LOGISTICS - FREIGHT AND DELIVERY PLATFORM
 * © 2025 Aikeys Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  CreditCard,
  Shield,
  Globe,
  Zap,
  ArrowRight,
  Search,
  BarChart3,
  FileText,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const logisticsServices = [
  {
    id: 'freight',
    name: 'Freight Booking',
    description: 'Book air, sea, and land freight services worldwide',
    icon: Truck,
    features: ['Real-time quotes', 'Multi-modal shipping', 'Custom clearance', 'Door-to-door delivery']
  },
  {
    id: 'lastmile',
    name: 'Last-Mile Delivery',
    description: 'Local delivery solutions for businesses and consumers',
    icon: Package,
    features: ['Same-day delivery', 'Scheduled pickups', 'Real-time tracking', 'Signature confirmation']
  },
  {
    id: 'tracking',
    name: 'Package Tracking',
    description: 'Monitor shipments from origin to destination',
    icon: MapPin,
    features: ['GPS tracking', 'SMS notifications', 'Delivery updates', 'Digital proof of delivery']
  }
];

const paymentSolutions = [
  {
    name: 'Payment on Delivery',
    description: 'Secure COD services with instant settlement',
    icon: CreditCard,
    benefit: 'Instant Settlement'
  },
  {
    name: 'Escrow Services',
    description: 'Secure payments held until delivery confirmation',
    icon: Shield,
    benefit: 'Risk Protection'
  },
  {
    name: 'Multi-Currency',
    description: 'Accept payments in local and international currencies',
    icon: Globe,
    benefit: 'Global Reach'
  }
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

const Logistics: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Keys Logistics - Freight & Delivery Solutions';
    upsertMeta('description', 'Keys Logistics: Freight booking, last-mile delivery, package tracking, and payment-on-delivery solutions.');
    upsertLink('canonical', window.location.origin + '/logistics');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-orange-500/5">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-32 w-80 h-80 bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <Truck className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold">Keys Logistics</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive freight, delivery, and logistics solutions with integrated payment systems
              </p>
            </div>

            {/* Quick Shipping Quote */}
            <Card className="max-w-4xl mx-auto mb-12">
              <CardHeader>
                <CardTitle>Get Instant Shipping Quote</CardTitle>
                <CardDescription>Calculate costs for freight and delivery services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Input placeholder="Origin location" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Input placeholder="Destination" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input type="number" placeholder="0.0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <Input placeholder="Express, Standard" />
                  </div>
                </div>
                <Button className="w-full mt-6">
                  <Search className="h-4 w-4 mr-2" />
                  Get Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Logistics Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Logistics Services</h2>
              <p className="text-lg text-muted-foreground">
                End-to-end logistics solutions for businesses of all sizes
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {logisticsServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <IconComponent className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4">
                          Book {service.name}
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

        {/* Payment Solutions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Payment Solutions</h2>
              <p className="text-lg text-muted-foreground">
                Secure and flexible payment options for logistics services
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {paymentSolutions.map((solution, index) => {
                const IconComponent = solution.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="p-3 rounded-lg bg-orange-500/10 w-fit mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">{solution.name}</CardTitle>
                      <CardDescription>{solution.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-semibold text-orange-600 mb-4">{solution.benefit}</div>
                      <Button variant="outline" className="w-full">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Business Dashboard */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Business Dashboard</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Comprehensive logistics management dashboard integrated with your Keys Pay business account. 
                  Track shipments, manage payments, and optimize your supply chain operations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span>Real-time analytics and reporting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <span>Automated invoice generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-orange-600" />
                    <span>Mobile app for on-the-go management</span>
                  </div>
                </div>

                <Button className="mt-8">
                  Access Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Logistics Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Active Shipments</p>
                      <p className="text-sm text-muted-foreground">Currently in transit</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">24</p>
                      <p className="text-xs text-green-600">+12% this week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">On-Time Delivery</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">96.5%</p>
                      <p className="text-xs text-green-600">Above target</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Cost Savings</p>
                      <p className="text-sm text-muted-foreground">Vs. previous provider</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">18%</p>
                      <p className="text-xs text-green-600">Reduced costs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Advanced logistics features powered by AI and IoT integration
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Smart Routing</h3>
                  <p className="text-sm text-muted-foreground">AI-optimized delivery routes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Global Network</h3>
                  <p className="text-sm text-muted-foreground">Worldwide partner network</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Cargo Insurance</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive coverage</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Predictive Analytics</h3>
                  <p className="text-sm text-muted-foreground">Delivery time predictions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Logistics;