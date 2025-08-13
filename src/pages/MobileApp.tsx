import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import { Footer } from '@/components/Footer';
import MobileEnhancedFeatures from '@/components/mobile/MobileEnhancedFeatures';
import MobileSecurityFeatures from '@/components/mobile/MobileSecurityFeatures';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Download, 
  Apple, 
  PlayCircle,
  Shield,
  Zap,
  Globe,
  Users
} from 'lucide-react';

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

const MobileApp: React.FC = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = 'Keys Pay Mobile App | Native iOS & Android';
    upsertMeta('description', 'Download the Keys Pay mobile app for iOS and Android. Full-featured financial app with biometric security, QR payments, and native mobile capabilities.');
    upsertMeta('keywords', 'Keys Pay mobile app, iOS app, Android app, mobile banking, financial app, biometric security, QR payments');
    upsertLink('canonical', window.location.origin + '/mobile-app');
  }, []);

  const appFeatures = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Biometric authentication, jailbreak detection, and SAMA compliance"
    },
    {
      icon: Zap,
      title: "Native Performance",
      description: "Optimized for mobile with haptic feedback and smooth animations"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Full Arabic RTL support for EMEA markets"
    },
    {
      icon: Users,
      title: "Family Features",
      description: "Complete family finance management on mobile"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileNavigation /> : <Navigation />}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Smartphone className="h-24 w-24 text-primary" />
              <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 border-green-200">
                Live
              </Badge>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Keys Pay Mobile App
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Full-featured financial app for iOS and Android with native capabilities, 
            biometric security, and seamless integration with our web platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Download for Android
            </Button>
          </div>
          
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Free Download</span>
            <span>✓ 256-bit Encryption</span>
            <span>✓ SAMA Compliant</span>
          </div>
        </section>

        {/* App Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Mobile-First Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mobile Features Demo */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Mobile Features Demo
              </CardTitle>
              <CardDescription>
                Experience native mobile capabilities right in your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="features">Enhanced Features</TabsTrigger>
                  <TabsTrigger value="security">Security Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="mt-6">
                  <MobileEnhancedFeatures />
                </TabsContent>
                
                <TabsContent value="security" className="mt-6">
                  <MobileSecurityFeatures />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Technical Specifications */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                Built with modern mobile technologies for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">iOS Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• iOS 14.0 or later</li>
                    <li>• iPhone 8 or newer</li>
                    <li>• Face ID / Touch ID support</li>
                    <li>• 100 MB storage space</li>
                    <li>• Internet connection required</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Android Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Android 8.0 (API level 26) or later</li>
                    <li>• Fingerprint sensor support</li>
                    <li>• 100 MB storage space</li>
                    <li>• Camera permission for QR scanning</li>
                    <li>• Internet connection required</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Built with Capacitor for native iOS/Android deployment, sharing 95% of the codebase 
                  with our web platform. Uses React + TypeScript with native plugins for device features.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Development Status */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Development Status</CardTitle>
              <CardDescription>
                Current progress and upcoming releases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Beta Testing (iOS/Android)</h4>
                    <p className="text-sm text-muted-foreground">Internal testing with core features</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">App Store Submission</h4>
                    <p className="text-sm text-muted-foreground">Preparing for public release</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Release</h4>
                    <p className="text-sm text-muted-foreground">Available on App Store and Play Store</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Ready to Experience Keys Pay Mobile?</h2>
              <p className="text-muted-foreground mb-6">
                Join our beta testing program and be among the first to experience 
                the future of mobile financial services.
              </p>
              <Button size="lg">
                Join Beta Program
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MobileApp;