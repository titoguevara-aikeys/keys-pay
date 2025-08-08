/*
 * AIKEYS FINANCIAL PLATFORM - BIOMETRIC AUTHENTICATION
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * FIDO2/WebAuthn Implementation for Passwordless Authentication
 * Hardware-backed security with platform authenticators
 */

import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { SecurityCore } from '@/utils/securityCore';

interface BiometricCredential {
  id: string;
  type: 'platform' | 'cross-platform';
  name: string;
  createdAt: string;
  lastUsed?: string;
}

export const BiometricAuth: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [platformType, setPlatformType] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    checkWebAuthnSupport();
    loadExistingCredentials();
  }, []);

  const checkWebAuthnSupport = async () => {
    if (!window.PublicKeyCredential) {
      setIsSupported(false);
      return;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsSupported(available);
      
      // Detect platform type
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        setPlatformType('Face ID / Touch ID');
      } else if (userAgent.includes('android')) {
        setPlatformType('Fingerprint / Face Unlock');
      } else if (userAgent.includes('windows')) {
        setPlatformType('Windows Hello');
      } else if (userAgent.includes('mac')) {
        setPlatformType('Touch ID');
      } else {
        setPlatformType('Biometric Authentication');
      }
    } catch (error) {
      console.error('WebAuthn support check failed:', error);
      setIsSupported(false);
    }
  };

  const loadExistingCredentials = () => {
    const stored = localStorage.getItem('aikeys_biometric_credentials');
    if (stored) {
      const creds = JSON.parse(stored);
      setCredentials(creds);
      setIsEnrolled(creds.length > 0);
    }
  };

  const enrollBiometric = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Biometric authentication is not available on this device.",
        variant: "destructive",
      });
      return;
    }

    setIsEnrolling(true);

    try {
      // Generate challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(64));

      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: "AIKEYS Financial Platform",
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: "user@aikeys.ai", // This should come from actual user data
            displayName: "AIKEYS User",
          },
          pubKeyCredParams: [
            {
              alg: -7, // ES256
              type: "public-key",
            },
            {
              alg: -257, // RS256
              type: "public-key",
            },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: "direct",
        },
      };

      const credential = await navigator.credentials.create(credentialCreationOptions) as PublicKeyCredential;

      if (credential) {
        const newCredential: BiometricCredential = {
          id: credential.id,
          type: 'platform',
          name: `${platformType} - ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
        };

        const updatedCredentials = [...credentials, newCredential];
        setCredentials(updatedCredentials);
        setIsEnrolled(true);
        
        localStorage.setItem('aikeys_biometric_credentials', JSON.stringify(updatedCredentials));

        toast({
          title: "Biometric Authentication Enabled",
          description: "Your biometric authentication has been successfully set up.",
        });
      }
    } catch (error: any) {
      console.error('Biometric enrollment failed:', error);
      
      let errorMessage = "Failed to set up biometric authentication.";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Biometric authentication was cancelled or not allowed.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "Biometric authentication is not supported on this device.";
      }

      toast({
        title: "Enrollment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const authenticateWithBiometric = async () => {
    if (!isEnrolled || credentials.length === 0) {
      toast({
        title: "Not Enrolled",
        description: "Please set up biometric authentication first.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticating(true);

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      
      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          allowCredentials: credentials.map(cred => ({
            id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
            type: "public-key",
          })),
          userVerification: "required",
          timeout: 60000,
        },
      };

      const assertion = await navigator.credentials.get(credentialRequestOptions);

      if (assertion) {
        // Update last used timestamp
        const updatedCredentials = credentials.map(cred => 
          cred.id === assertion.id ? { ...cred, lastUsed: new Date().toISOString() } : cred
        );
        setCredentials(updatedCredentials);
        localStorage.setItem('aikeys_biometric_credentials', JSON.stringify(updatedCredentials));

        toast({
          title: "Authentication Successful",
          description: "You have been authenticated using biometrics.",
        });

        return true;
      }
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      let errorMessage = "Biometric authentication failed.";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Biometric authentication was cancelled.";
      }

      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }

    return false;
  };

  const removeCredential = (credentialId: string) => {
    const updatedCredentials = credentials.filter(cred => cred.id !== credentialId);
    setCredentials(updatedCredentials);
    setIsEnrolled(updatedCredentials.length > 0);
    localStorage.setItem('aikeys_biometric_credentials', JSON.stringify(updatedCredentials));

    toast({
      title: "Credential Removed",
      description: "Biometric credential has been removed.",
    });
  };

  if (!isSupported) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            Biometric Authentication Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Biometric authentication is not supported on this device or browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={isEnrolled ? "border-green-500/20 bg-green-500/5" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              Biometric Authentication
            </div>
            {isEnrolled && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            Platform: {platformType}
          </div>

          {!isEnrolled ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enable biometric authentication for fast and secure access to your account.
                This uses your device's built-in security features.
              </p>
              
              <Button 
                onClick={enrollBiometric} 
                disabled={isEnrolling}
                className="w-full"
              >
                {isEnrolling ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-spin" />
                    Setting up biometric authentication...
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Enable Biometric Authentication
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Biometric authentication is active. You can use it to quickly access your account.
              </p>

              <div className="space-y-2">
                {credentials.map((credential) => (
                  <div 
                    key={credential.id} 
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{credential.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(credential.createdAt).toLocaleDateString()}
                        {credential.lastUsed && (
                          <span className="ml-2">
                            Last used: {new Date(credential.lastUsed).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCredential(credential.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={authenticateWithBiometric} 
                  disabled={isAuthenticating}
                  variant="outline"
                  className="flex-1"
                >
                  {isAuthenticating ? (
                    <>
                      <Shield className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Test Authentication
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={enrollBiometric} 
                  disabled={isEnrolling}
                  variant="outline"
                >
                  Add Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};