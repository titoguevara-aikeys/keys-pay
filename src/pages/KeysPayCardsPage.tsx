import React, { useState } from 'react';
import { KeysPayCardShowcase } from '@/components/KeysPayCardShowcase';
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

const mockCards: VirtualCard[] = [
  {
    id: '1',
    cardNumber: '4532123456789012',
    expiryMonth: 12,
    expiryYear: 2027,
    cvv: '123',
    status: 'active' as const,
    balance: 2500,
    spendingLimit: {
      daily: 500,
      monthly: 2000,
      perTransaction: 250
    },
    cardType: 'virtual' as const,
    lastFour: '9012',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    cardNumber: '5555444433332222',
    expiryMonth: 8,
    expiryYear: 2026,
    cvv: '456',
    status: 'blocked' as const,
    balance: 750,
    spendingLimit: {
      daily: 300,
      monthly: 1000,
      perTransaction: 150
    },
    cardType: 'virtual' as const,
    lastFour: '2222',
    createdAt: '2024-02-01'
  }
];

const KeysPayCardsPage = () => {
  const [cards, setCards] = useState<VirtualCard[]>(mockCards);
  const [loading, setLoading] = useState(false);

  const handleIssueCard = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCard: VirtualCard = {
        id: Date.now().toString(),
        cardNumber: '4532' + Math.random().toString().slice(2, 14),
        expiryMonth: 12,
        expiryYear: 2027,
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        status: 'active',
        balance: 0,
        spendingLimit: {
          daily: data.dailyLimit || 500,
          monthly: data.spendingLimit || 2000,
          perTransaction: data.perTransactionLimit || 250
        },
        cardType: data.cardType || 'virtual',
        lastFour: Math.random().toString().slice(-4),
        createdAt: new Date().toISOString()
      };

      setCards(prev => [...prev, newCard]);
      toast.success('Virtual card issued successfully!');
    } catch (error) {
      toast.error('Failed to issue card');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimits = async (cardId: string, limits: any) => {
    try {
      setCards(prev => prev.map(card => 
        card.id === cardId 
          ? { ...card, spendingLimit: limits }
          : card
      ));
      toast.success('Card limits updated successfully!');
    } catch (error) {
      toast.error('Failed to update limits');
      throw error;
    }
  };

  const handleToggleCard = async (cardId: string, action: 'block' | 'unblock') => {
    try {
      setCards(prev => prev.map(card => 
        card.id === cardId 
          ? { ...card, status: action === 'block' ? 'blocked' : 'active' }
          : card
      ));
      toast.success(`Card ${action}ed successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} card`);
      throw error;
    }
  };

  return (
    <div className="p-8">
      <KeysPayCardShowcase
        cards={cards}
        onIssueCard={handleIssueCard}
        onUpdateLimits={handleUpdateLimits}
        onToggleCard={handleToggleCard}
      />
    </div>
  );
};

export default KeysPayCardsPage;