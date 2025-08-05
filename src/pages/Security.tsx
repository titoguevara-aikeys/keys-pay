import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Fingerprint, AlertTriangle, Settings, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { BiometricSetup } from '@/components/BiometricSetup';
import { SecurityAudit } from '@/components/SecurityAudit';
import { TrustedDevices } from '@/components/TrustedDevices';
import { SendAppLink } from '@/components/SendAppLink';
import { useSecuritySettings, useUpdateSecuritySettings } from '@/hooks/useSecuritySettings';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Security = () => {
  const { data: settings, isLoading } = useSecuritySettings();
  const updateSettings = useUpdateSecuritySettings();
  const [deviceSupport, setDeviceSupport] = useState({
    webauthn: false,
    touchid: false,
    faceid: false,
  });

  useEffect(() => {
    // Check device capabilities
    const checkCapabilities = async () => {
      const webauthnSupported = window.PublicKeyCredential !== undefined;
      setDeviceSupport({
        webauthn: webauthnSupported,
        touchid: webauthnSupported && /Mac|iPhone|iPad/.test(navigator.userAgent),
        faceid: webauthnSupported && /iPhone|iPad/.test(navigator.userAgent),
      });
    };
    
    checkCapabilities();
  }, []);

  const handleSettingToggle = async (setting: string, value: boolean) => {
    try {
      await updateSettings.mutateAsync({ [setting]: value });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Security</h1>
            <p className="text-muted-foreground mt-2">
              Protect your account with multi-layered security features
            </p>
          </div>
        </div>

        {/* Security Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>Overview of your current security configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  settings?.two_factor_enabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Two-Factor Auth</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  settings?.biometric_enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Biometric Auth</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.biometric_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  settings?.fraud_monitoring_enabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Fraud Monitoring</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.fraud_monitoring_enabled ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Configuration Tabs */}
        <Tabs defaultValue="authentication" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="authentication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                        <CardDescription>Add an extra layer of security</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={settings?.two_factor_enabled || false}
                      onCheckedChange={(checked) => handleSettingToggle('two_factor_enabled', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {settings?.two_factor_enabled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage 2FA Settings
                      </Button>
                    </div>
                  ) : (
                    <TwoFactorSetup />
                  )}
                </CardContent>
              </Card>

              {/* Biometric Authentication */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Biometric Authentication</CardTitle>
                        <CardDescription>Use fingerprint or face recognition</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={settings?.biometric_enabled || false}
                      onCheckedChange={(checked) => handleSettingToggle('biometric_enabled', checked)}
                      disabled={!deviceSupport.webauthn}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {deviceSupport.webauthn ? (
                    settings?.biometric_enabled ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Available Methods</span>
                          <div className="flex gap-2">
                            {deviceSupport.touchid && <Badge variant="outline">Touch ID</Badge>}
                            {deviceSupport.faceid && <Badge variant="outline">Face ID</Badge>}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Manage Biometrics
                        </Button>
                      </div>
                    ) : (
                      <BiometricSetup />
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Biometric authentication is not supported on this device
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fraud Monitoring */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Fraud Monitoring</CardTitle>
                        <CardDescription>Detect suspicious activities</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={settings?.fraud_monitoring_enabled || false}
                      onCheckedChange={(checked) => handleSettingToggle('fraud_monitoring_enabled', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Login Notifications</span>
                      <Switch
                        checked={settings?.login_notifications || false}
                        onCheckedChange={(checked) => handleSettingToggle('login_notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Suspicious Activity Alerts</span>
                      <Switch
                        checked={settings?.suspicious_activity_alerts || false}
                        onCheckedChange={(checked) => handleSettingToggle('suspicious_activity_alerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Device Verification Required</span>
                      <Switch
                        checked={settings?.device_verification_required || false}
                        onCheckedChange={(checked) => handleSettingToggle('device_verification_required', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Session Management</CardTitle>
                      <CardDescription>Control active sessions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Timeout</span>
                      <span className="text-sm font-medium">
                        {Math.floor((settings?.session_timeout_minutes || 480) / 60)}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Concurrent Sessions</span>
                      <span className="text-sm font-medium">
                        {settings?.max_concurrent_sessions || 5}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Active Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <TrustedDevices />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <SendAppLink />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <SecurityAudit />
          </TabsContent>
        </Tabs>
      </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Security;