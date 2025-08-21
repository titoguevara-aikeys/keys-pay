import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTransferToChild } from '@/hooks/useNiumFamily';
import { Loader2, Send, DollarSign, ArrowRight } from 'lucide-react';
import type { NiumFamilyMember } from '@/lib/nium/family-api';

interface NiumTransferMoneyDialogProps {
  open: boolean;
  onClose: () => void;
  member: NiumFamilyMember | null;
}

export const NiumTransferMoneyDialog: React.FC<NiumTransferMoneyDialogProps> = ({
  open,
  onClose,
  member,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency] = useState('AED'); // Fixed to AED for NIUM sandbox

  const transferMoney = useTransferToChild();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member || !amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      await transferMoney.mutateAsync({
        parentWalletId: 'parent-wallet-id', // This would come from parent's auth context
        childWalletId: member.walletHashId,
        amount: parseFloat(amount),
        currency,
        description: description || `Transfer to ${member.firstName}`,
      });
      
      // Reset form and close dialog
      setAmount('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to transfer money:', error);
    }
  };

  const handleClose = () => {
    if (!transferMoney.isPending) {
      onClose();
    }
  };

  if (!member) return null;

  const maxTransfer = 500; // Example limit for demo
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxTransfer;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Transfer Money via NIUM
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{member.firstName} {member.lastName}</h3>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                NIUM Account
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Balance</p>
                <p className="font-medium text-lg">AED {member.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily Limit</p>
                <p className="font-medium">AED {member.dailyLimit}</p>
              </div>
            </div>
          </div>

          {/* Transfer Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Transfer Amount (AED)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
                min="0.01"
                max={maxTransfer}
                required
                disabled={transferMoney.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Maximum transfer: AED {maxTransfer}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Weekly allowance, reward, etc."
                maxLength={100}
                disabled={transferMoney.isPending}
                rows={2}
              />
            </div>

            {/* Transfer Preview */}
            {isValidAmount && (
              <div className="p-3 bg-gray-50 rounded border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Transfer Preview
                  <ArrowRight className="h-4 w-4" />
                </h4>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-muted-foreground">From: Parent Account</p>
                    <p className="text-muted-foreground">To: {member.firstName}'s NIUM Account</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">AED {parseFloat(amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Instant transfer</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                Funds will be transferred instantly to {member.firstName}'s NIUM virtual account 
                and will be available immediately for card transactions.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={transferMoney.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValidAmount || transferMoney.isPending}
              >
                {transferMoney.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Transfer AED {amount || '0.00'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};