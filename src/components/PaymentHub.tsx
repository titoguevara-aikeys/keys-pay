import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Wallet, 
  Send, 
  Users, 
  Gift,
  AtSign as AtmSign,
  Zap,
  Fingerprint,
  NfcIcon,
  QrCode,
  Apple,
  CircleDollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import wallet logos
import metamaskLogo from '@/assets/metamask-logo.svg';
import trustwalletLogo from '@/assets/trustwallet-logo.png';
import coinbaseLogo from '@/assets/coinbase-logo.png';
import walletconnectLogo from '@/assets/walletconnect-logo.png';
import phantomLogo from '@/assets/phantom-logo.png';
import solflareLogo from '@/assets/solflare-logo.png';

console.log('PaymentHub component loading...');

interface VirtualCardData {
  id: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  status: 'active' | 'frozen' | 'expired';
  type: 'virtual' | 'physical';
}

const mockCards: VirtualCardData[] = [
  {
    id: '1',
    number: '4532 1234 5678 9012',
    expiry: '12/28',
    cvv: '123',
    balance: 2500.75,
    status: 'active',
    type: 'virtual'
  },
  {
    id: '2', 
    number: '5555 4444 3333 2222',
    expiry: '09/27',
    cvv: '456',
    balance: 1850.50,
    status: 'active',
    type: 'physical'
  }
];

const merchants = [
  { name: 'Netflix', icon: '📺', category: 'Entertainment' },
  { name: 'Spotify', icon: '🎵', category: 'Music' },
  { name: 'Amazon', icon: '📦', category: 'Shopping' },
  { name: 'Starbucks', icon: '☕', category: 'Food & Beverage' },
  { name: 'YouTube', icon: '▶️', category: 'Entertainment' },
  { name: 'TikTok', icon: '🎬', category: 'Social' },
  { name: 'Facebook', icon: '📘', category: 'Social' },
  { name: 'AliExpress', icon: '🛒', category: 'Shopping' },
];

export const PaymentHub = () => {
  console.log('PaymentHub component rendering...');
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<VirtualCardData>(mockCards[0]);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleCardOrder = (type: 'virtual' | 'physical') => {
    toast({
      title: `${type === 'virtual' ? 'Virtual' : 'Physical'} Card Ordered`,
      description: `Your new ${type} card will be ${type === 'virtual' ? 'available instantly' : 'shipped within 5-7 business days'}`,
    });
  };

  const handleWalletConnect = () => {
    toast({
      title: "Wallet Connected",
      description: "Your external wallet has been connected for seamless payments",
    });
  };

  const handleSendMoney = () => {
    if (!sendAmount || !recipient) {
      toast({
        title: "Invalid Input",
        description: "Please enter amount and recipient",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Money Sent Successfully",
      description: `Sent ${sendAmount} USDT to ${recipient}`,
    });
    setSendAmount('');
    setRecipient('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          ALL-IN-ONE CRYPTO PAYMENT SOLUTION
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Accessible crypto wallet for everyone, everywhere. Transform your crypto into everyday purchases!
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            $42M Insurance Coverage
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Real-time Transactions
          </Badge>
        </div>
      </div>

      {/* Card Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Virtual Card */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Virtual Card
            </CardTitle>
            <CardDescription>
              For any kind of transaction - Compatible with mobile wallets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Apple className="h-4 w-4" />
                <span>Apple Pay Compatible</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <NfcIcon className="h-4 w-4" />
                <span>Google Pay Compatible</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4" />
                <span>Instant Issuance</span>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => handleCardOrder('virtual')}
            >
              Get Virtual Card Now
            </Button>
          </CardContent>
        </Card>

        {/* Physical Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Physical Card
            </CardTitle>
            <CardDescription>
              Tap and Pay - Real-time transactions - ATM withdrawal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <NfcIcon className="h-4 w-4" />
                <span>Contactless Tap & Pay</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AtmSign className="h-4 w-4" />
                <span>ATM Withdrawal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>EMV Chip Security</span>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => handleCardOrder('physical')}
            >
              Order Physical Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Features Tabs */}
      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cards">My Cards</TabsTrigger>
          <TabsTrigger value="spend">Spend Everywhere</TabsTrigger>
          <TabsTrigger value="send">Send & Share</TabsTrigger>
          <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          {/* Card Management */}
          <Card>
            <CardHeader>
              <CardTitle>Your Payment Cards</CardTitle>
              <CardDescription>
                Manage your virtual and physical crypto payment cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockCards.map((card) => (
                <div key={card.id} className="p-6 border rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge variant={card.type === 'virtual' ? 'secondary' : 'default'}>
                      {card.type === 'virtual' ? 'Virtual' : 'Physical'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      <span className="text-sm opacity-75">AIKEYS Crypto Card</span>
                    </div>
                    
                    <div className="text-2xl font-mono tracking-wider">
                      {showCardDetails ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">Valid Thru</div>
                        <div className="font-mono">{card.expiry}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-75">Balance</div>
                        <div className="text-xl font-bold">${card.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">💳</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowCardDetails(!showCardDetails)}>
                  {showCardDetails ? 'Hide' : 'Show'} Details
                </Button>
                <Button variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spend" className="space-y-6">
          {/* Merchant Spending */}
          <Card>
            <CardHeader>
              <CardTitle>Spend Crypto Everywhere</CardTitle>
              <CardDescription>
                Use your crypto cards at millions of merchants worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {merchants.map((merchant, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-3xl mb-2">{merchant.icon}</div>
                    <div className="font-medium text-sm">{merchant.name}</div>
                    <div className="text-xs text-muted-foreground">{merchant.category}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CircleDollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="font-semibold">Instant Conversion</div>
                    <div className="text-sm text-muted-foreground">Crypto to fiat in real-time</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <NfcIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="font-semibold">Contactless Pay</div>
                    <div className="text-sm text-muted-foreground">Tap your phone or card</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="font-semibold">Secure Payments</div>
                    <div className="text-sm text-muted-foreground">Bank-grade encryption</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send" className="space-y-6">
          {/* Send & Share */}
          <Card>
            <CardHeader>
              <CardTitle>Share Happy Moments</CardTitle>
              <CardDescription>
                Split the bill with friends or send gifts in crypto with 0 transfer fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Money
                  </h3>
                  <div className="space-y-3">
                    <Input
                      placeholder="Recipient (email or wallet address)"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                    <Input
                      placeholder="Amount (USDT)"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                    />
                    <Button onClick={handleSendMoney} className="w-full">
                      <Gift className="h-4 w-4 mr-2" />
                      Send Gift
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Happy Valentine's</div>
                        <div className="text-sm text-muted-foreground">Sent to friend@email.com</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-500">-214 USDT</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Dinner on Apr 20</div>
                        <div className="text-sm text-muted-foreground">From alice@email.com</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-500">+8.7 USDT</div>
                        <div className="text-xs text-muted-foreground">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <Button variant="outline" size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  Split Bill with Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connect" className="space-y-6">
          {/* Connect Wallet */}
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your external wallet for deposit-free seamless payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={metamaskLogo} alt="MetaMask" className="h-8 w-8" />
                  <span className="text-sm">MetaMask</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={trustwalletLogo} alt="Trust Wallet" className="h-8 w-8" />
                  <span className="text-sm">Trust Wallet</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={coinbaseLogo} alt="Coinbase Wallet" className="h-8 w-8" />
                  <span className="text-sm">Coinbase Wallet</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={walletconnectLogo} alt="WalletConnect" className="h-8 w-8" />
                  <span className="text-sm">WalletConnect</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={phantomLogo} alt="Phantom" className="h-8 w-8" />
                  <span className="text-sm">Phantom</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWalletConnect}
                >
                  <img src={solflareLogo} alt="Solflare" className="h-8 w-8" />
                  <span className="text-sm">Solflare</span>
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-semibold">Your Assets Are Safe</div>
                    <div className="text-sm text-muted-foreground">
                      Client asset segregation with Licensed Trust Company and $42M insurance coverage
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Security Features</CardTitle>
          <CardDescription>
            Your funds are protected with enterprise-grade security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Fingerprint className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <div className="font-semibold">Biometric Auth</div>
              <div className="text-sm text-muted-foreground">Fingerprint & Face ID</div>
            </div>
            
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <div className="font-semibold">Insurance Coverage</div>
              <div className="text-sm text-muted-foreground">$42M Protection</div>
            </div>
            
            <div className="text-center">
              <QrCode className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <div className="font-semibold">2FA Security</div>
              <div className="text-sm text-muted-foreground">Multi-factor Auth</div>
            </div>
            
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <div className="font-semibold">Real-time Alerts</div>
              <div className="text-sm text-muted-foreground">Instant Notifications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};