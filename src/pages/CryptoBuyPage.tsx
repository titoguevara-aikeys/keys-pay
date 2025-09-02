import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ExternalLink, 
  AlertCircle,
  Info,
  Shield,
  Clock
} from 'lucide-react';

interface Quote {
  quote_id: string;
  side: 'buy' | 'sell';
  fiat_currency: string;
  crypto_currency: string;
  fiat_amount: number;
  crypto_amount: number;
  exchange_rate: number;
  fees: number;
  net_amount: number;
  expires_at: string;
  provider: string;
  region: string;
}

const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin', symbol: '₿' },
  { value: 'ETH', label: 'Ethereum', symbol: 'Ξ' },
  { value: 'USDT', label: 'Tether', symbol: '₮' },
  { value: 'USDC', label: 'USD Coin', symbol: 'USDC' },
];

const fiatOptions = [
  { value: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
];

const CryptoBuyPage = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [fiatCurrency, setFiatCurrency] = useState('AED');
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleGetQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const response = await fetch('/api/crypto/quote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fiatAmount: parseFloat(amount),
          fiatCurrency,
          cryptoCurrency,
          side: activeTab,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get quote');
      }

      const data = await response.json();
      setQuote(data.quote);
    } catch (err) {
      console.error('Quote error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCheckout = async () => {
    if (!quote) return;

    setLoading(true);
    setError(null);

    try {
      // For demo, we'll use a mock organization ID
      const organizationId = 'demo-org-id';

      const response = await fetch('/api/crypto/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote_id: quote.quote_id,
          organization_id: organizationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout');
      }

      const data = await response.json();
      
      if (data.demo_mode) {
        setCheckoutUrl(data.checkout_url);
      } else {
        // In production, open the checkout URL
        window.open(data.checkout_url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCrypto = (amount: number, currency: string) => {
    return `${amount.toFixed(8)} ${currency}`;
  };

  const getTimeRemaining = (expiresAt: string) => {
    const expires = new Date(expiresAt);
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Buy & Sell Crypto</h1>
        <p className="text-muted-foreground">
          Powered by Guardarian • Keys Pay is an aggregator platform
        </p>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          GCC Licensed Aggregator
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trading Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crypto Exchange
              </CardTitle>
              <CardDescription>
                Buy and sell cryptocurrencies with instant quotes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Sell
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount to Spend</Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {fiatOptions.find(f => f.value === fiatCurrency)?.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fiat-currency">Currency</Label>
                      <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fiatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.symbol} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crypto-currency">Cryptocurrency</Label>
                    <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.symbol} {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGetQuote}
                    disabled={loading || !amount}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Getting Quote...' : 'Get Quote'}
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Sell functionality will be available soon. Currently supporting buy orders only.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {quote && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Quote Details</span>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeRemaining(quote.expires_at)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">You Pay</div>
                        <div className="text-lg font-semibold">
                          {formatCurrency(quote.fiat_amount, quote.fiat_currency)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">You Get</div>
                        <div className="text-lg font-semibold">
                          {formatCrypto(quote.crypto_amount, quote.crypto_currency)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exchange Rate</span>
                        <span>1 {quote.crypto_currency} = {formatCurrency(1/quote.exchange_rate, quote.fiat_currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fees</span>
                        <span>{formatCurrency(quote.fees, quote.fiat_currency)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(quote.net_amount, quote.fiat_currency)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleStartCheckout}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Starting...' : 'Continue to Checkout'}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {checkoutUrl && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-orange-700">
                      <Info className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Demo Mode Active</div>
                        <div className="text-sm">
                          In production, this would redirect to Guardarian's secure checkout.
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open(checkoutUrl, '_blank')}
                        >
                          View Demo Checkout
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="font-medium">Merchant of Record</div>
                <div className="text-muted-foreground">Guardarian OU, Estonia</div>
              </div>
              <div>
                <div className="font-medium">Regulation</div>
                <div className="text-muted-foreground">EU Licensed Money Service Business</div>
              </div>
              <div>
                <div className="font-medium">Keys Pay Role</div>
                <div className="text-muted-foreground">Aggregator platform - we don't hold funds</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Order</span>
                <span>50 AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Order</span>
                <span>50,000 AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Limit</span>
                <span>100,000 AED</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cryptoOptions.map((crypto) => (
                  <div key={crypto.value} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {crypto.symbol}
                    </span>
                    <span>{crypto.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CryptoBuyPage;