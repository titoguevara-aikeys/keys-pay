import React, { createContext, useContext, useEffect, useState } from 'react';
import { MobileCapabilities } from '@/lib/mobile';

interface MobileContextType {
  isMobile: boolean;
  deviceInfo: any;
  appInfo: any;
  sendNotification: (title: string, body: string) => Promise<void>;
  hapticFeedback: (style?: 'light' | 'medium' | 'heavy') => Promise<void>;
  biometricAuth: () => Promise<boolean>;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  useEffect(() => {
    const initMobile = async () => {
      const mobile = MobileCapabilities.isMobile();
      setIsMobile(mobile);

      if (mobile) {
        await MobileCapabilities.initializeApp();
        const device = await MobileCapabilities.getDeviceInfo();
        const app = await MobileCapabilities.getAppInfo();
        setDeviceInfo(device);
        setAppInfo(app);
      } else {
        // Request web notification permission for PWA
        await MobileCapabilities.requestWebNotificationPermission();
      }
    };

    initMobile();
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await MobileCapabilities.sendLocalNotification(title, body);
  };

  const hapticFeedback = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    await MobileCapabilities.hapticFeedback(style);
  };

  const biometricAuth = async (): Promise<boolean> => {
    return await MobileCapabilities.biometricAuth();
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        deviceInfo,
        appInfo,
        sendNotification,
        hapticFeedback,
        biometricAuth,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};