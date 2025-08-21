/*
 * KEYS TRAVEL - TRAVEL BOOKING PLATFORM
 * © 2025 Aikeys Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plane, 
  Hotel, 
  Car, 
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/MockAuthContext';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const travelServices = [
  {
    id: 'flights',
    name: 'Flight Bookings',
    description: 'Find and book flights worldwide with competitive prices',
    icon: Plane,
    features: ['Real-time pricing', 'Instant booking', 'Multi-city trips', '24/7 support']
  },
  {
    id: 'hotels',
    name: 'Hotel Reservations',
    description: 'Book accommodations from budget to luxury worldwide',
    icon: Hotel,
    features: ['Verified reviews', 'Best price guarantee', 'Instant confirmation', 'Free cancellation']
  },
  {
    id: 'rentals',
    name: 'Car Rentals',
    description: 'Rent vehicles for business and leisure travel',
    icon: Car,
    features: ['Global partners', 'Flexible pickup', 'Insurance included', 'GPS navigation']
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

const Travel: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Keys Travel - Book Flights, Hotels & Car Rentals';
    upsertMeta('description', 'Keys Travel: Book flights, hotels, and car rentals with seamless payments through your Keys Pay wallet.');
    upsertLink('canonical', window.location.origin + '/travel');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-emerald-500/5">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-32 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-emerald-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                  <Plane className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold">Keys Travel</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Book flights, hotels, and rentals with seamless payments through your Keys Pay wallet
              </p>
            </div>

            {/* Quick Search */}
            <Card className="max-w-4xl mx-auto mb-12">
              <CardHeader>
                <CardTitle>Find Your Next Adventure</CardTitle>
                <CardDescription>Search flights, hotels, and car rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Input placeholder="Departure city" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Input placeholder="Destination" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Travelers</label>
                    <Input placeholder="1 adult" />
                  </div>
                </div>
                <Button className="w-full mt-6">
                  <Search className="h-4 w-4 mr-2" />
                  Search Travel Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Travel Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Travel Services</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for seamless travel experiences
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {travelServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <IconComponent className="h-6 w-6 text-emerald-600" />
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
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4">
                          Explore {service.name}
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

        {/* Travel Wallet Integration */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Travel Wallet Integration</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Seamlessly pay for all your travel expenses using your Keys Pay wallet. 
                  Enjoy multi-currency support, real-time exchange rates, and secure transactions.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    <span>Instant payments with Keys Pay wallet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span>Secure and encrypted transactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span>Real-time booking confirmations</span>
                  </div>
                </div>

                <Button className="mt-8">
                  Connect Your Wallet
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Wallet Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Multi-Currency Support</p>
                      <p className="text-sm text-muted-foreground">Pay in local currencies worldwide</p>
                    </div>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Travel Insurance</p>
                      <p className="text-sm text-muted-foreground">Integrated travel protection plans</p>
                    </div>
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Expense Tracking</p>
                      <p className="text-sm text-muted-foreground">Automatic categorization</p>
                    </div>
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Enhanced travel features powered by EMEA-optimized APIs
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Visa Services</h3>
                  <p className="text-sm text-muted-foreground">Streamlined visa applications</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Group Bookings</h3>
                  <p className="text-sm text-muted-foreground">Corporate and family travel</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Loyalty Program</h3>
                  <p className="text-sm text-muted-foreground">Earn points and rewards</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Travel Protection</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive insurance</p>
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

export default Travel;