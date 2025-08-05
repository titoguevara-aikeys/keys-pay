import React, { useState } from 'react';
import { Smartphone, Fingerprint, Vibrate, Bell, Download, Wifi } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMobile } from '@/contexts/MobileContext';
import { useToast } from '@/hooks/use-toast';

const MobileFeatures = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const { isMobile, deviceInfo, appInfo, sendNotification, hapticFeedback, biometricAuth } = useMobile();
  const { toast } = useToast();

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const success = await biometricAuth();
        if (success) {
          setBiometricEnabled(true);
          toast({
            title: 'Biometric Authentication Enabled',
            description: 'Your device biometrics are now set up for secure login.',
          });
          await hapticFeedback('light');
        } else {
          toast({
            title: 'Biometric Setup Failed',
            description: 'Could not verify your biometric authentication.',
            variant: 'destructive',
          });
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
    await hapticFeedback('medium');
    toast({
      title: 'Haptic Feedback Test',
      description: 'Did you feel the vibration?',
    });
  };

  const testNotification = async () => {
    await sendNotification(
      'Test Notification',
      'This is a test notification from AIKEYS Wallet!'
    );
    toast({
      title: 'Notification Sent',
      description: 'Check your device notifications.',
    });
  };

  const installPWA = () => {
    // This would trigger PWA installation
    toast({
      title: 'Install App',
      description: 'Look for the "Add to Home Screen" option in your browser menu.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Device Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Information
          </CardTitle>
          <CardDescription>
            Your device and app details
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Platform</h4>
              <div className="flex items-center gap-2">
                <Badge variant={isMobile ? 'default' : 'secondary'}>
                  {isMobile ? 'Mobile App' : 'Web App (PWA)'}
                </Badge>
                {deviceInfo?.platform && (
                  <Badge variant="outline">
                    {deviceInfo.platform}
                  </Badge>
                )}
              </div>
            </div>

            {deviceInfo && (
              <>
                <div className="space-y-2">
                  <h4 className="font-medium">Device Model</h4>
                  <p className="text-sm text-muted-foreground">
                    {deviceInfo.manufacturer} {deviceInfo.model}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">OS Version</h4>
                  <p className="text-sm text-muted-foreground">
                    {deviceInfo.osVersion}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Environment</h4>
                  <Badge variant={deviceInfo.isVirtual ? 'outline' : 'default'}>
                    {deviceInfo.isVirtual ? 'Simulator' : 'Physical Device'}
                  </Badge>
                </div>
              </>
            )}

            {appInfo && (
              <>
                <div className="space-y-2">
                  <h4 className="font-medium">App Version</h4>
                  <p className="text-sm text-muted-foreground">
                    {appInfo.version} (Build {appInfo.build})
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

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

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vibrate className="h-5 w-5" />
            Mobile Features
          </CardTitle>
          <CardDescription>
            Native mobile capabilities and preferences
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
    </div>
  );
};

export default MobileFeatures;