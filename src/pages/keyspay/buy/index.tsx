'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnRampSession {
  provider: string;
  sessionId: string;
  checkoutUrl: string;
  ref: string;
  status: string;
  expiresAt: string;
  disclaimer: string;
  merchantOfRecord: string;
}

export default function BuyCrypto() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<OnRampSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fiatCurrency: 'AED',
    fiatAmount: 500,
    asset: 'BTC',
    country: 'AE'
  });

  const supportedCurrencies = [
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' }
  ];

  const supportedAssets = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { code: 'USDT', name: 'Tether USD', icon: '₮' },
    { code: 'USDC', name: 'USD Coin', icon: '$' }
  ];

  const handleStartOnRamp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/keyspay/ramp/onramp/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create session');
      }

      const sessionData = await response.json();
      setSession(sessionData);

      // Open checkout in new window
      if (sessionData.checkoutUrl) {
        window.open(sessionData.checkoutUrl, '_blank', 'width=800,height=600');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buy Cryptocurrency</h1>
        <p className="text-muted-foreground">
          Purchase crypto using fiat currency through our trusted partners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Purchase Details
              <Badge variant="secondary">Powered by Transak</Badge>
            </CardTitle>
            <CardDescription>
              Enter your purchase details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiatCurrency">Fiat Currency</Label>
                <Select 
                  value={formData.fiatCurrency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fiatCurrency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code} - {currency.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiatAmount">Amount</Label>
                <Input
                  id="fiatAmount"
                  type="number"
                  min="50"
                  max="50000"
                  value={formData.fiatAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, fiatAmount: Number(e.target.value) }))}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Cryptocurrency</Label>
              <Select 
                value={formData.asset} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, asset: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedAssets.map((asset) => (
                    <SelectItem key={asset.code} value={asset.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono">{asset.icon}</span>
                        <span>{asset.code} - {asset.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStartOnRamp} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Session...
                </>
              ) : (
                <>
                  Start Purchase
                  <ExternalLink className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {session && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Session Created</CardTitle>
                <CardDescription>
                  Your purchase session has been created successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <Badge variant="outline" className="font-mono">{session.ref}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Provider:</span>
                  <Badge>{session.provider}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{session.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expires:</span>
                  <span className="text-sm">{new Date(session.expiresAt).toLocaleString()}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(session.checkoutUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Checkout
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Merchant of Record:</strong> All cryptocurrency purchases are processed by Transak, 
                  our licensed partner. Keys Pay acts as a technology platform only.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-muted-foreground">
                <p>• Minimum purchase: {formData.fiatCurrency} 50</p>
                <p>• Maximum purchase: {formData.fiatCurrency} 50,000</p>
                <p>• KYC verification may be required</p>
                <p>• Processing time: 5-30 minutes</p>
                <p>• Supported payment methods: Card, Bank Transfer</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Licensed partner (Transak) handles all regulated activities</p>
              <p>✓ Industry-standard KYC/AML compliance</p>
              <p>✓ Secure payment processing</p>
              <p>✓ Real-time transaction monitoring</p>
              <p>✓ Dubai DED compliant aggregator model</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-muted-foreground mr-2">Powered by</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Transak</span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          <strong>Disclaimer:</strong> Virtual asset services are provided by Transak, an independent licensed partner. 
          Keys Pay is a technology platform operating as an aggregator under Dubai DED Commercial License (No. 1483958, CR No. 2558995). 
          Keys Pay does not custody client funds, issue financial products, or act as Merchant of Record. 
          All transactions are subject to Transak's terms and conditions.
        </p>
      </div>
    </div>
  );
}