/*
 * KEYS EDUCATION SERVICES - EDUCATIONAL FINANCE PLATFORM
 * © 2025 Aikeys Technologies. All Rights Reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  CreditCard,
  Shield,
  Calendar,
  PiggyBank,
  Award,
  ArrowRight,
  Search,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/MockAuthContext';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const educationServices = [
  {
    id: 'tuition',
    name: 'Tuition Payments',
    description: 'Seamless school fee payments with automated scheduling',
    icon: GraduationCap,
    features: ['Automated payments', 'Multi-currency support', 'Payment reminders', 'Receipt management']
  },
  {
    id: 'marketplace',
    name: 'Educational Marketplace',
    description: 'Browse and purchase educational resources and services',
    icon: BookOpen,
    features: ['Online courses', 'Digital textbooks', 'Tutoring services', 'Educational tools']
  },
  {
    id: 'family',
    name: 'Family Controls',
    description: 'Parental oversight and spending controls for student accounts',
    icon: Users,
    features: ['Spending limits', 'Transaction monitoring', 'Allowance management', 'Educational goals']
  }
];

const studentFinanceOptions = [
  {
    name: 'Education Savings',
    description: 'Build savings for future educational expenses',
    icon: PiggyBank,
    rate: '4.5% APY'
  },
  {
    name: 'Student Loans',
    description: 'Competitive rates for educational financing',
    icon: DollarSign,
    rate: 'From 3.2%'
  },
  {
    name: 'Scholarship Fund',
    description: 'Contribute to and apply for educational scholarships',
    icon: Award,
    rate: 'Merit-based'
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

const Education: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Keys Education Services - Educational Finance Platform';
    upsertMeta('description', 'Keys Education Services: Tuition payments, educational marketplace, student finance, and parental controls.');
    upsertLink('canonical', window.location.origin + '/education');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-purple-500/5">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-32 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold">Keys Education Services</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive educational finance solutions for students, parents, and institutions
              </p>
            </div>

            {/* Quick Actions */}
            <Card className="max-w-4xl mx-auto mb-12">
              <CardHeader>
                <CardTitle>Educational Finance Hub</CardTitle>
                <CardDescription>Manage tuition, find resources, and track educational expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col gap-2">
                    <GraduationCap className="h-6 w-6" />
                    Pay Tuition
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    Browse Marketplace
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Family Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Education Services</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for educational financial management
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {educationServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <IconComponent className="h-6 w-6 text-purple-600" />
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
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4">
                          Access {service.name}
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

        {/* Student Finance Options */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Student Finance Solutions</h2>
              <p className="text-lg text-muted-foreground">
                Flexible financing options to support educational goals
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {studentFinanceOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="p-3 rounded-lg bg-purple-500/10 w-fit mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">{option.name}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600 mb-4">{option.rate}</div>
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

        {/* Parental Controls */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Family Finance Controls</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Comprehensive parental oversight tools integrated with your Keys Pay family controls. 
                  Monitor educational spending, set limits, and track progress toward educational goals.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>Secure spending controls and limits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Detailed educational expense reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>Real-time transaction notifications</span>
                  </div>
                </div>

                <Button className="mt-8">
                  Set Up Family Controls
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Parent Dashboard Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Educational Goals</p>
                      <p className="text-sm text-muted-foreground">Track savings progress</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">75%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Budget</p>
                      <p className="text-sm text-muted-foreground">Educational expenses</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$1,250</p>
                      <p className="text-xs text-green-600">Under budget</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Active Students</p>
                      <p className="text-sm text-muted-foreground">Family members</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">2</p>
                      <p className="text-xs text-muted-foreground">Students</p>
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
              Advanced educational features powered by partnerships with leading institutions
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Institution Search</h3>
                  <p className="text-sm text-muted-foreground">Find and compare schools</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Academic Calendar</h3>
                  <p className="text-sm text-muted-foreground">Track important dates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Achievement Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor academic progress</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Student Cards</h3>
                  <p className="text-sm text-muted-foreground">Educational spending cards</p>
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

export default Education;