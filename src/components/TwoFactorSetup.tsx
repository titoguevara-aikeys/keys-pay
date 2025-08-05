import React, { useState } from 'react';
import { QrCode, Smartphone, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const TwoFactorSetup: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock QR code URL and secret
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AIKEYS%20Wallet:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=AIKEYS';
  const secret = 'JBSWY3DPEHPK3PXP';

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast({
      title: 'Secret copied',
      description: 'Manual entry secret has been copied to clipboard',
    });
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      // Mock verification - in real app, verify with backend
      const mockBackupCodes = [
        'ABC123DEF',
        'GHI456JKL',
        'MNO789PQR',
        'STU012VWX',
        'YZA345BCD',
      ];
      setBackupCodes(mockBackupCodes);
      setStep('verify');
      
      toast({
        title: '2FA enabled successfully!',
        description: 'Two-factor authentication is now active on your account',
      });
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aikeys-wallet-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'verify' && backupCodes.length > 0) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Check className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="text-lg font-medium">2FA Setup Complete!</h3>
          <p className="text-sm text-muted-foreground">
            Save these backup codes in a secure location
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Backup Codes</CardTitle>
            <CardDescription className="text-xs">
              Use these codes if you lose access to your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 text-center font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-muted rounded">
                  {code}
                </div>
              ))}
            </div>
            <Button 
              onClick={downloadBackupCodes} 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
            >
              Download Backup Codes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {step === 'setup' && (
        <>
          <div className="text-center space-y-4">
            <h3 className="font-medium">Set up 2FA</h3>
            <p className="text-sm text-muted-foreground">
              Scan the QR code with your authenticator app
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <img 
                src={qrCodeUrl} 
                alt="2FA QR Code" 
                className="border rounded-lg"
                width={200}
                height={200}
              />
            </div>
            
            {/* Manual Entry */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Or enter this code manually:
              </p>
              <div className="flex items-center gap-2">
                <Input 
                  value={secret} 
                  readOnly 
                  className="text-center font-mono text-sm"
                />
                <Button onClick={copySecret} variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button onClick={() => setStep('verify')} className="w-full">
            <Smartphone className="h-4 w-4 mr-2" />
            Continue to Verification
          </Button>
        </>
      )}
      
      {step === 'verify' && (
        <>
          <div className="text-center space-y-4">
            <h3 className="font-medium">Enter Verification Code</h3>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
            
            <Input
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleVerify} 
              className="w-full"
              disabled={verificationCode.length !== 6}
            >
              Verify & Enable 2FA
            </Button>
            <Button 
              onClick={() => setStep('setup')} 
              variant="outline" 
              className="w-full"
            >
              Back to Setup
            </Button>
          </div>
        </>
      )}
    </div>
  );
};