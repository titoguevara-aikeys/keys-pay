import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowDownUp, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Zap,
  RefreshCw,
  CreditCard,
  Wallet,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionRate {
  from: string;
  to: string;
  rate: number;
  change24h: number;
}

interface FiatCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', balance: 0.05432, rate: 43250.00 },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: 1.2456, rate: 2580.75 },
  { symbol: 'USDT', name: 'Tether', icon: '₮', balance: 1250.00, rate: 1.00 },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', balance: 850.75, rate: 1.00 },
];

const fiatCurrencies: FiatCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
];

const exchangeRates: { [key: string]: number } = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.24,
};

interface CryptoToFiatConverterProps {
  onConvert: (fromCrypto: string, toFiat: string, amount: string) => void;
}

export const CryptoToFiatConverter = ({ onConvert }: CryptoToFiatConverterProps) => {
  const { toast } = useToast();
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toFiat, setToFiat] = useState('USD');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [conversionStep, setConversionStep] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const selectedCrypto = cryptoAssets.find(c => c.symbol === fromCrypto);
  const selectedFiat = fiatCurrencies.find(f => f.code === toFiat);
  const exchangeRate = exchangeRates[toFiat] || 1;

  useEffect(() => {
    if (cryptoAmount && selectedCrypto) {
      const usdValue = parseFloat(cryptoAmount) * selectedCrypto.rate;
      const convertedAmount = usdValue * exchangeRate;
      setFiatAmount(convertedAmount.toFixed(2));
    } else {
      setFiatAmount('');
    }
  }, [cryptoAmount, fromCrypto, toFiat, selectedCrypto, exchangeRate]);

  const handleConvert = async () => {
    if (!cryptoAmount || !selectedCrypto || !selectedFiat) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select currencies",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(cryptoAmount);
    if (amount > selectedCrypto.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${selectedCrypto.balance} ${fromCrypto}`,
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConversionStep(0);

    // Simulate conversion process
    const steps = [
      "Validating transaction...",
      "Converting crypto to USD...",
      "Processing currency exchange...",
      "Updating your wallet balance...",
      "Conversion completed!"
    ];

    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setConversionStep(i + 1);
        if (i === steps.length - 1) {
          setIsConverting(false);
          onConvert(fromCrypto, toFiat, cryptoAmount);
          setCryptoAmount('');
          setFiatAmount('');
          setConversionStep(0);
        }
      }, (i + 1) * 800);
    }
  };

  const swapCurrencies = () => {
    // For demo purposes, swap between crypto and reset
    const cryptoSymbols = cryptoAssets.map(c => c.symbol);
    const currentIndex = cryptoSymbols.indexOf(fromCrypto);
    const nextIndex = (currentIndex + 1) % cryptoSymbols.length;
    setFromCrypto(cryptoSymbols[nextIndex]);
  };

  const conversionSteps = [
    "Validating transaction...",
    "Converting crypto to USD...", 
    "Processing currency exchange...",
    "Updating your wallet balance...",
    "Conversion completed!"
  ];

  return (
    <div className="space-y-6">
      {/* Main Conversion Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Crypto to Fiat Conversion
          </CardTitle>
          <CardDescription>
            Convert your cryptocurrency to traditional currency instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Crypto */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">From (Crypto)</span>
                <Badge variant="secondary">
                  Available: {selectedCrypto?.balance || 0} {fromCrypto}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Select value={fromCrypto} onValueChange={setFromCrypto}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoAssets.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{crypto.icon}</span>
                          <span>{crypto.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.00"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  className="flex-1 text-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedCrypto && setCryptoAmount(selectedCrypto.balance.toString())}
                >
                  Max
                </Button>
              </div>
              {selectedCrypto && (
                <div className="mt-2 text-sm text-muted-foreground">
                  1 {fromCrypto} = ${selectedCrypto.rate.toLocaleString()}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCurrencies}>
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Fiat */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">To (Fiat)</span>
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Real-time rate
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Select value={toFiat} onValueChange={setToFiat}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fiatCurrencies.map((fiat) => (
                      <SelectItem key={fiat.code} value={fiat.code}>
                        <div className="flex items-center gap-2">
                          <span>{fiat.flag}</span>
                          <span>{fiat.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="0.00"
                  value={fiatAmount}
                  readOnly
                  className="flex-1 text-lg bg-muted"
                />
                <div className="w-12 text-sm font-medium">
                  {selectedFiat?.symbol}
                </div>
              </div>
              {selectedFiat && exchangeRate !== 1 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  1 USD = {exchangeRate} {toFiat}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Conversion Details */}
          {cryptoAmount && fiatAmount && (
            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <div>
                <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <div className="text-sm font-medium">Processing Time</div>
                <div className="text-xs text-muted-foreground">~30 seconds</div>
              </div>
              <div>
                <Zap className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <div className="text-sm font-medium">Fee</div>
                <div className="text-xs text-muted-foreground">0.5% + Network</div>
              </div>
              <div>
                <RefreshCw className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                <div className="text-sm font-medium">Rate Updates</div>
                <div className="text-xs text-muted-foreground">Every 10s</div>
              </div>
            </div>
          )}

          {/* Convert Button & Progress */}
          {isConverting ? (
            <div className="space-y-4">
              <Progress value={(conversionStep / 5) * 100} className="w-full" />
              <div className="text-center">
                <div className="font-medium">{conversionSteps[conversionStep - 1]}</div>
                <div className="text-sm text-muted-foreground">
                  Step {conversionStep} of {conversionSteps.length}
                </div>
              </div>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleConvert}
              disabled={!cryptoAmount || !fiatAmount || isConverting}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Convert {cryptoAmount || '0'} {fromCrypto} to {selectedFiat?.symbol}{fiatAmount || '0'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Convert Options */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Convert</CardTitle>
          <CardDescription>
            Popular conversion amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['100', '500', '1000', '5000'].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="flex flex-col gap-2 h-16"
                onClick={() => {
                  setToFiat('USD');
                  setFiatAmount(amount);
                  if (selectedCrypto) {
                    setCryptoAmount((parseFloat(amount) / selectedCrypto.rate).toFixed(6));
                  }
                }}
              >
                <span className="font-bold">${amount}</span>
                <span className="text-xs text-muted-foreground">USD</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Spending</h3>
                <p className="text-sm text-muted-foreground">
                  Use converted fiat immediately with your virtual card
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-Currency</h3>
                <p className="text-sm text-muted-foreground">
                  Convert to 8+ major fiat currencies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <CheckCircle className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Real-Time Rates</h3>
                <p className="text-sm text-muted-foreground">
                  Best market rates updated every 10 seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};