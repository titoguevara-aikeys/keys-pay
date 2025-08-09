import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Wallet, 
  RefreshCw,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  Globe,
  Calculator,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Star,
  Layers,
  Activity,
  Compass,
  Banknote,
  Coins
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CryptoToFiatConverter } from './CryptoToFiatConverter';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  price: number;
  icon: string;
  marketCap: number;
  volume24h: number;
  supply: number;
  rank: number;
  ath: number;
  athChange: number;
}

interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'liquidity' | 'staking' | 'farming';
  asset: string;
  amount: number;
  apy: number;
  rewards: number;
  totalValue: number;
  risk: 'low' | 'medium' | 'high';
}

interface TradingOrder {
  id: string;
  type: 'limit' | 'market' | 'stop-loss';
  side: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  status: 'pending' | 'filled' | 'canceled';
  timestamp: string;
}

const enhancedCryptoAssets: CryptoAsset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.05432,
    usdValue: 2156.80,
    change24h: 2.45,
    price: 39680.50,
    icon: '₿',
    marketCap: 777000000000,
    volume24h: 15420000000,
    supply: 19750000,
    rank: 1,
    ath: 69045,
    athChange: -42.5
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 1.2456,
    usdValue: 2890.40,
    change24h: -1.23,
    price: 2321.85,
    icon: 'Ξ',
    marketCap: 280000000000,
    volume24h: 8920000000,
    supply: 120500000,
    rank: 2,
    ath: 4878,
    athChange: -52.4
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    balance: 15.7,
    usdValue: 2355.50,
    change24h: 8.92,
    price: 150.05,
    icon: '◎',
    marketCap: 70000000000,
    volume24h: 2140000000,
    supply: 467000000,
    rank: 5,
    ath: 260,
    athChange: -42.3
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    balance: 1250.00,
    usdValue: 1250.00,
    change24h: 0.01,
    price: 1.00,
    icon: '₮',
    marketCap: 95000000000,
    volume24h: 25000000000,
    supply: 95000000000,
    rank: 3,
    ath: 1.32,
    athChange: -24.2
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 850.75,
    usdValue: 850.75,
    change24h: -0.02,
    price: 1.00,
    icon: '$',
    marketCap: 30000000000,
    volume24h: 5200000000,
    supply: 30000000000,
    rank: 6,
    ath: 1.17,
    athChange: -14.5
  }
];

const mockDeFiPositions: DeFiPosition[] = [
  {
    id: '1',
    protocol: 'Aave',
    type: 'lending',
    asset: 'USDC',
    amount: 5000,
    apy: 3.2,
    rewards: 12.5,
    totalValue: 5012.5,
    risk: 'low'
  },
  {
    id: '2',
    protocol: 'Uniswap V3',
    type: 'liquidity',
    asset: 'ETH/USDC',
    amount: 0.5,
    apy: 15.8,
    rewards: 89.2,
    totalValue: 1178.5,
    risk: 'medium'
  },
  {
    id: '3',
    protocol: 'Lido',
    type: 'staking',
    asset: 'ETH',
    amount: 0.8,
    apy: 4.1,
    rewards: 0.023,
    totalValue: 1857.48,
    risk: 'low'
  }
];

const mockTradingOrders: TradingOrder[] = [
  {
    id: '1',
    type: 'limit',
    side: 'buy',
    pair: 'BTC/USDT',
    amount: 0.1,
    price: 38500,
    status: 'pending',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'stop-loss',
    side: 'sell',
    pair: 'ETH/USDT',
    amount: 0.5,
    price: 2200,
    status: 'pending',
    timestamp: '2024-01-15T09:15:00Z'
  }
];

