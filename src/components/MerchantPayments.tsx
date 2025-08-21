import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  CreditCard, 
  Smartphone, 
  Globe, 
  ShoppingCart,
  Coffee,
  Car,
  Gamepad2,
  Plane,
  Utensils,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Merchant {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  acceptedPayments: string[];
  discount?: number;
  featured: boolean;
}

const popularMerchants: Merchant[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Shopping',
    logo: '🛒',
    description: 'Online marketplace',
    acceptedPayments: ['BTC', 'ETH', 'USDT', 'USDC'],
    featured: true
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    category: 'Food & Beverage',
    logo: '☕',
    description: 'Coffee and beverages',
    acceptedPayments: ['BTC', 'USDT'],
    discount: 5,
    featured: true
  },
  {
    id: 'uber',
    name: 'Uber',
    category: 'Transportation',
    logo: '🚗',
    description: 'Ride sharing service',
    acceptedPayments: ['BTC', 'ETH', 'USDT'],
    featured: true
  },
  {
    id: 'keys-travel',
    name: 'Keys Travel',
    category: 'Travel',
    logo: '✈️',
    description: 'Travel accommodations',
    acceptedPayments: ['BTC', 'ETH', 'USDT', 'USDC'],
    discount: 3,
    featured: true
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    category: 'Food & Beverage',
    logo: '🍟',
    description: 'Fast food restaurant',
    acceptedPayments: ['BTC', 'USDT'],
    featured: false
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Entertainment',
    logo: '🎵',
    description: 'Music streaming service',
    acceptedPayments: ['BTC', 'ETH', 'USDT'],
    featured: false
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    logo: '📺',
    description: 'Video streaming service',
    acceptedPayments: ['BTC', 'ETH', 'USDT'],
    featured: false
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Financial',
    logo: '💳',
    description: 'Payment platform',
    acceptedPayments: ['BTC', 'ETH', 'USDT', 'USDC'],
    featured: false
  },
];

const categories = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'Shopping', name: 'Shopping', icon: ShoppingCart },
  { id: 'Food & Beverage', name: 'Food & Beverage', icon: Coffee },
  { id: 'Transportation', name: 'Transportation', icon: Car },
  { id: 'Entertainment', name: 'Entertainment', icon: Gamepad2 },
  { id: 'Travel', name: 'Travel', icon: Plane },
  { id: 'Financial', name: 'Financial', icon: CreditCard },
];

const recentTransactions = [
  { merchant: 'Starbucks', amount: '$12.50', crypto: 'BTC', time: '2 hours ago', status: 'completed' },
  { merchant: 'Amazon', amount: '$89.99', crypto: 'USDT', time: '1 day ago', status: 'completed' },
  { merchant: 'Uber', amount: '$25.30', crypto: 'ETH', time: '2 days ago', status: 'completed' },
  { merchant: 'Netflix', amount: '$15.99', crypto: 'BTC', time: '1 week ago', status: 'completed' },
];

export const MerchantPayments = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  const filteredMerchants = popularMerchants.filter(merchant => {
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredMerchants = popularMerchants.filter(m => m.featured);

  const handlePayment = (merchant: Merchant) => {
    if (merchant.id === 'keys-travel') {
      window.open('#', '_blank');
      toast({
        title: "Redirecting to Keys Travel",
        description: "Opening Keys Travel Platform in new tab...",
      });
    } else {
      setSelectedMerchant(merchant);
      toast({
        title: "Payment Initiated",
        description: `Redirecting to ${merchant.name} payment page...`,
      });
    }
  };

  const handleQuickPay = (amount: string, merchant: string) => {
    toast({
      title: "Quick Payment",
      description: `Paid ${amount} to ${merchant} using crypto`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Merchant Payments
          </CardTitle>
          <CardDescription>
            Pay at 130M+ merchants worldwide with crypto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">130M+</div>
              <div className="text-sm text-muted-foreground">Merchants</div>
            </div>
            <div>
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Instant</div>
              <div className="text-sm text-muted-foreground">Payments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search merchants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Merchants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <Card key={merchant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{merchant.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{merchant.name}</CardTitle>
                        <CardDescription>{merchant.description}</CardDescription>
                      </div>
                    </div>
                    {merchant.discount && (
                      <Badge variant="destructive">{merchant.discount}% OFF</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Accepted Crypto:</div>
                    <div className="flex flex-wrap gap-1">
                      {merchant.acceptedPayments.map((crypto) => (
                        <Badge key={crypto} variant="secondary" className="text-xs">
                          {crypto}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handlePayment(merchant)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Merchants</CardTitle>
              <CardDescription>
                Top merchants with special offers and discounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredMerchants.map((merchant) => (
                  <div key={merchant.id} className="p-6 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{merchant.logo}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{merchant.name}</h3>
                        <p className="text-muted-foreground">{merchant.description}</p>
                        {merchant.discount && (
                          <Badge variant="destructive" className="mt-1">
                            {merchant.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handlePayment(merchant)}
                    >
                      Shop Now with Crypto
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your recent merchant payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.merchant}</div>
                        <div className="text-sm text-muted-foreground">{transaction.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        Paid with {transaction.crypto}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleQuickPay('$5.99', 'Starbucks')}
                >
                  <Coffee className="h-6 w-6 mb-2" />
                  Coffee
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleQuickPay('$15.00', 'Uber')}
                >
                  <Car className="h-6 w-6 mb-2" />
                  Ride
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleQuickPay('$25.00', 'DoorDash')}
                >
                  <Utensils className="h-6 w-6 mb-2" />
                  Food
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleQuickPay('$9.99', 'Netflix')}
                >
                  <Gamepad2 className="h-6 w-6 mb-2" />
                  Entertainment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};