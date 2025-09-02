import React, { useState } from 'react';
import { KeysPayCardShowcase } from '@/components/KeysPayCardShowcase';
import { useKeysPayCards, useIssueCard, useUpdateCardLimits, useToggleCardStatus } from '@/hooks/useKeysPayCards';

const KeysPayCardsPage = () => {
  const [loading, setLoading] = useState(false);
  
  const { data: cards = [], isLoading } = useKeysPayCards();
  const issueCardMutation = useIssueCard();
  const updateLimitsMutation = useUpdateCardLimits();
  const toggleStatusMutation = useToggleCardStatus();

  const handleIssueCard = async (data: any) => {
    await issueCardMutation.mutateAsync({
      cardType: data.cardType || 'virtual',
      spendingLimit: data.spendingLimit || 2000,
      dailyLimit: data.dailyLimit || 500,
      perTransactionLimit: data.perTransactionLimit || 250
    });
  };

  const handleUpdateLimits = async (cardId: string, limits: any) => {
    await updateLimitsMutation.mutateAsync({ cardId, limits });
  };

  const handleToggleCard = async (cardId: string, action: 'block' | 'unblock') => {
    await toggleStatusMutation.mutateAsync({ cardId, action });
  };

  // Transform cards data to match component interface
  const transformedCards = cards.map(card => ({
    id: card.id,
    cardNumber: card.card_number,
    expiryMonth: card.expiry_month || 12,
    expiryYear: card.expiry_year || 2027,
    cvv: card.cvv || '123',
    status: card.card_status as 'active' | 'blocked' | 'expired',
    balance: 0, // Would come from account balance
    spendingLimit: card.spending_limits || {
      daily: 500,
      monthly: 2000,
      perTransaction: 250
    },
    cardType: card.card_type as 'virtual' | 'physical',
    lastFour: card.last_four || card.card_number.slice(-4),
    createdAt: card.created_at
  }));

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <KeysPayCardShowcase
        cards={transformedCards}
        onIssueCard={handleIssueCard}
        onUpdateLimits={handleUpdateLimits}
        onToggleCard={handleToggleCard}
      />
    </div>
  );
};

export default KeysPayCardsPage;