export const EnhancedCryptoWallet = () => {
  const { toast } = useToast();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [sortBy, setSortBy] = useState('value');

  const totalPortfolioValue = enhancedCryptoAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalDeFiValue = mockDeFiPositions.reduce((sum, position) => sum + position.totalValue, 0);
  const totalRewards = mockDeFiPositions.reduce((sum, position) => sum + position.rewards, 0);

  const portfolioAllocation = enhancedCryptoAssets.map(asset => ({
    ...asset,
    percentage: (asset.usdValue / totalPortfolioValue) * 100
  }));

  const handleAdvancedTrade = (fromCrypto: string, toFiat: string, amount: string) => {
    toast({
      title: "Trade Executed",
      description: `Converted ${amount} ${fromCrypto} to ${toFiat}`,
    });
  };

  const handleDeFiAction = (action: string, protocol: string, asset: string) => {
    toast({
      title: `DeFi ${action}`,
      description: `${action} completed on ${protocol} with ${asset}`,
    });
  };

  const handleAutoRebalance = () => {
    toast({
      title: "Portfolio Rebalanced",
      description: "Your portfolio has been automatically rebalanced according to your target allocation",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const sortedAssets = [...enhancedCryptoAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value': return b.usdValue - a.usdValue;
      case 'change': return b.change24h - a.change24h;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Portfolio Value
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
              >
                {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              DeFi Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {balanceVisible ? `$${totalDeFiValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '****'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Rewards: ${totalRewards.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              24h Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-500">+$432.18</div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">Across all positions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Portfolio Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-rebalance">Auto Rebalance</Label>
                <p className="text-sm text-muted-foreground">Maintain target allocation</p>
              </div>
              <Switch
                id="auto-rebalance"
                checked={autoRebalance}
                onCheckedChange={setAutoRebalance}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price-alerts">Price Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify on price changes</p>
              </div>
              <Switch
                id="price-alerts"
                checked={priceAlerts}
                onCheckedChange={setPriceAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trading-enabled">Advanced Trading</Label>
                <p className="text-sm text-muted-foreground">Enable limit & stop orders</p>
              </div>
              <Switch
                id="trading-enabled"
                checked={tradingEnabled}
                onCheckedChange={setTradingEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Crypto Assets</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">By Value</SelectItem>
                      <SelectItem value="change">By Change</SelectItem>
                      <SelectItem value="name">By Name</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedAssets.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg">
                          {asset.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{asset.name}</span>
                            <Badge variant="outline">#{asset.rank}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {balanceVisible ? `${asset.balance} ${asset.symbol}` : '****'} • ${asset.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ATH: ${asset.ath.toLocaleString()} ({asset.athChange.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {balanceVisible ? `$${asset.usdValue.toLocaleString()}` : '****'}
                        </div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${
                          asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {asset.change24h >= 0 ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {Math.abs(asset.change24h)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vol: ${(asset.volume24h / 1000000).toFixed(0)}M
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          {tradingEnabled ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Advanced Trading
                  </CardTitle>
                  <CardDescription>
                    Place limit orders, stop losses, and manage your trading positions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Place Order</h3>
                      <div className="space-y-3">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Order Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limit">Limit Order</SelectItem>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="stop-loss">Stop Loss</SelectItem>
                            <SelectItem value="take-profit">Take Profit</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline">Buy</Button>
                          <Button variant="outline">Sell</Button>
                        </div>
                        
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Trading Pair" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
                            <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
                            <SelectItem value="sol-usdt">SOL/USDT</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input placeholder="Amount" />
                        <Input placeholder="Price (USDT)" />
                        
                        <Button className="w-full">
                          Place Order
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Open Orders</h3>
                      <div className="space-y-2">
                        {mockTradingOrders.map((order) => (
                          <div key={order.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{order.pair}</div>
                                <div className="text-sm text-muted-foreground">
                                  {order.type} • {order.side} • {order.amount} @ ${order.price}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                                  {order.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">Advanced Trading Disabled</h3>
                  <p className="text-muted-foreground">
                    Enable advanced trading in portfolio settings to access limit orders and stop losses
                  </p>
                  <Button onClick={() => setTradingEnabled(true)}>
                    Enable Trading
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Active Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDeFiPositions.map((position) => (
                    <div key={position.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{position.protocol}</div>
                        <Badge variant="outline" className={getRiskColor(position.risk)}>
                          {position.risk} risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Asset</div>
                          <div className="font-medium">{position.asset}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">APY</div>
                          <div className="font-medium text-green-500">{position.apy}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Value</div>
                          <div className="font-medium">${position.totalValue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Rewards</div>
                          <div className="font-medium text-green-500">${position.rewards.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">Withdraw</Button>
                        <Button size="sm" variant="outline">Claim Rewards</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DeFi Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Compound V3</div>
                      <Badge className="bg-green-500/10 text-green-500">New</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Lend USDC and earn competitive yields with automated compounding
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current APY</div>
                        <div className="font-semibold text-green-500">4.2%</div>
                      </div>
                      <Button size="sm">
                        Start Earning
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Rocket Pool</div>
                      <Badge variant="outline">Low Risk</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Stake ETH and earn rewards while supporting Ethereum 2.0
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current APY</div>
                        <div className="font-semibold text-green-500">3.8%</div>
                      </div>
                      <Button size="sm">
                        Stake ETH
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioAllocation.map((asset) => (
                    <div key={asset.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="font-bold">{asset.icon}</span>
                          {asset.symbol}
                        </span>
                        <span>{asset.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={asset.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Return</div>
                      <div className="text-2xl font-bold text-green-500">+12.4%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Best Performer</div>
                      <div className="text-lg font-semibold">SOL (+8.92%)</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="font-medium">1.87</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-medium text-red-500">-8.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Beta vs BTC</span>
                      <span className="font-medium">0.92</span>
                    </div>
                  </div>

                  {autoRebalance && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Portfolio rebalanced 3 days ago. Next rebalance in 4 days.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Assets</CardTitle>
                <CardDescription>
                  Generate deposit addresses for your crypto assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enhancedCryptoAssets.slice(0, 3).map((asset) => (
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
                        onClick={() => toast({
                          title: "Address Generated",
                          description: `Deposit address: ${asset.symbol.toLowerCase()}1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`,
                        })}
                      >
                        Generate Address
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdraw Assets</CardTitle>
                <CardDescription>
                  Send crypto to external wallets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset</label>
                  <Select value={selectedAsset?.symbol || ''} onValueChange={(value) => {
                    const asset = enhancedCryptoAssets.find(a => a.symbol === value);
                    setSelectedAsset(asset || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {enhancedCryptoAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.symbol}>
                          {asset.icon} {asset.symbol} - {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (selectedAsset && amount && address) {
                      toast({
                        title: "Withdrawal Initiated",
                        description: `Withdrawing ${amount} ${selectedAsset.symbol}`,
                      });
                      setAmount('');
                      setAddress('');
                    }
                  }}
                  disabled={!selectedAsset || !amount || !address}
                >
                  Withdraw {selectedAsset?.symbol || 'Asset'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <CryptoToFiatConverter onConvert={handleAdvancedTrade} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Crypto Swap
              </CardTitle>
              <CardDescription>
                Convert between different cryptocurrencies with best rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">From</div>
                  <div className="flex items-center justify-between">
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="BTC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">₿ BTC</SelectItem>
                        <SelectItem value="eth">Ξ ETH</SelectItem>
                        <SelectItem value="sol">◎ SOL</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="USDT" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdt">₮ USDT</SelectItem>
                        <SelectItem value="usdc">$ USDC</SelectItem>
                        <SelectItem value="eth">Ξ ETH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="max-w-32" placeholder="0.00" readOnly />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span>1 BTC = 39,680.50 USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slippage</span>
                    <span>0.1%</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => toast({
                  title: "Swap Completed",
                  description: "Your crypto swap was successful!",
                })}>
                  Swap Crypto
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};