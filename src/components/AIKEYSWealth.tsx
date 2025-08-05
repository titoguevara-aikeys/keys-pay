import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet,
  TrendingUp,
  CreditCard,
  Building2,
  Users,
  DollarSign,
  Shield,
  Percent,
  ArrowUpDown,
  FileText,
  Banknote,
  Coins,
  PieChart,
  Calculator,
  HandCoins,
  Lock,
  Calendar,
  CheckCircle,
  Star,
  Target,
  Repeat,
  LineChart,
  Crown,
  Zap,
  Gift,
  Trophy,
  Clock,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavingsProduct {
  id: string;
  name: string;
  type: 'flexible' | 'fixed' | 'dual';
  apy: number;
  minAmount: number;
  duration?: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface CreditLineOption {
  id: string;
  asset: string;
  ltv: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
}

interface FuturesContract {
  id: string;
  symbol: string;
  leverage: number;
  marginRequired: number;
  priceChange: number;
}

const savingsProducts: SavingsProduct[] = [
  {
    id: '1',
    name: 'Flexible Savings',
    type: 'flexible',
    apy: 8.0,
    minAmount: 100,
    description: 'Daily compound interest with funds available anytime',
    risk: 'Low'
  },
  {
    id: '2',
    name: 'Fixed-term Savings',
    type: 'fixed',
    apy: 16.0,
    minAmount: 1000,
    duration: '12 months',
    description: 'Higher rates for longer commitment periods',
    risk: 'Low'
  },
  {
    id: '3',
    name: 'Dual Investment',
    type: 'dual',
    apy: 25.0,
    minAmount: 500,
    duration: '7-30 days',
    description: 'Buy low, sell high strategies with yield while waiting',
    risk: 'High'
  }
];

const creditLineOptions: CreditLineOption[] = [
  {
    id: '1',
    asset: 'BTC',
    ltv: 50,
    interestRate: 2.9,
    minAmount: 1000,
    maxAmount: 1000000
  },
  {
    id: '2',
    asset: 'ETH',
    ltv: 50,
    interestRate: 3.2,
    minAmount: 500,
    maxAmount: 500000
  },
  {
    id: '3',
    asset: 'SOL',
    ltv: 30,
    interestRate: 4.5,
    minAmount: 250,
    maxAmount: 100000
  },
  {
    id: '4',
    asset: 'AIKEYS',
    ltv: 15,
    interestRate: 5.0,
    minAmount: 100,
    maxAmount: 50000
  }
];

const futuresContracts: FuturesContract[] = [
  {
    id: '1',
    symbol: 'BTCUSDT',
    leverage: 100,
    marginRequired: 1000,
    priceChange: 2.5
  },
  {
    id: '2',
    symbol: 'ETHUSDT',
    leverage: 75,
    marginRequired: 500,
    priceChange: -1.8
  },
  {
    id: '3',
    symbol: 'SOLUSDT',
    leverage: 50,
    marginRequired: 250,
    priceChange: 3.2
  }
];

export const AIKEYSWealth = () => {
  const { toast } = useToast();
  const [savingsAmount, setSavingsAmount] = useState('');
  const [selectedSavings, setSelectedSavings] = useState<SavingsProduct>(savingsProducts[0]);
  const [creditAmount, setCreditAmount] = useState('');
  const [collateralValue, setCollateralValue] = useState('');
  const [selectedCredit, setSelectedCredit] = useState<CreditLineOption>(creditLineOptions[0]);
  const [recurringBuyAmount, setRecurringBuyAmount] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [loyaltyTier, setLoyaltyTier] = useState('Silver');

  const handleSavingsDeposit = () => {
    if (!savingsAmount || parseFloat(savingsAmount) < selectedSavings.minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount is $${selectedSavings.minAmount}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Savings Deposit Successful",
      description: `Deposited $${savingsAmount} into ${selectedSavings.name} at ${selectedSavings.apy}% APY`,
    });
    setSavingsAmount('');
  };

  const handleCreditLine = () => {
    if (!creditAmount || !collateralValue) {
      toast({
        title: "Invalid Input",
        description: "Please enter both credit and collateral amounts",
        variant: "destructive",
      });
      return;
    }

    const maxCredit = (parseFloat(collateralValue) * selectedCredit.ltv) / 100;
    if (parseFloat(creditAmount) > maxCredit) {
      toast({
        title: "Credit Amount Too High",
        description: `Maximum credit with this collateral is $${maxCredit.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Credit Line Approved",
      description: `$${creditAmount} credit line approved at ${selectedCredit.interestRate}% APR`,
    });
    setCreditAmount('');
    setCollateralValue('');
  };

  const handleRecurringBuy = () => {
    if (!recurringBuyAmount || !targetPrice) {
      toast({
        title: "Invalid Input",
        description: "Please enter both amount and target price",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Recurring Buy Set",
      description: `Set up $${recurringBuyAmount} recurring buy at $${targetPrice}`,
    });
    setRecurringBuyAmount('');
    setTargetPrice('');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getLoyaltyBenefits = (tier: string) => {
    switch (tier) {
      case 'Base':
        return { rate: '0%', cashback: '0%', benefits: ['Basic support', 'Standard rates'] };
      case 'Silver':
        return { rate: '+0.5%', cashback: '0.5%', benefits: ['Priority support', 'Lower borrow rates', 'Basic cashback'] };
      case 'Gold':
        return { rate: '+1%', cashback: '1%', benefits: ['VIP support', 'Enhanced rates', 'Premium cashback', 'Free withdrawals'] };
      case 'Platinum':
        return { rate: '+2%', cashback: '2%', benefits: ['Personal manager', 'Best rates', 'Maximum cashback', 'Premium features'] };
      default:
        return { rate: '0%', cashback: '0%', benefits: [] };
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          AIKEYS WEALTH MANAGEMENT
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Premier digital asset wealth platform. Earn, borrow, trade, and spend - all in one comprehensive ecosystem.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            $11B+ AUM
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Percent className="h-4 w-4 mr-2" />
            Up to 16% APY
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            24/7 Support
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            Award-Winning
          </Badge>
        </div>
      </div>

      {/* Main Features Tabs */}
      <Tabs defaultValue="savings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Line</TabsTrigger>
          <TabsTrigger value="trading">Advanced Trading</TabsTrigger>
          <TabsTrigger value="card">Premium Card</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="private">Private Wealth</TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-6">
          {/* Advanced Savings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Advanced Savings Products
              </CardTitle>
              <CardDescription>
                Multiple earning strategies from flexible to high-yield dual investments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Savings Products */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Available Products</h3>
                  <div className="space-y-3">
                    {savingsProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSavings.id === product.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedSavings(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {product.name}
                              {product.type === 'flexible' && <Clock className="h-4 w-4 text-green-500" />}
                              {product.type === 'fixed' && <Lock className="h-4 w-4 text-blue-500" />}
                              {product.type === 'dual' && <Target className="h-4 w-4 text-purple-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min: ${product.minAmount} {product.duration && `• ${product.duration}`}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </div>
                            <Badge variant="outline" className={`mt-2 ${getRiskColor(product.risk)}`}>
                              {product.risk} Risk
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">{product.apy}%</div>
                            <div className="text-xs text-muted-foreground">APY</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Interface */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Invest in {selectedSavings.name}</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Investment Amount</label>
                        <Input
                          placeholder={`Min: $${selectedSavings.minAmount}`}
                          value={savingsAmount}
                          onChange={(e) => setSavingsAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Product Type:</span>
                          <span className="font-medium capitalize">{selectedSavings.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>APY:</span>
                          <span className="font-medium text-green-500">{selectedSavings.apy}%</span>
                        </div>
                        {selectedSavings.duration && (
                          <div className="flex justify-between text-sm">
                            <span>Duration:</span>
                            <span className="font-medium">{selectedSavings.duration}</span>
                          </div>
                        )}
                        {savingsAmount && (
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span>Est. Annual Earnings:</span>
                            <span className="font-medium text-green-500">
                              ${((parseFloat(savingsAmount) || 0) * selectedSavings.apy / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button onClick={handleSavingsDeposit} className="w-full">
                        <HandCoins className="h-4 w-4 mr-2" />
                        Start Earning
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-6">
          {/* Credit Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Crypto-Backed Credit Line
              </CardTitle>
              <CardDescription>
                Access liquidity without selling your crypto assets - from 2.9% APR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credit Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Collateral Options</h3>
                  <div className="space-y-3">
                    {creditLineOptions.map((option) => (
                      <div 
                        key={option.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCredit.id === option.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedCredit(option)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{option.asset} Collateral</div>
                            <div className="text-sm text-muted-foreground">
                              Max LTV: {option.ltv}% • Min: ${option.minAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Max Credit: ${option.maxAmount.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-500">{option.interestRate}%</div>
                            <div className="text-xs text-muted-foreground">APR</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit Calculator */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Credit Calculator</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Collateral Value ($)</label>
                        <Input
                          placeholder="Enter collateral value"
                          value={collateralValue}
                          onChange={(e) => setCollateralValue(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Credit Amount ($)</label>
                        <Input
                          placeholder="Enter desired credit amount"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Interest Rate:</span>
                          <span className="font-medium">{selectedCredit.interestRate}% APR</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Max LTV:</span>
                          <span className="font-medium">{selectedCredit.ltv}%</span>
                        </div>
                        {collateralValue && (
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span>Max Credit:</span>
                            <span className="font-medium text-green-500">
                              ${((parseFloat(collateralValue) || 0) * selectedCredit.ltv / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button onClick={handleCreditLine} className="w-full">
                        <Calculator className="h-4 w-4 mr-2" />
                        Apply for Credit Line
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          {/* Advanced Trading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recurring Buy Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Recurring Buy Orders
                </CardTitle>
                <CardDescription>
                  Automate your investments with smart recurring purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount per Order ($)</label>
                  <Input
                    placeholder="Enter amount"
                    value={recurringBuyAmount}
                    onChange={(e) => setRecurringBuyAmount(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Price ($)</label>
                  <Input
                    placeholder="Enter target price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="font-medium">Weekly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asset:</span>
                      <span className="font-medium">BTC</span>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleRecurringBuy} className="w-full">
                  <Repeat className="h-4 w-4 mr-2" />
                  Set Recurring Buy
                </Button>
              </CardContent>
            </Card>

            {/* Futures Trading */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Futures Trading
                </CardTitle>
                <CardDescription>
                  Trade perpetual futures with up to 100x leverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {futuresContracts.map((contract) => (
                    <div key={contract.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{contract.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Max Leverage: {contract.leverage}x
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${contract.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {contract.priceChange >= 0 ? '+' : ''}{contract.priceChange}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min Margin: ${contract.marginRequired}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Start Futures Trading
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="card" className="space-y-6">
          {/* Premium Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                AIKEYS Premium Card
              </CardTitle>
              <CardDescription>
                Dual-mode card: Debit for spending savings, Credit for leveraging assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card Features */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Wallet className="h-8 w-8 mx-auto mb-3 text-green-500" />
                          <div className="font-semibold">Debit Mode</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Spend and grow savings
                          </div>
                          <div className="text-2xl font-bold text-green-500">14%</div>
                          <div className="text-xs text-muted-foreground">Interest on balance</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <CreditCard className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                          <div className="font-semibold">Credit Mode</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Spend without selling crypto
                          </div>
                          <div className="text-2xl font-bold text-blue-500">2%</div>
                          <div className="text-xs text-muted-foreground">Cashback rewards</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Card Benefits</h3>
                    <div className="space-y-2">
                      {[
                        'Switch between debit and credit modes instantly',
                        'Up to 2% cashback on all purchases',
                        'Earn interest while funds are ready to spend',
                        'No foreign transaction fees',
                        'Apple Pay and Google Pay compatible',
                        'Real-time spending notifications'
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Preview */}
                <div className="space-y-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 rounded-xl text-white relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">
                          <Crown className="h-4 w-4 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-6 w-6" />
                          <span className="text-sm opacity-75">AIKEYS</span>
                        </div>
                        
                        <div className="text-xl font-mono tracking-wider">
                          •••• •••• •••• 5847
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-75">Valid Thru</div>
                            <div className="font-mono">12/28</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Mode</div>
                            <div className="text-sm font-bold flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              Credit
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4">
                        <div className="text-lg font-bold">PREMIUM</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Order Card
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Switch Mode
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          {/* Loyalty Program */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                AIKEYS Loyalty Program
              </CardTitle>
              <CardDescription>
                Unlock exclusive benefits based on your account balance and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Loyalty Tiers */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Loyalty Tiers</h3>
                  <div className="space-y-3">
                    {[
                      { tier: 'Base', balance: '$0', color: 'text-gray-500' },
                      { tier: 'Silver', balance: '$5,000', color: 'text-gray-400' },
                      { tier: 'Gold', balance: '$25,000', color: 'text-yellow-500' },
                      { tier: 'Platinum', balance: '$100,000', color: 'text-purple-500' }
                    ].map((item) => (
                      <div 
                        key={item.tier}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          loyaltyTier === item.tier ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setLoyaltyTier(item.tier)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Crown className={`h-6 w-6 ${item.color}`} />
                            <div>
                              <div className="font-medium">{item.tier}</div>
                              <div className="text-sm text-muted-foreground">Min Balance: {item.balance}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${item.color}`}>
                              {getLoyaltyBenefits(item.tier).rate}
                            </div>
                            <div className="text-xs text-muted-foreground">Rate Boost</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{loyaltyTier} Tier Benefits</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {getLoyaltyBenefits(loyaltyTier).rate}
                          </div>
                          <div className="text-sm text-muted-foreground">Interest Rate Boost</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">
                            {getLoyaltyBenefits(loyaltyTier).cashback}
                          </div>
                          <div className="text-sm text-muted-foreground">Cashback Rate</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Exclusive Benefits</h4>
                        {getLoyaltyBenefits(loyaltyTier).benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full">
                        <Star className="h-4 w-4 mr-2" />
                        Upgrade Tier
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="space-y-6">
          {/* Private Wealth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                AIKEYS Private Wealth
              </CardTitle>
              <CardDescription>
                Exclusive white-glove wealth solutions for high-net-worth individuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Private Services */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Exclusive Services</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          icon: Users,
                          title: 'Dedicated Relationship Manager',
                          description: 'Personal account manager available 24/7'
                        },
                        {
                          icon: TrendingUp,
                          title: 'High-Limit OTC Trading',
                          description: 'Institutional-grade over-the-counter trades'
                        },
                        {
                          icon: Shield,
                          title: 'Enhanced Security',
                          description: 'Additional security layers and insurance'
                        },
                        {
                          icon: FileText,
                          title: 'Bespoke Credit Solutions',
                          description: 'Customized lending with preferential rates'
                        },
                        {
                          icon: Building2,
                          title: 'Corporate Account Services',
                          description: 'Advanced treasury management for businesses'
                        },
                        {
                          icon: PieChart,
                          title: 'Portfolio Management',
                          description: 'Professional wealth management services'
                        }
                      ].map((service, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <service.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground">{service.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eligibility & Benefits */}
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
                    <div className="text-center space-y-4">
                      <Crown className="h-12 w-12 mx-auto text-primary" />
                      <div>
                        <div className="text-2xl font-bold">$100,000+</div>
                        <div className="text-sm text-muted-foreground">Minimum Account Balance</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">Premium Benefits</div>
                        <div className="text-sm text-muted-foreground">
                          Access to institutional-grade services, priority support, and exclusive investment opportunities
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">Corporate Accounts</div>
                          <div className="text-sm text-muted-foreground mb-4">
                            Advanced treasury solutions for businesses
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {[
                            'Institutional custody solutions',
                            'Advanced OTC trading desk',
                            'Multi-signature wallet management',
                            'Regulatory compliance support',
                            'Treasury management consulting'
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button size="lg" className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Apply for Private Wealth
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};