import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MockAuthContext';

interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  recipient?: string;
}

export const useTransferMoney = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (transferData: TransferData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { fromAccountId, toAccountId, amount, description, recipient } = transferData;
      
      // Get both accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .in('id', [fromAccountId, toAccountId]);
      
      if (accountsError) throw accountsError;
      if (!accounts || accounts.length !== 2) throw new Error('Accounts not found');
      
      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      const toAccount = accounts.find(acc => acc.id === toAccountId);
      
      if (!fromAccount || !toAccount) throw new Error('Invalid accounts');
      if (fromAccount.balance < amount) throw new Error('Insufficient funds');
      
      // Manual transfer implementation
      const newFromBalance = fromAccount.balance - amount;
      const newToBalance = toAccount.balance + amount;
      
      // Update from account
      const { error: updateFromError } = await supabase
        .from('accounts')
        .update({ balance: newFromBalance })
        .eq('id', fromAccountId);
      
      if (updateFromError) throw updateFromError;
      
      // Update to account
      const { error: updateToError } = await supabase
        .from('accounts')
        .update({ balance: newToBalance })
        .eq('id', toAccountId);
      
      if (updateToError) throw updateToError;
      
      // Record transactions
      const transactions = [
        {
          account_id: fromAccountId,
          transaction_type: 'transfer_out',
          amount: -amount,
          description: description || `Transfer to ${recipient || 'recipient'}`,
          recipient: recipient || 'Unknown',
          status: 'completed'
        },
        {
          account_id: toAccountId,
          transaction_type: 'transfer_in',
          amount: amount,
          description: description || 'Transfer received',
          recipient: 'Self',
          status: 'completed'
        }
      ];
      
      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(transactions);
      
      if (transactionsError) throw transactionsError;
      
      return { success: true, amount, fromAccount: fromAccount.account_number, toAccount: toAccount.account_number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};