import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/integrations/supabase/client';

// Minimal Sumsub WebSDK integration using CDN builder
// Loads script on demand and mounts SDK into a container

declare global {
  interface Window {
    snsWebSdk?: any;
  }
}

const loadSdkScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.snsWebSdk) return resolve();
    const script = document.createElement('script');
    script.src = 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Sumsub WebSDK'));
    document.body.appendChild(script);
  });
};

export const SumsubKYC: React.FC = () => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelName, setLevelName] = useState<string>('basic-kyc-level');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('sumsub-issue-token', {
      body: { levelName, applicantEmail: email || undefined, applicantPhone: phone || undefined },
    });
    if (error) throw error;
    return data?.token as string;
  }, [levelName, email, phone]);

  const launchKyc = useCallback(async () => {
    if (!user) {
      setError('Please sign in first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await loadSdkScript();
      const token = await getAccessToken();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snsWebSdk: any = (window as any).snsWebSdk;
      if (!snsWebSdk) throw new Error('Sumsub SDK not available');

      const instance = snsWebSdk
        .init(token, async () => {
          // token refresh
          const fresh = await getAccessToken();
          return fresh;
        })
        .withConf({
          lang: 'en',
          email: email || undefined,
          phone: phone || undefined,
        })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        .on('idCheck.onStepCompleted', (payload: unknown) => {
          console.log('Sumsub step completed', payload);
        })
        .on('idCheck.onError', (payload: unknown) => {
          console.error('Sumsub error', payload);
        });

      instance.mount('#sumsub-websdk-container');
    } catch (e: any) {
      setError(e?.message || 'Failed to start KYC');
    } finally {
      setLoading(false);
    }
  }, [user, email, phone, levelName, getAccessToken]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      const container = containerRef.current;
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Level Name</Label>
            <Input value={levelName} onChange={(e) => setLevelName(e.target.value)} placeholder="basic-kyc-level" />
          </div>
          <div className="space-y-2">
            <Label>Email (optional)</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="applicant@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone (optional)</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
          </div>
        </div>
        <Button onClick={launchKyc} disabled={loading}>
          {loading ? 'Starting…' : 'Start KYC'}
        </Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div id="sumsub-websdk-container" ref={containerRef} className="min-h-[480px] w-full" />
      </CardContent>
    </Card>
  );
};

export default SumsubKYC;
