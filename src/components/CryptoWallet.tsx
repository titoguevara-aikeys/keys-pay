import { useState } from 'react';
import { CryptoToFiatConverter } from './CryptoToFiatConverter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Wallet, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  price: number;
  icon: string;
}

const mockCryptoAssets: CryptoAsset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.05432,
    usdValue: 2156.80,
    change24h: 2.45,
    price: 39680.50,
    icon: '₿'
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 1.2456,
    usdValue: 2890.40,
    change24h: -1.23,
    price: 2321.85,
    icon: 'Ξ'
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    balance: 1250.00,
    usdValue: 1250.00,
    change24h: 0.01,
    price: 1.00,
    icon: '₮'
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 850.75,
    usdValue: 850.75,
    change24h: -0.02,
    price: 1.00,
    icon: '$'
  }
];

export const CryptoWallet = () => {
  const { toast } = useToast();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const totalPortfolioValue = mockCryptoAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

  const handleDeposit = (asset: CryptoAsset) => {
    toast({
      title: "Deposit Address Generated",
      description: `Use this address to deposit ${asset.name}: ${asset.symbol.toLowerCase()}1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`,
      duration: 5000,
    });
  };

  const handleWithdraw = () => {
    if (!selectedAsset || !amount || !address) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawing ${amount} ${selectedAsset.symbol} to ${address.substring(0, 10)}...`,
    });
    setAmount('');
    setAddress('');
    setSelectedAsset(null);
  };

  const handleConvert = () => {
    toast({
      title: "Conversion Successful", 
      description: "Your crypto has been converted to USDT",
    });
  };

  const handleCryptoToFiat = (fromCrypto: string, toFiat: string, amount: string) => {
    toast({
      title: "Fiat Conversion Completed",
      description: `Converted ${amount} ${fromCrypto} to ${toFiat}. Funds available in your wallet.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Crypto Portfolio
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription>
            Total Portfolio Value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              {balanceVisible ? `$${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '****'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+5.67% (24h)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Assets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assets</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCryptoAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                    {asset.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {balanceVisible ? `${asset.balance} ${asset.symbol}` : '****'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {balanceVisible ? `$${asset.usdValue.toLocaleString()}` : '****'}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${
                    asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {asset.change24h >= 0 ? 
                      <TrendingUp className="h-3 w-3" /> : 
                      <TrendingDown className="h-3 w-3" />
                    }
                    {Math.abs(asset.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crypto Operations */}
        <Tabs defaultValue="convert-fiat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="convert-fiat">Crypto → Fiat</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="convert">Swap Crypto</TabsTrigger>
        </TabsList>

        <TabsContent value="convert-fiat" className="space-y-4">
          <CryptoToFiatConverter onConvert={handleCryptoToFiat} />
        </TabsContent>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Crypto</CardTitle>
              <CardDescription>
                Generate deposit addresses for your crypto assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCryptoAssets.map((asset) => (
                  <div key={asset.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{asset.icon}</span>
                        <span className="font-semibold">{asset.symbol}</span>
                      </div>
                      <Badge variant="secondary">{asset.name}</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleDeposit(asset)}
                    >
                      Generate Address
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Crypto</CardTitle>
              <CardDescription>
                Send crypto to external wallets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mockCryptoAssets.map((asset) => (
                    <Button
                      key={asset.id}
                      variant={selectedAsset?.id === asset.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {asset.icon} {asset.symbol}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {selectedAsset && (
                  <div className="text-sm text-muted-foreground">
                    Available: {selectedAsset.balance} {selectedAsset.symbol}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Address</label>
                <Input
                  placeholder="Enter wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <Separator />
              
              <Button 
                className="w-full" 
                onClick={handleWithdraw}
                disabled={!selectedAsset || !amount || !address}
              >
                Withdraw {selectedAsset?.symbol || 'Crypto'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Convert Crypto</CardTitle>
              <CardDescription>
                Convert between different cryptocurrencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">From</div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline">
                      ₿ BTC
                    </Button>
                    <Input className="max-w-32" placeholder="0.00" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="ghost" size="sm">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">To</div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline">
                      ₮ USDT
                    </Button>
                    <Input className="max-w-32" placeholder="0.00" readOnly />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  Exchange Rate: 1 BTC = 39,680.50 USDT
                </div>

                <Button className="w-full" onClick={handleConvert}>
                  Convert Crypto
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};