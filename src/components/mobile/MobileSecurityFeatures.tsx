import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Smartphone,
  Wifi,
  Eye,
  Key,
  Fingerprint
} from 'lucide-react';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'checking';
  icon: React.ElementType;
  details?: string;
}

const MobileSecurityFeatures: React.FC = () => {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceTrustScore, setDeviceTrustScore] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeSecurityChecks();
  }, []);

  const initializeSecurityChecks = async () => {
    setIsScanning(true);
    
    // Simulate security checks
    const checks: SecurityCheck[] = [
      {
        id: 'device_integrity',
        name: 'Device Integrity',
        description: 'Checking for jailbreak/root detection',
        status: 'checking',
        icon: Shield,
      },
      {
        id: 'app_signature',
        name: 'App Signature',
        description: 'Verifying app authenticity',
        status: 'checking',
        icon: Key,
      },
      {
        id: 'network_security',
        name: 'Network Security',
        description: 'Checking SSL certificate pinning',
        status: 'checking',
        icon: Wifi,
      },
      {
        id: 'biometric_available',
        name: 'Biometric Authentication',
        description: 'Checking biometric capabilities',
        status: 'checking',
        icon: Fingerprint,
      },
      {
        id: 'screen_recording',
        name: 'Screen Protection',
        description: 'Detecting screen recording/screenshots',
        status: 'checking',
        icon: Eye,
      },
      {
        id: 'secure_storage',
        name: 'Secure Storage',
        description: 'Verifying encrypted storage',
        status: 'checking',
        icon: Lock,
      }
    ];

    setSecurityChecks(checks);

    // Simulate progressive check completion
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSecurityChecks(prev => prev.map((check, index) => {
        if (index === i) {
          // Simulate different outcomes
          const outcomes: SecurityCheck['status'][] = ['passed', 'passed', 'passed', 'warning', 'passed', 'passed'];
          const details = [
            'Device integrity verified - no jailbreak/root detected',
            'App signature is valid and verified',
            'SSL certificate pinning is active',
            'Biometric authentication is available but not configured',
            'Screen recording protection is active',
            'Data is encrypted in secure storage'
          ];
          
          return {
            ...check,
            status: outcomes[i],
            details: details[i]
          };
        }
        return check;
      }));
    }

    // Calculate trust score
    setTimeout(() => {
      const passedChecks = checks.filter((_, i) => i < 6).reduce((acc, _, i) => {
        const outcomes = ['passed', 'passed', 'passed', 'warning', 'passed', 'passed'];
        return acc + (outcomes[i] === 'passed' ? 20 : outcomes[i] === 'warning' ? 10 : 0);
      }, 0);
      
      setDeviceTrustScore(passedChecks);
      setIsScanning(false);
      
      toast({
        title: "Security Scan Complete",
        description: `Device trust score: ${passedChecks}/100`,
      });
    }, 5000);
  };

  const handleRescanSecurity = () => {
    initializeSecurityChecks();
  };

  const handleEnableBiometric = () => {
    toast({
      title: "Biometric Setup",
      description: "Biometric authentication setup would open here.",
    });
  };

  const handleSecureMode = () => {
    toast({
      title: "Secure Mode Activated",
      description: "Enhanced security features enabled.",
    });
  };

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'checking':
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Secure</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Mobile Security Overview
          </CardTitle>
          <CardDescription>
            Real-time security monitoring and threat detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Device Trust Score</h3>
              <p className="text-sm text-muted-foreground">Based on security checks</p>
            </div>
            <div className={`text-3xl font-bold ${getTrustScoreColor(deviceTrustScore)}`}>
              {deviceTrustScore}/100
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRescanSecurity} 
              disabled={isScanning}
              className="flex-1"
            >
              {isScanning ? 'Scanning...' : 'Rescan Security'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSecureMode}
              className="flex-1"
            >
              Secure Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Security Checks</CardTitle>
          <CardDescription>
            Comprehensive security validation for your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecks.map((check) => (
              <div key={check.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <check.icon className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{check.name}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{check.description}</p>
                  {check.details && (
                    <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                      {check.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Improve your security posture with these recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityChecks.some(check => check.status === 'warning') && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some security features need attention. Enable biometric authentication for enhanced security.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <span className="text-sm">Enable Biometric Authentication</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleEnableBiometric}>
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm">Auto-lock on app background</span>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm">Screenshot protection</span>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SAMA Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>SAMA Compliance</CardTitle>
          <CardDescription>
            Saudi Arabian Monetary Authority compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Customer Authentication</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Encryption</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Transaction Security</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Audit Trail</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSecurityFeatures;