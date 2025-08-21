import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUpdateNiumSpendingLimits } from '@/hooks/useNiumFamily';
import { Loader2, Shield, DollarSign, CreditCard, User } from 'lucide-react';
import type { NiumFamilyMember } from '@/lib/nium/family-api';

interface NiumEditFamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: NiumFamilyMember | null;
}

export const NiumEditFamilyMemberDialog: React.FC<NiumEditFamilyMemberDialogProps> = ({
  open,
  onClose,
  member,
}) => {
  const [spendingLimit, setSpendingLimit] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);

  const updateLimits = useUpdateNiumSpendingLimits();

  useEffect(() => {
    if (member) {
      setSpendingLimit(member.spendingLimit);
      setDailyLimit(member.dailyLimit);
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;

    try {
      await updateLimits.mutateAsync({
        memberId: member.id,
        limits: {
          spendingLimit,
          dailyLimit,
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update spending limits:', error);
    }
  };

  const handleClose = () => {
    if (!updateLimits.isPending) {
      onClose();
    }
  };

  if (!member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Family Member - NIUM Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Member Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{member.firstName} {member.lastName}</h3>
              <Badge className={getStatusColor(member.status)}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Account Balance</p>
                <p className="font-medium">AED {member.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Card Status</p>
                <p className="font-medium">
                  {member.cardDetails ? `**** ${member.cardDetails.last4}` : 'No Card'}
                </p>
              </div>
            </div>
          </div>

          {/* NIUM Account Details */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              NIUM Account Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-mono">{member.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IBAN:</span>
                <span className="font-mono text-xs">{member.iban}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-mono text-xs">{member.customerHashId.slice(0, 12)}...</span>
              </div>
            </div>
          </div>

          {/* Spending Limits Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spendingLimit" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Monthly Limit (AED)
                </Label>
                <Input
                  id="spendingLimit"
                  type="number"
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(Number(e.target.value))}
                  min={10}
                  max={5000}
                  disabled={updateLimits.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyLimit" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Daily Limit (AED)
                </Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  min={5}
                  max={500}
                  disabled={updateLimits.isPending}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                Changes will be applied immediately to the NIUM account and virtual card.
                New limits will be enforced for all future transactions.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateLimits.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateLimits.isPending}
              >
                {updateLimits.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating NIUM...
                  </>
                ) : (
                  'Update Limits'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};