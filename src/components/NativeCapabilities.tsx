import React, { useState, useEffect } from 'react';
import { 
  Camera, Vibrate, Bell, Wifi, Battery, Smartphone, 
  Share2, Download, FileText, MapPin, Shield, Fingerprint,
  Mic, Phone, Mail, Calendar, Clock, Sun, Moon, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface NativeCapabilitiesProps {
  className?: string;
}

interface DeviceInfo {
  platform: string;
  model: string;
  osVersion: string;
  appVersion: string;
  isNative: boolean;
}

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

const NativeCapabilities: React.FC<NativeCapabilitiesProps> = ({ className = '' }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    model: 'Unknown',
    osVersion: 'Unknown',
    appVersion: '1.0.0',
    isNative: false,
  });
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: navigator.onLine,
    connectionType: 'wifi',
  });
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({
    level: 0.8,
    isCharging: false,
  });
  const [permissions, setPermissions] = useState({
    camera: 'prompt',
    microphone: 'prompt',
    location: 'prompt',
    notifications: 'prompt',
  });

  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Check if running in Capacitor
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    if (isCapacitor) {
      loadDeviceInfo();
      loadBatteryInfo();
      checkPermissions();
    }

    // Listen for network changes
    const handleOnline = () => setNetworkStatus(prev => ({ ...prev, connected: true }));
    const handleOffline = () => setNetworkStatus(prev => ({ ...prev, connected: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadDeviceInfo = async () => {
    try {
      // Mock device info - in real app, use Capacitor Device plugin
      setDeviceInfo({
        platform: 'ios', // or 'android'
        model: 'iPhone 14',
        osVersion: '17.0',
        appVersion: '1.0.0',
        isNative: true,
      });
    } catch (error) {
      console.error('Error loading device info:', error);
    }
  };

  const loadBatteryInfo = async () => {
    try {
      // Mock battery info - in real app, use Capacitor Device plugin
      setBatteryInfo({
        level: Math.random(),
        isCharging: Math.random() > 0.5,
      });
    } catch (error) {
      console.error('Error loading battery info:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      // Mock permissions check - in real app, use Capacitor Permissions plugin
      setPermissions({
        camera: 'granted',
        microphone: 'granted',
        location: 'denied',
        notifications: 'granted',
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermission = async (permission: string) => {
    try {
      toast({
        title: `${permission} Permission`,
        description: `Requesting ${permission} permission...`,
      });
      
      // Mock permission request
      setTimeout(() => {
        setPermissions(prev => ({
          ...prev,
          [permission]: 'granted',
        }));
        toast({
          title: 'Permission Granted',
          description: `${permission} permission has been granted.`,
        });
      }, 1000);
    } catch (error) {
      toast({
        title: 'Permission Error',
        description: `Failed to request ${permission} permission.`,
        variant: 'destructive',
      });
    }
  };

  const takePhoto = async () => {
    try {
      toast({
        title: 'Camera',
        description: 'Opening camera...',
      });
      
      // Mock camera functionality - in real app, use Capacitor Camera plugin
      setTimeout(() => {
        toast({
          title: 'Photo Captured',
          description: 'Photo has been saved to gallery.',
        });
      }, 1500);
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Failed to access camera.',
        variant: 'destructive',
      });
    }
  };

  const getCurrentLocation = async () => {
    try {
      toast({
        title: 'Location',
        description: 'Getting current location...',
      });
      
      // Mock location - in real app, use Capacitor Geolocation plugin
      setTimeout(() => {
        toast({
          title: 'Location Found',
          description: 'Current location: Dubai, UAE',
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Location Error',
        description: 'Failed to get location.',
        variant: 'destructive',
      });
    }
  };

  const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      // Mock haptic feedback - in real app, use Capacitor Haptics plugin
      if ('vibrate' in navigator) {
        const duration = type === 'light' ? 50 : type === 'medium' ? 100 : 200;
        navigator.vibrate(duration);
      }
      
      toast({
        title: 'Haptic Feedback',
        description: `${type} haptic feedback triggered.`,
      });
    } catch (error) {
      console.error('Haptic error:', error);
    }
  };

  const shareContent = async () => {
    try {
      const shareData = {
        title: 'AIKEYS Financial Hub',
        text: 'Check out this amazing financial app!',
        url: 'https://aikeys.com',
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: 'Content Shared',
          description: 'Content has been shared successfully.',
        });
      } else {
        // Fallback for browsers without native share
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Link Copied',
          description: 'Link has been copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const scheduleNotification = async () => {
    try {
      toast({
        title: 'Notification Scheduled',
        description: 'You will receive a reminder in 5 seconds.',
      });
      
      // Mock local notification - in real app, use Capacitor Local Notifications plugin
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('AIKEYS Reminder', {
            body: 'Check your financial goals progress!',
            icon: '/favicon.ico',
          });
        }
      }, 5000);
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const getPermissionBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Granted</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Prompt</Badge>;
    }
  };

  const nativeFeatures = [
    {
      icon: Camera,
      title: 'Camera Access',
      description: 'Take photos for document uploads',
      action: takePhoto,
      permission: permissions.camera,
    },
    {
      icon: MapPin,
      title: 'Location Services',
      description: 'Find nearby ATMs and branches',
      action: getCurrentLocation,
      permission: permissions.location,
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive transaction alerts',
      action: scheduleNotification,
      permission: permissions.notifications,
    },
    {
      icon: Vibrate,
      title: 'Haptic Feedback',
      description: 'Tactile response for actions',
      action: () => triggerHaptic('medium'),
      permission: 'granted',
    },
    {
      icon: Share2,
      title: 'Native Sharing',
      description: 'Share app content',
      action: shareContent,
      permission: 'granted',
    },
    {
      icon: Fingerprint,
      title: 'Biometric Auth',
      description: 'Secure login with biometrics',
      action: () => toast({ title: 'Biometric Auth', description: 'Biometric authentication activated!' }),
      permission: 'granted',
    },
  ];

  if (!isMobile) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <Smartphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">Mobile Features</h3>
          <p className="text-muted-foreground">
            This section is optimized for mobile devices. Please view on a mobile device to see all features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Status
          </CardTitle>
          <CardDescription>
            Current device information and connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${networkStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium">Network</p>
                <p className="text-sm text-muted-foreground">
                  {networkStatus.connected ? 'Connected' : 'Offline'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Battery className={`h-5 w-5 ${batteryInfo.level > 0.2 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium">Battery</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(batteryInfo.level * 100)}% {batteryInfo.isCharging ? '(Charging)' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Platform</p>
                <p className="text-sm text-muted-foreground">
                  {deviceInfo.platform} {deviceInfo.osVersion}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Native Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Native Features
          </CardTitle>
          <CardDescription>
            Access device capabilities and native functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nativeFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPermissionBadge(feature.permission)}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={feature.permission === 'granted' ? feature.action : () => requestPermission(feature.title.toLowerCase())}
                  >
                    {feature.permission === 'granted' ? 'Use' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Haptic Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Haptic Feedback Testing</CardTitle>
          <CardDescription>Test different types of haptic feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => triggerHaptic('light')}>
              Light
            </Button>
            <Button variant="outline" onClick={() => triggerHaptic('medium')}>
              Medium
            </Button>
            <Button variant="outline" onClick={() => triggerHaptic('heavy')}>
              Heavy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NativeCapabilities;