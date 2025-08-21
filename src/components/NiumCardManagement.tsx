import React, { useState, useMemo, useCallback } from 'react';
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
  Users,
  Activity,
  Truck
} from 'lucide-react';
import { 
  useNiumCards,
  useNiumIssueCard,
  useNiumCardToggle,
  useNiumCardTransactions,
  useNiumCardControls,
  useNiumUpdateCardControls,
  useNiumUpdateSpendingLimits,
  useNiumOrderPhysicalCard,
  useNiumTrackPhysicalCard,
  useNiumCardsHealth
} from '@/hooks/useNiumCards';
import { useToast } from '@/hooks/use-toast';
import { NiumVirtualCard } from './NiumVirtualCard';
import { NiumCreateCardDialog } from './NiumCreateCardDialog';
import { NiumPhysicalCardOrder } from './NiumPhysicalCardOrder';
import { CardsSkeleton } from './skeletons/CardsSkeleton';

const NiumCardManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPhysicalOrder, setShowPhysicalOrder] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardFilters, setCardFilters] = useState({
    status: 'all',
    type: 'all'
  });

  // NIUM Cards hooks
  const { data: cards, isLoading: cardsLoading } = useNiumCards();
  const { data: healthCheck } = useNiumCardsHealth();
  const issueCard = useNiumIssueCard();
  const toggleCard = useNiumCardToggle();
  const orderPhysicalCard = useNiumOrderPhysicalCard();
  const { toast } = useToast();

  // Memoized callbacks to prevent unnecessary re-renders
  const handleStatusChange = useCallback((value: string) => {
    setCardFilters(prev => ({ ...prev, status: value }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setCardFilters(prev => ({ ...prev, type: value }));
  }, []);

  const handleShowCardNumbers = useCallback(() => {
    setShowCardNumbers(!showCardNumbers);
  }, [showCardNumbers]);

  const handleCreateDialog = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handlePhysicalOrder = useCallback(() => {
    setShowPhysicalOrder(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setShowCreateDialog(false);
  }, []);

  const handleClosePhysicalOrder = useCallback(() => {
    setShowPhysicalOrder(false);
  }, []);

  // Memoized data to prevent unnecessary recalculations
  const cardStats = useMemo(() => {
    if (!cards) return {
      totalCards: 0,
      activeCards: 0,
      virtualCards: 0,
      physicalCards: 0,
      totalBalance: 0,
      monthlySpending: 0
    };

    return {
      totalCards: cards.length,
      activeCards: cards.filter(c => c.status === 'active').length,
      virtualCards: cards.filter(c => c.cardType === 'virtual').length,
      physicalCards: cards.filter(c => c.cardType === 'physical').length,
      totalBalance: cards.reduce((sum, c) => sum + c.balance, 0),
      monthlySpending: 2847.50 // This would come from transactions in real implementation
    };
  }, [cards]);

  const handleToggleCard = useCallback(async (cardId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'block' : 'unblock';
    
    try {
      await toggleCard.mutateAsync({
        cardId,
        action,
        reason: action === 'block' ? 'User requested' : undefined
      });
    } catch (error) {
      // Error is handled by the hook
    }
  }, [toggleCard]);

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    
    return cards.filter(card => {
      if (cardFilters.status !== 'all' && card.status !== cardFilters.status) return false;
      if (cardFilters.type !== 'all' && card.cardType !== cardFilters.type) return false;
      return true;
    });
  }, [cards, cardFilters.status, cardFilters.type]);

  if (cardsLoading) {
    return <CardsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">NIUM Card Management</h1>
          <p className="text-muted-foreground">Manage your NIUM virtual and physical payment cards</p>
          {healthCheck && (
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${healthCheck.ok ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                NIUM Sandbox {healthCheck.ok ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePhysicalOrder}>
            <Package className="h-4 w-4 mr-2" />
            Order Physical
          </Button>
          <Button onClick={handleCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New Card
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Virtual Cards</p>
                <p className="text-2xl font-bold">{cardStats.virtualCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Physical Cards</p>
                <p className="text-2xl font-bold">{cardStats.physicalCards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">${cardStats.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
                <p className="text-2xl font-bold">${cardStats.monthlySpending.toLocaleString()}</p>
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
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Active Cards Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  NIUM Cards Overview
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowCardNumbers}
                >
                  {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.slice(0, 3).map((card) => (
                    <NiumVirtualCard
                      key={card.id}
                      card={card}
                      showNumber={showCardNumbers}
                      onToggleStatus={() => handleToggleCard(card.cardId, card.status)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No NIUM Cards</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first NIUM card to start making secure payments.
                  </p>
                  <Button onClick={handleCreateDialog}>
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
                  <Select value={cardFilters.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="type-filter">Type:</Label>
                  <Select value={cardFilters.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowCardNumbers}
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
                <NiumVirtualCard
                  key={card.id}
                  card={card}
                  showNumber={showCardNumbers}
                  onToggleStatus={() => handleToggleCard(card.cardId, card.status)}
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
                      : 'Create your first NIUM card to get started.'
                    }
                  </p>
                </div>
                <Button onClick={handleCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Card
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Select a card to view its transaction history
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Select a card to manage its security settings
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NiumCreateCardDialog 
        open={showCreateDialog} 
        onClose={handleCloseCreateDialog}
      />
      
      <NiumPhysicalCardOrder 
        open={showPhysicalOrder} 
        onClose={handleClosePhysicalOrder}
      />
    </div>
  );
};

export default NiumCardManagement;