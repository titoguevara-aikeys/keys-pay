import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Vault,
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
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StakingPool {
  id: string;
  name: string;
  apy: number;
  minAmount: number;
  lockPeriod: string;
  risk: 'Low' | 'Medium' | 'High';
  totalStaked: number;
}

interface LoanOption {
  id: string;
  maxLTV: number;
  interestRate: number;
  maxTerm: number;
  minAmount: number;
  collateralType: string;
}

const stakingPools: StakingPool[] = [
  {
    id: '1',
    name: 'USDC Staking',
    apy: 7.5,
    minAmount: 100,
    lockPeriod: 'Flexible',
    risk: 'Low',
    totalStaked: 2500000
  },
  {
    id: '2',
    name: 'Bitcoin Pool',
    apy: 5.2,
    minAmount: 0.01,
    lockPeriod: '30 days',
    risk: 'Medium',
    totalStaked: 1200000
  },
  {
    id: '3',
    name: 'Ethereum Staking',
    apy: 6.8,
    minAmount: 0.1,
    lockPeriod: '60 days',
    risk: 'Medium',
    totalStaked: 3400000
  },
  {
    id: '4',
    name: 'NBT Token Pool',
    apy: 13.0,
    minAmount: 1000,
    lockPeriod: '90 days',
    risk: 'High',
    totalStaked: 850000
  }
];

const loanOptions: LoanOption[] = [
  {
    id: '1',
    maxLTV: 70,
    interestRate: 8.5,
    maxTerm: 36,
    minAmount: 1000,
    collateralType: 'Bitcoin'
  },
  {
    id: '2',
    maxLTV: 65,
    interestRate: 9.0,
    maxTerm: 24,
    minAmount: 500,
    collateralType: 'Ethereum'
  },
  {
    id: '3',
    maxLTV: 50,
    interestRate: 7.5,
    maxTerm: 12,
    minAmount: 200,
    collateralType: 'Stablecoins'
  }
];

