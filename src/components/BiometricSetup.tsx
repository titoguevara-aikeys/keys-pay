import React, { useState } from 'react';
import { Fingerprint, Smartphone, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const BiometricSetup: React.FC = () => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const { toast } = useToast();

  const startBiometricEnrollment = async () => {
    setIsEnrolling(true);
    
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn not supported');
      }

      // Create credential options
      const options = {
        challenge: new Uint8Array(32),
        rp: {
          name: "AIKEYS Wallet",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" as const }],
        authenticatorSelection: {
          authenticatorAttachment: "platform" as const,
          userVerification: "required" as const,
        },
        timeout: 60000,
        attestation: "direct" as const,
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      if (credential) {
        setEnrolled(true);
        toast({
          title: 'Biometric authentication enabled!',
          description: 'You can now use your fingerprint or face to sign in',
        });
      }
    } catch (error: any) {
      console.error('Biometric enrollment failed:', error);
      
      let message = 'Failed to set up biometric authentication';
      if (error.name === 'NotSupportedError') {
        message = 'Biometric authentication is not supported on this device';
      } else if (error.name === 'NotAllowedError') {
        message = 'Biometric authentication was cancelled or not allowed';
      }
      
      toast({
        title: 'Setup failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (enrolled) {
    return (
      <div className="space-y-4 text-center">
        <Check className="h-12 w-12 text-green-600 mx-auto" />
        <div>
          <h3 className="font-medium">Biometric authentication enabled!</h3>
          <p className="text-sm text-muted-foreground">
            You can now use your biometric data to sign in
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Test Biometric Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <Fingerprint className="h-12 w-12 text-primary mx-auto" />
        <div>
          <h3 className="font-medium">Enable Biometric Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Use your fingerprint or face recognition for secure access
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Enhanced Security</p>
                <p className="text-xs text-muted-foreground">
                  More secure than passwords alone
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Convenient Access</p>
                <p className="text-xs text-muted-foreground">
                  Quick and easy authentication
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={startBiometricEnrollment} 
        disabled={isEnrolling}
        className="w-full"
      >
        {isEnrolling ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Setting up...
          </>
        ) : (
          <>
            <Fingerprint className="h-4 w-4 mr-2" />
            Enable Biometric Authentication
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your biometric data is stored securely on your device and never shared
      </p>
    </div>
  );
};