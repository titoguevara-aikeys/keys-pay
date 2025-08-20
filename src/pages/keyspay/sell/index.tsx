'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, AlertCircle, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OffRampSession {
  provider: string;
  sessionId: string;
  checkoutUrl: string;
  ref: string;
  status: string;
  expiresAt: string;
  disclaimer: string;
  merchantOfRecord: string;
}

export default function SellCrypto() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<OffRampSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    asset: 'USDT',
    assetAmount: 1000,
    payoutCurrency: 'AED',
    country: 'AE',
    payoutMethod: 'bank_transfer' as 'bank_transfer' | 'card' | 'mobile_money'
  });

  const supportedAssets = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { code: 'USDT', name: 'Tether USD', icon: '₮' },
    { code: 'USDC', name: 'USD Coin', icon: '$' }
  ];

  const supportedCurrencies = [
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' }
  ];

  const payoutMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', description: 'Direct to your bank account' },
    { value: 'card', label: 'Card Payout', description: 'To debit/credit card' },
    { value: 'mobile_money', label: 'Mobile Money', description: 'Mobile wallet transfer' }
  ];

  const handleStartOffRamp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/keyspay/ramp/offramp/session', {
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
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TrendingDown className="h-8 w-8 text-orange-500" />
          Sell Cryptocurrency
        </h1>
        <p className="text-muted-foreground">
          Convert your crypto to fiat currency through our trusted partners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sale Details
              <Badge variant="secondary">Powered by Guardarian</Badge>
            </CardTitle>
            <CardDescription>
              Enter your sale details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="assetAmount">Amount</Label>
                <Input
                  id="assetAmount"
                  type="number"
                  min="10"
                  max="1000"
                  step="0.01"
                  value={formData.assetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetAmount: Number(e.target.value) }))}
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutCurrency">Payout Currency</Label>
              <Select 
                value={formData.payoutCurrency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, payoutCurrency: value }))}
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
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <Select 
                value={formData.payoutMethod} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, payoutMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payoutMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex flex-col">
                        <span>{method.label}</span>
                        <span className="text-xs text-muted-foreground">{method.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStartOffRamp} 
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
                  Start Sale
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
                  Your sale session has been created successfully
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
              <CardTitle>Payout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Merchant of Record:</strong> All cryptocurrency sales are processed by Guardarian, 
                  our licensed partner. Keys Pay acts as a technology platform only.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-muted-foreground">
                <p>• Minimum sale: 10 {formData.asset}</p>
                <p>• Maximum sale: 1,000 {formData.asset} per transaction</p>
                <p>• KYC verification required</p>
                <p>• Processing time: 1-24 hours</p>
                <p>• Payout time: 1-3 business days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Exchange rates are provided by Guardarian and subject to market conditions. 
                  Final rates are locked at the time of transaction completion.
                </AlertDescription>
              </Alert>
              <div className="text-muted-foreground">
                <p>• Real-time market rates</p>
                <p>• Competitive spreads</p>
                <p>• Transparent fee structure</p>
                <p>• Rate protection during KYC</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Disclaimer:</strong> Virtual asset services are provided by Guardarian, an independent licensed partner. 
          Keys Pay operates as a technology platform only and does not custody, exchange, or process virtual assets. 
          All transactions are subject to Guardarian's terms and conditions.
        </p>
      </div>
    </div>
  );
}