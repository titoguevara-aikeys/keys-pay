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
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGitHubReleases } from '@/hooks/useGitHubReleases';
import { 
  Smartphone, 
  Download, 
  Apple, 
  PlayCircle,
  Shield,
  Zap,
  Globe,
  Users,
  Mail,
  Check
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
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { latestAPK, loading: releasesLoading, error: releasesError } = useGitHubReleases();

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const appUrl = window.location.origin;
      
      // Check if GitHub releases are properly configured
      const isGitHubConfigured = !releasesError && latestAPK?.url;
      const apkUrl = isGitHubConfigured ? latestAPK.url : null;
      
      const { data, error: emailError } = await supabase.functions.invoke('send-app-link', {
        body: { 
          email: email.trim(),
          appUrl,
          apkUrl,
          setupRequired: !isGitHubConfigured
        }
      });

      if (emailError) {
        throw emailError;
      }

      toast({
        title: "Welcome to Keys Pay Beta! 🎉",
        description: "Check your email for beta testing instructions and app link.",
      });
      
      setEmail('');
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending beta invitation:', error);
      toast({
        title: "Failed to send invitation",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* iOS - Still Beta */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Download for iOS
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Join Keys Pay Beta Testing</DialogTitle>
                  <DialogDescription>
                    Get early access to the Keys Pay mobile app. We'll send you TestFlight (iOS) invitation links.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBetaSignup} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1 flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Join Beta
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>• You'll receive TestFlight invitations within 24 hours</p>
                    <p>• Available for iOS 14.0+</p>
                    <p>• Beta version includes all core features</p>
                    <p>• Android APK is available for direct download above</p>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Android - Direct Download */}
            {latestAPK ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="flex items-center gap-2" 
                asChild
              >
                <a href={latestAPK.url} download>
                  <Download className="h-5 w-5" />
                  Download Android APK
                </a>
              </Button>
            ) : releasesLoading ? (
              <Button size="lg" variant="outline" disabled>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading APK...
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                <PlayCircle className="h-5 w-5" />
                Download for Android
              </Button>
            )}
          </div>
          
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Free Download</span>
            <span>✓ 256-bit Encryption</span>
            <span>✓ SAMA Compliant</span>
            {latestAPK && <span>✓ Latest: {new Date(latestAPK.releaseDate).toLocaleDateString()}</span>}
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

        {/* Download Status & Latest Version */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Download Status</CardTitle>
              <CardDescription>
                Latest builds and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Android APK</h4>
                    <p className="text-sm text-muted-foreground">
                      {latestAPK ? `${latestAPK.version} - Direct download available` : 'Automated builds via GitHub Actions'}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">iOS TestFlight</h4>
                    <p className="text-sm text-muted-foreground">Beta testing program</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Beta Only</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Play Store Release</h4>
                    <p className="text-sm text-muted-foreground">Public release submission</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
              
              {latestAPK && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Latest Android Version</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Version:</strong> {latestAPK.version}</p>
                    <p><strong>Size:</strong> {(latestAPK.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Built:</strong> {new Date(latestAPK.releaseDate).toLocaleDateString()}</p>
                  </div>
                  <Button className="mt-3" asChild>
                    <a href={latestAPK.url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download Latest APK
                    </a>
                  </Button>
                </div>
              )}
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
              <Button size="lg" className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                <Mail className="h-4 w-4" />
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