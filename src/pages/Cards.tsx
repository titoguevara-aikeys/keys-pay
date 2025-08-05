import React, { useState } from 'react';
import { Plus, CreditCard, Lock, Unlock, Settings, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCards, useCreateCard, useUpdateCard } from '@/hooks/useCards';
import { CreateCardDialog } from '@/components/CreateCardDialog';
import { VirtualCard } from '@/components/VirtualCard';
import { useToast } from '@/hooks/use-toast';

const Cards = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const { data: cards, isLoading } = useCards();
  const updateCard = useUpdateCard();
  const { toast } = useToast();

  const handleCardToggle = async (cardId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'frozen' : 'active';
      await updateCard.mutateAsync({
        cardId,
        updates: { card_status: newStatus }
      });

      toast({
        title: `Card ${newStatus}`,
        description: `Your card has been ${newStatus === 'active' ? 'activated' : 'frozen'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating card',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Virtual Cards</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your virtual payment cards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowCardNumbers(!showCardNumbers)}
            >
              {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCardNumbers ? 'Hide' : 'Show'} Numbers
            </Button>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Card
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cards?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
              <Unlock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {cards?.filter(card => card.card_status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frozen Cards</CardTitle>
              <Lock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {cards?.filter(card => card.card_status === 'frozen').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,247</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Cards</h2>
          
          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <VirtualCard 
                  key={card.id} 
                  card={card}
                  showNumber={showCardNumbers}
                  onToggleStatus={() => handleCardToggle(card.id, card.card_status)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent className="space-y-4">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No cards yet</h3>
                  <p className="text-muted-foreground">
                    Create your first virtual card to start making secure payments
                  </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Card
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Card Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Why Use Virtual Cards?</CardTitle>
            <CardDescription>
              Benefits of using virtual payment cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Enhanced Security</h4>
                <p className="text-sm text-muted-foreground">
                  Each card has unique numbers, protecting your main account
                </p>
              </div>
              <div className="text-center space-y-2">
                <Settings className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Spending Control</h4>
                <p className="text-sm text-muted-foreground">
                  Set custom limits and freeze cards instantly when needed
                </p>
              </div>
              <div className="text-center space-y-2">
                <Eye className="h-8 w-8 text-primary mx-auto" />
                <h4 className="font-medium">Easy Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor spending per card and categorize transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateCardDialog 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default Cards;