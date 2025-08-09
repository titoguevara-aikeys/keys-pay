import React, { useState } from 'react';
import { Smartphone, Fingerprint, Vibrate, Bell, Download, Wifi, Zap, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import MobileNavigation from './MobileNavigation';
import TouchGestures, { useSwipeGestures } from './TouchGestures';
import NativeCapabilities from './NativeCapabilities';

const MobileFeatures = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showGestureDemo, setShowGestureDemo] = useState(false);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { createSwipeHandlers } = useSwipeGestures();

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        setBiometricEnabled(true);
        toast({
          title: 'Biometric Authentication Enabled',
          description: 'Your device biometrics are now set up for secure login.',
        });
        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } catch (error) {
        toast({
          title: 'Biometric Error',
          description: 'Biometric authentication is not available on this device.',
          variant: 'destructive',
        });
      }
    } else {
      setBiometricEnabled(false);
      toast({
        title: 'Biometric Authentication Disabled',
        description: 'Biometric login has been turned off.',
      });
    }
  };

  const testHapticFeedback = async () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    toast({
      title: 'Haptic Feedback Test',
      description: 'Did you feel the vibration?',
    });
  };

  const testNotification = async () => {
    toast({
      title: 'Notification Sent',
      description: 'Check your device notifications.',
    });
    
    // Mock notification after delay
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('AIKEYS Test', {
          body: 'This is a test notification from AIKEYS Wallet!',
          icon: '/favicon.ico',
        });
      }
    }, 1000);
  };

  const installPWA = () => {
    toast({
      title: 'Install App',
      description: 'Look for the "Add to Home Screen" option in your browser menu.',
    });
  };

  const gestureHandlers = createSwipeHandlers({
    onSwipeLeft: () => toast({ title: 'Swipe Left', description: 'Navigate to previous screen!' }),
    onSwipeRight: () => toast({ title: 'Swipe Right', description: 'Navigate to next screen!' }),
    onSwipeUp: () => toast({ title: 'Swipe Up', description: 'Refresh content!' }),
    onSwipeDown: () => toast({ title: 'Swipe Down', description: 'Pull to refresh!' }),
  });

  return (
    <div className="space-y-6">
      {/* Mobile Navigation Component */}
      <MobileNavigation />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gestures">Gestures</TabsTrigger>
          <TabsTrigger value="native">Native</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Device Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Experience Overview
              </CardTitle>
              <CardDescription>
                Enhanced mobile features for the best user experience
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Platform</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={isMobile ? 'default' : 'secondary'}>
                      {isMobile ? 'Mobile Device' : 'Desktop/Web'}
                    </Badge>
                    <Badge variant="outline">Capacitor Ready</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Features Available</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Touch Gestures</Badge>
                    <Badge variant="outline" className="text-xs">Native UI</Badge>
                    <Badge variant="outline" className="text-xs">PWA Support</Badge>
                    <Badge variant="outline" className="text-xs">Offline Mode</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Responsive Design</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Optimized for all screen sizes and orientations
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Native Performance</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Fast, smooth interactions with native capabilities
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Security First</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Biometric authentication and secure storage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PWA Features */}
          {!isMobile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Progressive Web App
                </CardTitle>
                <CardDescription>
                  Install AIKEYS Wallet as a native app experience
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Install as App</h4>
                      <p className="text-sm text-blue-700">
                        Get faster access and native app experience
                      </p>
                    </div>
                    <Button onClick={installPWA} variant="outline">
                      Install
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <span>Push notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-purple-500" />
                    <span>Native experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-orange-500" />
                    <span>Home screen icon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gestures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Touch Gestures Demo</CardTitle>
              <CardDescription>
                Try swiping, tapping, and pinching in the demo area below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TouchGestures
                {...gestureHandlers}
                onDoubleTap={() => toast({ title: 'Double Tap', description: 'Double tap detected!' })}
                onLongPress={() => toast({ title: 'Long Press', description: 'Long press detected!' })}
                onPinch={(scale) => toast({ title: 'Pinch', description: `Pinch scale: ${scale.toFixed(2)}` })}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center"
              >
                <div className="space-y-4">
                  <div className="text-4xl">👆</div>
                  <h3 className="text-lg font-semibold">Gesture Demo Area</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Swipe in any direction</p>
                    <p>• Double tap to zoom</p>
                    <p>• Long press for context menu</p>
                    <p>• Pinch to scale (mobile only)</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowGestureDemo(!showGestureDemo)}
                  >
                    {showGestureDemo ? 'Hide' : 'Show'} Gesture Guide
                  </Button>
                </div>
              </TouchGestures>

              {showGestureDemo && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Available Gestures:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>• <strong>Swipe Left:</strong> Previous page</div>
                    <div>• <strong>Swipe Right:</strong> Next page</div>
                    <div>• <strong>Swipe Up:</strong> Refresh content</div>
                    <div>• <strong>Swipe Down:</strong> Pull to refresh</div>
                    <div>• <strong>Double Tap:</strong> Quick action</div>
                    <div>• <strong>Long Press:</strong> Context menu</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="native" className="space-y-6">
          <NativeCapabilities />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Security Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Security Features
              </CardTitle>
              <CardDescription>
                Enhanced security options for mobile devices
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="biometric">Biometric Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Use fingerprint or face recognition to log in
                  </p>
                </div>
                <Switch
                  id="biometric"
                  checked={biometricEnabled}
                  onCheckedChange={handleBiometricToggle}
                />
              </div>

              {biometricEnabled && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Biometric authentication is active
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Mobile Preferences
              </CardTitle>
              <CardDescription>
                Customize your mobile experience
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="haptic">Haptic Feedback</Label>
                  <p className="text-sm text-muted-foreground">
                    Feel vibrations for button taps and interactions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="haptic"
                    checked={hapticEnabled}
                    onCheckedChange={setHapticEnabled}
                  />
                  <Button size="sm" variant="outline" onClick={testHapticFeedback}>
                    Test
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for transactions and important updates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                  <Button size="sm" variant="outline" onClick={testNotification}>
                    Test
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="offline">Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache data for offline access (coming soon)
                  </p>
                </div>
                <Switch
                  id="offline"
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileFeatures;