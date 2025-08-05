import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  ArrowRight, 
  Clock, 
  Shield, 
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
  transferTime: string;
  fee: number;
}

const supportedCountries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸', transferTime: '1-2 hours', fee: 2.99 },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧', transferTime: '2-4 hours', fee: 3.49 },
  { code: 'EU', name: 'European Union', currency: 'EUR', flag: '🇪🇺', transferTime: '1-3 hours', fee: 2.99 },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦', transferTime: '2-6 hours', fee: 3.99 },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺', transferTime: '4-8 hours', fee: 4.99 },
  { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵', transferTime: '1-4 hours', fee: 3.99 },
  { code: 'SG', name: 'Singapore', currency: 'SGD', flag: '🇸🇬', transferTime: '30 mins-2 hours', fee: 2.49 },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰', transferTime: '30 mins-1 hour', fee: 1.99 },
  { code: 'TH', name: 'Thailand', currency: 'THB', flag: '🇹🇭', transferTime: '2-6 hours', fee: 4.49 },
  { code: 'BR', name: 'Brazil', currency: 'BRL', flag: '🇧🇷', transferTime: '4-12 hours', fee: 5.99 },
];

const exchangeRates = {
  'USD': 1.00,
  'GBP': 0.79,
  'EUR': 0.85,
  'CAD': 1.35,
  'AUD': 1.52,
  'JPY': 149.50,
  'SGD': 1.34,
  'HKD': 7.83,
  'THB': 35.80,
  'BRL': 5.12,
};

export const InternationalTransfer = () => {
  const { toast } = useToast();
  const [fromCrypto, setFromCrypto] = useState('');
  const [toCountry, setToCountry] = useState<Country | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [purpose, setPurpose] = useState('');

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', rate: 39680.50 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', rate: 2321.85 },
    { symbol: 'USDT', name: 'Tether', icon: '₮', rate: 1.00 },
    { symbol: 'USDC', name: 'USD Coin', icon: '$', rate: 1.00 },
  ];

  const calculateFiatAmount = (cryptoAmt: string, cryptoSymbol: string, targetCurrency: string) => {
    if (!cryptoAmt || !cryptoSymbol || !targetCurrency) return '';
    
    const crypto = cryptoAssets.find(c => c.symbol === cryptoSymbol);
    if (!crypto) return '';
    
    const usdValue = parseFloat(cryptoAmt) * crypto.rate;
    const rate = exchangeRates[targetCurrency as keyof typeof exchangeRates];
    return (usdValue * rate).toFixed(2);
  };

  const handleCryptoAmountChange = (value: string) => {
    setCryptoAmount(value);
    if (toCountry && fromCrypto) {
      setFiatAmount(calculateFiatAmount(value, fromCrypto, toCountry.currency));
    }
  };

  const handleTransfer = () => {
    if (!fromCrypto || !toCountry || !cryptoAmount || !recipientName || !recipientAccount) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transfer Initiated",
      description: `Sending ${cryptoAmount} ${fromCrypto} to ${toCountry.name}. Estimated arrival: ${toCountry.transferTime}`,
    });

    // Reset form
    setCryptoAmount('');
    setFiatAmount('');
    setRecipientName('');
    setRecipientAccount('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            International Transfer
          </CardTitle>
          <CardDescription>
            Send crypto globally with instant fiat conversion
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Money Worldwide</CardTitle>
          <CardDescription>
            Convert your crypto to fiat and transfer to bank accounts globally
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">From (Crypto)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cryptocurrency</label>
                <Select value={fromCrypto} onValueChange={setFromCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crypto" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoAssets.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{crypto.icon}</span>
                          <span>{crypto.name} ({crypto.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  placeholder="0.00"
                  value={cryptoAmount}
                  onChange={(e) => handleCryptoAmountChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-2 rounded-full bg-muted">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">To (Fiat)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Country</label>
                <Select 
                  value={toCountry?.code || ''} 
                  onValueChange={(value) => {
                    const country = supportedCountries.find(c => c.code === value);
                    setToCountry(country || null);
                    if (country && fromCrypto && cryptoAmount) {
                      setFiatAmount(calculateFiatAmount(cryptoAmount, fromCrypto, country.currency));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name} ({country.currency})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ({toCountry?.currency || 'XXX'})</label>
                <Input
                  placeholder="0.00"
                  value={fiatAmount}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {toCountry && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-sm font-medium">Transfer Time</div>
                    <div className="text-xs text-muted-foreground">{toCountry.transferTime}</div>
                  </div>
                  <div>
                    <DollarSign className="h-5 w-5 mx-auto mb-2 text-green-500" />
                    <div className="text-sm font-medium">Fee</div>
                    <div className="text-xs text-muted-foreground">${toCountry.fee}</div>
                  </div>
                  <div>
                    <Shield className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                    <div className="text-sm font-medium">Security</div>
                    <div className="text-xs text-muted-foreground">Bank Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Recipient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="Recipient's full name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bank Account / Mobile Number</label>
                <Input
                  placeholder="Account details"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transfer Purpose</label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family Support</SelectItem>
                  <SelectItem value="business">Business Payment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleTransfer}
            disabled={!fromCrypto || !toCountry || !cryptoAmount || !recipientName || !recipientAccount}
          >
            Send Transfer
          </Button>
        </CardContent>
      </Card>

      {/* Supported Countries Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Countries</CardTitle>
          <CardDescription>
            Send money to these countries with competitive rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {supportedCountries.map((country) => (
              <div key={country.code} className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">{country.flag}</div>
                <div className="text-sm font-medium">{country.name}</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {country.currency}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};