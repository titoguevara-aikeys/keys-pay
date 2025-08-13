import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Fingerprint, 
  Bell, 
  QrCode, 
  Vibrate,
  Shield,
  Camera,
  Wifi,
  Battery,
  MapPin
} from 'lucide-react';

// Enhanced mobile capabilities using Capacitor
const MobileEnhancedFeatures: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize mobile features
    initializeMobileFeatures();
    
    // Network status listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializeMobileFeatures = async () => {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        // Get device info
        const { Device } = await import('@capacitor/device');
        const info = await Device.getInfo();
        setDeviceInfo(info);

        // Get battery info (if available)
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
        }
      } catch (error) {
        console.warn('Could not initialize mobile features:', error);
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      // Simple biometric simulation for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast({
          title: "Biometric Authentication Successful",
          description: "You have been authenticated using biometrics.",
        });
      } else {
        toast({
          title: "Biometric Authentication Failed",
          description: "Please try again or use alternative authentication.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Biometric Error",
        description: "Biometric authentication is not available on this device.",
        variant: "destructive",
      });
    }
  };

  const handleHapticFeedback = async (style: 'light' | 'medium' | 'heavy') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        
        let impactStyle;
        switch (style) {
          case 'light':
            impactStyle = ImpactStyle.Light;
            break;
          case 'medium':
            impactStyle = ImpactStyle.Medium;
            break;
          case 'heavy':
            impactStyle = ImpactStyle.Heavy;
            break;
        }
        
        await Haptics.impact({ style: impactStyle });
        toast({
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} Haptic`,
          description: "Haptic feedback triggered successfully.",
        });
      } else {
        // Web fallback - vibration API
        if ('vibrate' in navigator) {
          const duration = style === 'light' ? 50 : style === 'medium' ? 100 : 200;
          navigator.vibrate(duration);
        }
        toast({
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} Vibration`,
          description: "Vibration triggered (web fallback).",
        });
      }
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  };

  const handleQRScan = () => {
    toast({
      title: "QR Scanner",
      description: "QR code scanner would open here in native app.",
    });
  };

  const handlePushNotification = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Keys Pay',
              body: 'Test notification from Keys Pay mobile app!',
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) },
              sound: undefined,
              attachments: undefined,
              actionTypeId: '',
              extra: null
            }
          ]
        });
        
        toast({
          title: "Notification Scheduled",
          description: "Local notification will appear shortly.",
        });
      } else {
        // Web fallback
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Keys Pay', {
            body: 'Test notification from Keys Pay web app!',
            icon: '/favicon.ico'
          });
        } else if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('Keys Pay', {
              body: 'Test notification from Keys Pay web app!',
              icon: '/favicon.ico'
            });
          }
        }
        
        toast({
          title: "Web Notification",
          description: "Browser notification sent.",
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleCamera = () => {
    toast({
      title: "Camera Access",
      description: "Camera functionality would be available in native app.",
    });
  };

  const handleLocation = () => {
    toast({
      title: "Location Services",
      description: "Location services would be available in native app.",
    });
  };

  const mobileFeatures = [
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Touch ID / Face ID / Fingerprint authentication",
      action: handleBiometricAuth,
      available: true
    },
    {
      icon: Vibrate,
      title: "Haptic Feedback",
      description: "Tactile feedback for user interactions",
      action: () => handleHapticFeedback('medium'),
      available: true
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Local and push notifications",
      action: handlePushNotification,
      available: true
    },
    {
      icon: QrCode,
      title: "QR Code Scanner",
      description: "Scan QR codes for payments",
      action: handleQRScan,
      available: true
    },
    {
      icon: Camera,
      title: "Camera Access",
      description: "Document scanning and photo capture",
      action: handleCamera,
      available: true
    },
    {
      icon: MapPin,
      title: "Location Services",
      description: "GPS location for ATM finder and fraud prevention",
      action: handleLocation,
      available: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Status
          </CardTitle>
          <CardDescription>
            Current device information and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Network:</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            
            {batteryLevel !== null && (
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span className="text-sm">Battery:</span>
                <Badge variant="outline">{batteryLevel}%</Badge>
              </div>
            )}
            
            {deviceInfo && (
              <>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Platform:</span>
                  <Badge variant="outline">{deviceInfo.platform}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Model:</span>
                  <Badge variant="outline">{deviceInfo.model}</Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle>Native Mobile Features</CardTitle>
          <CardDescription>
            Enhanced capabilities available in the mobile app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mobileFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={feature.available ? "default" : "secondary"}>
                    {feature.available ? "Available" : "Coming Soon"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={feature.action}
                    disabled={!feature.available}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Haptic Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Haptic Feedback Test</CardTitle>
          <CardDescription>
            Test different intensities of haptic feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleHapticFeedback('light')}
              className="flex-1"
            >
              Light
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleHapticFeedback('medium')}
              className="flex-1"
            >
              Medium
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleHapticFeedback('heavy')}
              className="flex-1"
            >
              Heavy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileEnhancedFeatures;