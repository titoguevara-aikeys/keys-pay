import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  ShoppingCart,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Smartphone,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Users
} from 'lucide-react';
import { useCards, useCreateCard, useUpdateCard } from '@/hooks/useCards';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';
import { VirtualCard } from './VirtualCard';
import { PhysicalCardOrder } from './PhysicalCardOrder';
import { CreateCardDialog } from './CreateCardDialog';

const EnhancedCardManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPhysicalOrder, setShowPhysicalOrder] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardFilters, setCardFilters] = useState({
    status: 'all',
    type: 'all'
  });

  const { data: cards, isLoading: cardsLoading } = useCards();
  const { data: accounts } = useAccounts();
  const updateCard = useUpdateCard();
  const { toast } = useToast();

  // Mock data for enhanced features
  const cardStats = {
    totalCards: cards?.length || 0,
    activeCards: cards?.filter(c => c.card_status === 'active').length || 0,
    monthlySpending: 2847.50,
    pendingTransactions: 3,
    securityScore: 95
  };

  const recentTransactions = [
    { id: '1', merchant: 'Amazon', amount: 89.99, date: '2024-01-08', status: 'completed' },
    { id: '2', merchant: 'Starbucks', amount: 5.75, date: '2024-01-08', status: 'completed' },
    { id: '3', merchant: 'Spotify', amount: 9.99, date: '2024-01-07', status: 'completed' },
    { id: '4', merchant: 'Uber', amount: 24.50, date: '2024-01-07', status: 'pending' }
  ];

  const cardTypes = [
    { value: 'debit', label: 'Debit Card', description: 'Direct account access' },
    { value: 'credit', label: 'Credit Card', description: 'Credit line access' },
    { value: 'prepaid', label: 'Prepaid Card', description: 'Preloaded balance' },
    { value: 'virtual', label: 'Virtual Card', description: 'Online only' },
    { value: 'family', label: 'Family Card', description: 'Shared access' }
  ];

  const securityFeatures = [
    { name: 'Real-time Fraud Protection', enabled: true, icon: Shield },
    { name: 'Mobile Notifications', enabled: true, icon: Smartphone },
    { name: 'Geographic Blocking', enabled: false, icon: Globe },
    { name: 'Merchant Category Controls', enabled: true, icon: ShoppingCart }
  ];

  const handleToggleCard = async (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';
    
    try {
      await updateCard.mutateAsync({
        cardId,
        updates: { card_status: newStatus },
      });
      
      toast({
        title: `Card ${newStatus === 'active' ? 'Activated' : 'Frozen'}`,
        description: `Your card has been ${newStatus === 'active' ? 'activated' : 'frozen'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Update Card',
        description: error.message || 'Failed to update card status.',
        variant: 'destructive',
      });
    }
  };

  const filteredCards = cards?.filter(card => {
    if (cardFilters.status !== 'all' && card.card_status !== cardFilters.status) return false;
    if (cardFilters.type !== 'all' && card.card_type !== cardFilters.type) return false;
    return true;
  }) || [];

  if (cardsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Card Management</h1>
          <p className="text-muted-foreground">Manage your virtual and physical payment cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPhysicalOrder(true)}>
            <Package className="h-4 w-4 mr-2" />
            Order Physical
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Card
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold">{cardStats.totalCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Cards</p>
                <p className="text-2xl font-bold">{cardStats.activeCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
                <p className="text-2xl font-bold">${cardStats.monthlySpending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{cardStats.pendingTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">{cardStats.securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cards">My Cards</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-6 w-6 mb-2" />
                    Create Card
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setShowPhysicalOrder(true)}>
                    <Package className="h-6 w-6 mb-2" />
                    Order Physical
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.merchant}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.amount}</p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Cards Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Active Cards
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCardNumbers(!showCardNumbers)}
                >
                  {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.slice(0, 3).map((card) => (
                    <VirtualCard
                      key={card.id}
                      card={card}
                      showNumber={showCardNumbers}
                      onToggleStatus={() => handleToggleCard(card.id, card.card_status)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Active Cards</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first card to start making secure payments.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Card
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="status-filter">Status:</Label>
                  <Select value={cardFilters.status} onValueChange={(value) => setCardFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="type-filter">Type:</Label>
                  <Select value={cardFilters.type} onValueChange={(value) => setCardFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {cardTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCardNumbers(!showCardNumbers)}
                >
                  {showCardNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showCardNumbers ? 'Hide' : 'Show'} Numbers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards Grid */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <VirtualCard
                  key={card.id}
                  card={card}
                  showNumber={showCardNumbers}
                  onToggleStatus={() => handleToggleCard(card.id, card.card_status)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent className="space-y-4">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No Cards Found</h3>
                  <p className="text-muted-foreground">
                    {cardFilters.status !== 'all' || cardFilters.type !== 'all' 
                      ? 'No cards match your current filters.'
                      : 'Create your first card to get started.'
                    }
                  </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Card
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <Switch checked={feature.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{cardStats.securityScore}%</div>
                  <p className="text-muted-foreground">Excellent Security</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Biometric Protection</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Device Verification</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Spending Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed spending analytics and insights will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateCardDialog 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
      
      <PhysicalCardOrder 
        open={showPhysicalOrder}
        onClose={() => setShowPhysicalOrder(false)}
        virtualCard={selectedCard}
      />
    </div>
  );
};

export default EnhancedCardManagement;