export const NebeusHub = () => {
  const { toast } = useToast();
  const [stakingAmount, setStakingAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<StakingPool>(stakingPools[0]);
  const [loanAmount, setLoanAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<LoanOption>(loanOptions[0]);

  const handleStaking = () => {
    if (!stakingAmount || parseFloat(stakingAmount) < selectedPool.minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount is ${selectedPool.minAmount}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Staking Successful",
      description: `Staked ${stakingAmount} in ${selectedPool.name} at ${selectedPool.apy}% APY`,
    });
    setStakingAmount('');
  };

  const handleLoanApplication = () => {
    if (!loanAmount || !collateralAmount) {
      toast({
        title: "Invalid Input",
        description: "Please enter both loan and collateral amounts",
        variant: "destructive",
      });
      return;
    }

    const maxLoanAmount = (parseFloat(collateralAmount) * selectedLoan.maxLTV) / 100;
    if (parseFloat(loanAmount) > maxLoanAmount) {
      toast({
        title: "Loan Amount Too High",
        description: `Maximum loan amount with this collateral is $${maxLoanAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Loan Application Submitted",
      description: `Applied for $${loanAmount} loan with ${selectedLoan.collateralType} collateral`,
    });
    setLoanAmount('');
    setCollateralAmount('');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          NEBEUS FINANCIAL ECOSYSTEM
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Merge money and crypto in one app. Comprehensive financial services for freelancers, businesses, and crypto enthusiasts.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Vault className="h-4 w-4 mr-2" />
            $250M Insurance Coverage
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Up to 13% APY
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Licensed & Regulated
          </Badge>
        </div>
      </div>

      {/* Main Features Tabs */}
      <Tabs defaultValue="earning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="earning">Earning</TabsTrigger>
          <TabsTrigger value="loans">Crypto Loans</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="cards">Nebeus Card</TabsTrigger>
          <TabsTrigger value="exchange">Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="earning" className="space-y-6">
          {/* Earning Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Crypto Earning Programs
              </CardTitle>
              <CardDescription>
                Earn passive income through staking and crypto renting programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staking Pools */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Available Staking Pools</h3>
                  <div className="space-y-3">
                    {stakingPools.map((pool) => (
                      <div 
                        key={pool.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPool.id === pool.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPool(pool)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{pool.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Min: ${pool.minAmount} • {pool.lockPeriod}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getRiskColor(pool.risk)}>
                                {pool.risk} Risk
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                ${pool.totalStaked.toLocaleString()} staked
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">{pool.apy}%</div>
                            <div className="text-xs text-muted-foreground">APY</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staking Interface */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Stake in {selectedPool.name}</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount to Stake</label>
                        <Input
                          placeholder={`Min: ${selectedPool.minAmount}`}
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>APY:</span>
                          <span className="font-medium text-green-500">{selectedPool.apy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Lock Period:</span>
                          <span className="font-medium">{selectedPool.lockPeriod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risk Level:</span>
                          <span className={`font-medium ${getRiskColor(selectedPool.risk)}`}>
                            {selectedPool.risk}
                          </span>
                        </div>
                        {stakingAmount && (
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span>Est. Annual Earnings:</span>
                            <span className="font-medium text-green-500">
                              ${((parseFloat(stakingAmount) || 0) * selectedPool.apy / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button onClick={handleStaking} className="w-full">
                        <HandCoins className="h-4 w-4 mr-2" />
                        Start Staking
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cold Storage Vault */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vault className="h-5 w-5" />
                Insured Cold Storage Vault
              </CardTitle>
              <CardDescription>
                Cold storage with $250M insurance coverage for maximum security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                  <div className="font-semibold">$250M Insurance</div>
                  <div className="text-sm text-muted-foreground">Lloyd's of London coverage</div>
                </div>
                
                <div className="text-center">
                  <Lock className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <div className="font-semibold">Cold Storage</div>
                  <div className="text-sm text-muted-foreground">Offline security</div>
                </div>
                
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-purple-500" />
                  <div className="font-semibold">Institutional Grade</div>
                  <div className="text-sm text-muted-foreground">Bank-level security</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button size="lg">
                  <Vault className="h-4 w-4 mr-2" />
                  Open Vault Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-6">
          {/* Crypto-Backed Loans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Crypto-Backed Loans
              </CardTitle>
              <CardDescription>
                Borrow at up to 70% LTV for as long as 36 months
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loan Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Loan Options</h3>
                  <div className="space-y-3">
                    {loanOptions.map((loan) => (
                      <div 
                        key={loan.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedLoan.id === loan.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedLoan(loan)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{loan.collateralType} Collateral</div>
                            <div className="text-sm text-muted-foreground">
                              Max LTV: {loan.maxLTV}% • Up to {loan.maxTerm} months
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min loan: ${loan.minAmount.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-500">{loan.interestRate}%</div>
                            <div className="text-xs text-muted-foreground">Interest Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loan Calculator */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Loan Calculator</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Collateral Amount ($)</label>
                        <Input
                          placeholder="Enter collateral value"
                          value={collateralAmount}
                          onChange={(e) => setCollateralAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Loan Amount ($)</label>
                        <Input
                          placeholder="Enter desired loan amount"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Max LTV:</span>
                          <span className="font-medium">{selectedLoan.maxLTV}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Interest Rate:</span>
                          <span className="font-medium">{selectedLoan.interestRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Max Term:</span>
                          <span className="font-medium">{selectedLoan.maxTerm} months</span>
                        </div>
                        {collateralAmount && (
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span>Max Loan Amount:</span>
                            <span className="font-medium text-green-500">
                              ${((parseFloat(collateralAmount) || 0) * selectedLoan.maxLTV / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button onClick={handleLoanApplication} className="w-full">
                        <Calculator className="h-4 w-4 mr-2" />
                        Apply for Loan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          {/* Business Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Crypto Services
              </CardTitle>
              <CardDescription>
                Complete financial solutions for modern businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <div className="font-semibold mb-2">Mass Payouts</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Streamline high-volume payments in fiat and crypto
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Banknote className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <div className="font-semibold mb-2">Business IBAN</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Crypto-friendly IBAN for B2B operations
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                    <div className="font-semibold mb-2">Crypto Invoicing</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Create invoices in crypto and traditional money
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                    <div className="font-semibold mb-2">Exchange Widget</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Allow visitors to buy crypto and earn revenue
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <div className="font-semibold mb-2">Business Loans</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Crypto-backed loans for businesses
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Coins className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <div className="font-semibold mb-2">Crypto Renting</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      Earn up to 13% RPY renting company crypto
                    </div>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          {/* Nebeus Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Nebeus Mastercard
              </CardTitle>
              <CardDescription>
                Spend with crypto and fiat worldwide - Physical and Virtual cards available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card Features */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Card Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Globally issued Mastercard</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Spend crypto and fiat seamlessly</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Real-time conversion rates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>No foreign transaction fees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Instant card freeze/unfreeze</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Cashback rewards program</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Supported Currencies</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['BTC', 'ETH', 'USDC', 'EUR', 'GBP', 'USD', 'XRP', 'ADA', 'DOT'].map((currency) => (
                        <Badge key={currency} variant="outline" className="justify-center">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Preview */}
                <div className="space-y-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 rounded-xl text-white relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-6 w-6" />
                          <span className="text-sm opacity-75">NEBEUS</span>
                        </div>
                        
                        <div className="text-xl font-mono tracking-wider">
                          •••• •••• •••• 8945
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-75">Valid Thru</div>
                            <div className="font-mono">12/28</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Balance</div>
                            <div className="text-lg font-bold">€3,450.75</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4">
                        <div className="text-xl font-bold">mastercard</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Order Physical Card
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Get Virtual Card
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange" className="space-y-6">
          {/* Crypto Exchange */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Crypto Exchange
              </CardTitle>
              <CardDescription>
                Buy, sell, and exchange cryptocurrencies at market prices with low fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exchange Interface */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Quick Exchange</h3>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">From</label>
                          <div className="flex gap-2">
                            <Input placeholder="Amount" className="flex-1" />
                            <Button variant="outline" className="w-20">BTC</Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button variant="outline" size="icon">
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">To</label>
                          <div className="flex gap-2">
                            <Input placeholder="Amount" className="flex-1" />
                            <Button variant="outline" className="w-20">EUR</Button>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span>Exchange Rate:</span>
                            <span className="font-medium">1 BTC = €89,450</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Fee:</span>
                            <span className="font-medium">0.25%</span>
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Exchange Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Market Data */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Market Prices</h3>
                    <div className="space-y-3">
                      {[
                        { symbol: 'BTC', name: 'Bitcoin', price: 89450, change: 2.5 },
                        { symbol: 'ETH', name: 'Ethereum', price: 3280, change: 1.8 },
                        { symbol: 'USDC', name: 'USD Coin', price: 0.998, change: 0.1 },
                        { symbol: 'XRP', name: 'Ripple', price: 0.52, change: -1.2 },
                        { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 3.1 }
                      ].map((coin) => (
                        <div key={coin.symbol} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{coin.symbol}</div>
                            <div className="text-sm text-muted-foreground">{coin.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">€{coin.price.toLocaleString()}</div>
                            <div className={`text-sm ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {coin.change >= 0 ? '+' : ''}{coin.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">Low Trading Fees</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Enjoy competitive rates starting from 0.25% per transaction
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};