import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Copy, CreditCard, Plus, Settings, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface VirtualCard {
  id: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  status: 'active' | 'blocked' | 'expired';
  balance: number;
  spendingLimit: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  cardType: 'virtual' | 'physical';
  lastFour: string;
  createdAt: string;
}

interface KeysPayCardShowcaseProps {
  cards: VirtualCard[];
  onIssueCard: (data: any) => Promise<void>;
  onUpdateLimits: (cardId: string, limits: any) => Promise<void>;
  onToggleCard: (cardId: string, action: 'block' | 'unblock') => Promise<void>;
}

export const KeysPayCardShowcase: React.FC<KeysPayCardShowcaseProps> = ({
  cards,
  onIssueCard,
  onUpdateLimits,
  onToggleCard
}) => {
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatCardNumber = (number: string, show: boolean) => {
    if (!show) return `•••• •••• •••• ${number.slice(-4)}`;
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getCardBackground = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-br from-primary to-primary/80';
      case 'blocked': return 'bg-gradient-to-br from-destructive to-destructive/80';
      default: return 'bg-gradient-to-br from-muted to-muted/80';
    }
  };

  const CardComponent = ({ card }: { card: VirtualCard }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={`${getCardBackground(card.status)} text-white p-6 relative`}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/80 text-sm">Keys Pay</p>
              <Badge variant="secondary" className="mt-1">
                {card.cardType === 'virtual' ? 'Virtual' : 'Physical'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCardVisibility(card.id)}
                className="text-white hover:bg-white/20"
              >
                {showCardNumbers[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(card.cardNumber, 'Card number')}
                className="text-white hover:bg-white/20"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-white/80 text-xs mb-1">Card Number</p>
              <p className="text-xl font-mono tracking-wider">
                {formatCardNumber(card.cardNumber, showCardNumbers[card.id])}
              </p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-white/80 text-xs">Expires</p>
                <p className="font-mono">
                  {showCardNumbers[card.id] 
                    ? `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}`
                    : '••/••'
                  }
                </p>
              </div>
              <div>
                <p className="text-white/80 text-xs">CVV</p>
                <p className="font-mono">
                  {showCardNumbers[card.id] ? card.cvv : '•••'}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-xs">Balance</p>
                <p className="font-semibold">${card.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 opacity-20">
            <CreditCard size={48} />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={card.status === 'active' ? 'default' : 'destructive'}>
              {card.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Daily</span>
              <p className="font-medium">${card.spendingLimit.daily.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Monthly</span>
              <p className="font-medium">${card.spendingLimit.monthly.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Per Tx</span>
              <p className="font-medium">${card.spendingLimit.perTransaction.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCard(card)}
              className="flex-1"
            >
              <Settings size={16} className="mr-1" />
              Settings
            </Button>
            <Button
              variant={card.status === 'active' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onToggleCard(card.id, card.status === 'active' ? 'block' : 'unblock')}
              className="flex-1"
            >
              <Shield size={16} className="mr-1" />
              {card.status === 'active' ? 'Block' : 'Unblock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const IssueCardDialog = () => {
    const [formData, setFormData] = useState({
      cardType: 'virtual',
      spendingLimit: 1000,
      dailyLimit: 500,
      perTransactionLimit: 100
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await onIssueCard(formData);
        setIsIssueDialogOpen(false);
        toast.success('Card issued successfully!');
      } catch (error) {
        toast.error('Failed to issue card');
      }
    };

    return (
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus size={16} className="mr-2" />
            Issue New Card
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue New Virtual Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardType">Card Type</Label>
              <Select value={formData.cardType} onValueChange={(value) => setFormData({...formData, cardType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual Card</SelectItem>
                  <SelectItem value="physical">Physical Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="spendingLimit">Monthly Spending Limit ($)</Label>
              <Input
                id="spendingLimit"
                type="number"
                value={formData.spendingLimit}
                onChange={(e) => setFormData({...formData, spendingLimit: parseInt(e.target.value)})}
                min="100"
                max="10000"
              />
            </div>

            <div>
              <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({...formData, dailyLimit: parseInt(e.target.value)})}
                min="50"
                max="2000"
              />
            </div>

            <div>
              <Label htmlFor="perTransactionLimit">Per Transaction Limit ($)</Label>
              <Input
                id="perTransactionLimit"
                type="number"
                value={formData.perTransactionLimit}
                onChange={(e) => setFormData({...formData, perTransactionLimit: parseInt(e.target.value)})}
                min="10"
                max="500"
              />
            </div>

            <Button type="submit" className="w-full">
              <Zap size={16} className="mr-2" />
              Issue Card Instantly
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Virtual Cards</h2>
          <p className="text-muted-foreground">Manage your Keys Pay virtual cards</p>
        </div>
        <IssueCardDialog />
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Issue your first virtual card to start making secure payments
            </p>
            <Button onClick={() => setIsIssueDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Issue First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </div>
      )}

      {/* Card Settings Dialog */}
      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Card Settings</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="limits" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="limits">Spending Limits</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
              </TabsList>
              <TabsContent value="limits" className="space-y-4">
                <div>
                  <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    defaultValue={selectedCard.spendingLimit.daily}
                    min="50"
                    max="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    defaultValue={selectedCard.spendingLimit.monthly}
                    min="100"
                    max="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="perTxLimit">Per Transaction Limit ($)</Label>
                  <Input
                    id="perTxLimit"
                    type="number"
                    defaultValue={selectedCard.spendingLimit.perTransaction}
                    min="10"
                    max="500"
                  />
                </div>
                <Button className="w-full">Update Limits</Button>
              </TabsContent>
              <TabsContent value="controls" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Online purchases</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>International transactions</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ATM withdrawals</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Contactless payments</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
                <Button className="w-full">Update Controls</Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};