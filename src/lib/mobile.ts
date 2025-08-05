import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';

export class MobileCapabilities {
  static async initializeApp() {
    if (this.isMobile()) {
      await this.setupNotifications();
      await this.setupAppListeners();
    }
  }

  static isMobile(): boolean {
    return typeof (window as any).Capacitor !== 'undefined';
  }

  static async getDeviceInfo() {
    if (!this.isMobile()) return null;
    
    try {
      const info = await Device.getInfo();
      return {
        platform: info.platform,
        osVersion: info.osVersion,
        model: info.model,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  static async hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.isMobile()) return;
    
    try {
      let impactStyle: ImpactStyle;
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
        default:
          impactStyle = ImpactStyle.Light;
      }
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  }

  static async setupNotifications() {
    if (!this.isMobile()) return;

    try {
      // Request permission for local notifications
      const localPermission = await LocalNotifications.requestPermissions();
      console.log('Local notification permission:', localPermission);

      // Request permission for push notifications
      const pushPermission = await PushNotifications.requestPermissions();
      console.log('Push notification permission:', pushPermission);

      if (pushPermission.receive === 'granted') {
        await PushNotifications.register();
      }

      // Set up push notification listeners
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Here you would typically send the token to your backend
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
        // Handle notification when app is in foreground
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification);
        // Handle notification tap
      });

    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

  static async setupAppListeners() {
    if (!this.isMobile()) return;

    try {
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        // Handle app state changes (background/foreground)
      });

      App.addListener('appUrlOpen', (data) => {
        console.log('App opened with URL:', data);
        // Handle deep links
      });

      App.addListener('appRestoredResult', (data) => {
        console.log('Restored state:', data);
        // Handle app restoration
      });

    } catch (error) {
      console.error('Error setting up app listeners:', error);
    }
  }

  static async sendLocalNotification(title: string, body: string, id?: number) {
    if (!this.isMobile()) {
      // Fallback for web
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: id || Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  static async requestWebNotificationPermission() {
    if (!this.isMobile() && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  static async biometricAuth(): Promise<boolean> {
    // This would integrate with @capacitor-community/biometric
    // For now, we'll simulate biometric authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate biometric auth success/failure
        const success = Math.random() > 0.2; // 80% success rate
        resolve(success);
      }, 1500);
    });
  }

  static async getAppInfo() {
    if (!this.isMobile()) return null;

    try {
      const info = await App.getInfo();
      return {
        name: info.name,
        id: info.id,
        build: info.build,
        version: info.version,
      };
    } catch (error) {
      console.error('Error getting app info:', error);
      return null;
    }
  }

  static async exitApp() {
    if (!this.isMobile()) return;

    try {
      await App.exitApp();
    } catch (error) {
      console.error('Error exiting app:', error);
    }
  }
}