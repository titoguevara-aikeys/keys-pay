import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Settings, Eye, EyeOff, Lock } from 'lucide-react';
import { useCards, useCreateCard, useUpdateCard } from '@/hooks/useCards';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const CardManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cardType, setCardType] = useState('');
  const [linkedAccount, setLinkedAccount] = useState('');
  const [spendingLimit, setSpendingLimit] = useState('');
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { data: cards, isLoading: cardsLoading } = useCards();
  const { data: accounts } = useAccounts();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const { toast } = useToast();
  
  const handleCreateCard = async () => {
    if (!cardType || !linkedAccount) {
      toast({
        title: "Missing Information",
        description: "Please select card type and linked account.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await createCard.mutateAsync({
        account_id: linkedAccount,
        card_type: cardType,
        spending_limit: spendingLimit ? parseFloat(spendingLimit) : undefined,
      });
      
      toast({
        title: "Card Created Successfully",
        description: "Your new virtual card is ready to use.",
      });
      
      // Reset form
      setCardType('');
      setLinkedAccount('');
      setSpendingLimit('');
      setCreateDialogOpen(false);
      
    } catch (error: any) {
      toast({
        title: "Failed to Create Card",
        description: error.message || "Failed to create card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
        title: "Failed to Update Card",
        description: error.message || "Failed to update card status.",
        variant: "destructive",
      });
    }
  };
  
  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'from-blue-500 to-blue-600';
      case 'physical': return 'from-purple-500 to-purple-600';
      case 'family': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };
  
  const maskCardNumber = (cardNumber: string) => {
    if (showCardNumbers) return cardNumber;
    return cardNumber.replace(/\d(?=\d{4})/g, '•');
  };
  
  if (cardsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Virtual Cards</CardTitle>
            <CardDescription>Manage your digital payment cards</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCardNumbers(!showCardNumbers)}
            >
              {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Card
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Virtual Card</DialogTitle>
                  <DialogDescription>
                    Create a new virtual card for online payments and spending control.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-type">Card Type</Label>
                    <Select value={cardType} onValueChange={setCardType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="virtual">Virtual Card</SelectItem>
                        <SelectItem value="physical">Physical Card</SelectItem>
                        <SelectItem value="family">Family Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linked-account">Linked Account</Label>
                    <Select value={linkedAccount} onValueChange={setLinkedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_type} - ${account.balance.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="spending-limit">Monthly Spending Limit (Optional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="spending-limit"
                        type="number"
                        placeholder="1000.00"
                        value={spendingLimit}
                        onChange={(e) => setSpendingLimit(e.target.value)}
                        className="pl-8"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCard} disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Card"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className={`relative p-6 rounded-xl bg-gradient-to-r ${getCardTypeColor(card.card_type)} text-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90 capitalize">{card.card_type} Card</p>
                  <p className="text-lg font-mono font-medium tracking-wider">
                    {maskCardNumber(card.card_number)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={card.card_status === 'active' ? 'default' : 'secondary'}
                    className="bg-white/20 text-white"
                  >
                    {card.card_status}
                  </Badge>
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  {card.spending_limit && (
                    <p className="text-xs opacity-75">
                      Limit: ${card.spending_limit.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs opacity-75">
                    Created: {new Date(card.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={() => handleToggleCard(card.id, card.card_status)}
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Cards Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first virtual card to start making secure payments.
            </p>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Card
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardManagement;