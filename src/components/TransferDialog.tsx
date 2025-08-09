/*
 * AIKEYS FINANCIAL PLATFORM - ENHANCED TRANSFER DIALOG
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, CreditCard, Users, Building, Smartphone, 
  Clock, Shield, Check, AlertCircle 
} from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransferMoney } from '@/hooks/useTransfer';
import { useToast } from '@/hooks/use-toast';

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
}

export const TransferDialog: React.FC<TransferDialogProps> = ({ open, onClose }) => {
  const { data: accounts } = useAccounts();
  const transferMoney = useTransferMoney();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [transferType, setTransferType] = useState<'internal' | 'external' | 'contact'>('internal');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const resetForm = () => {
    setStep('details');
    setTransferType('internal');
    setFromAccount('');
    setToAccount('');
    setAmount('');
    setDescription('');
    setRecipient('');
    setRecipientEmail('');
    setRecipientPhone('');
    setIsUrgent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    if (step === 'details') {
      setStep('review');
    }
  };

  const handleTransfer = async () => {
    if (transferType === 'internal' && fromAccount && toAccount) {
      try {
        await transferMoney.mutateAsync({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
          description,
          recipient: accounts?.find(acc => acc.id === toAccount)?.account_number || 'Internal Transfer'
        });
        
        setStep('success');
        toast({
          title: 'Transfer completed!',
          description: `Successfully transferred $${amount}`,
        });
      } catch (error) {
        toast({
          title: 'Transfer failed',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
      }
    } else {
      // For external transfers, show success (mock implementation)
      setStep('success');
      toast({
        title: 'Transfer initiated!',
        description: `$${amount} transfer to ${recipient} is being processed`,
      });
    }
  };

  const getTransferFee = () => {
    if (transferType === 'internal') return 0;
    if (isUrgent) return 2.99;
    return 0.99;
  };

  const getTransferTime = () => {
    if (transferType === 'internal') return 'Instant';
    if (isUrgent) return '15 minutes';
    return '1-2 business days';
  };

  const selectedFromAccount = accounts?.find(acc => acc.id === fromAccount);
  const totalAmount = parseFloat(amount || '0') + getTransferFee();

  if (step === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Transfer Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your transfer of ${amount} has been {transferType === 'internal' ? 'completed' : 'initiated'}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span className="font-medium">${getTransferFee()}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span className="font-medium">{getTransferTime()}</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'details' ? 'Send Money' : 'Review Transfer'}
          </DialogTitle>
          <DialogDescription>
            {step === 'details' 
              ? 'Choose how you want to send money' 
              : 'Please review your transfer details'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            {/* Transfer Type Selection */}
            <div className="space-y-3">
              <Label>Transfer Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card 
                  className={`cursor-pointer border-2 ${transferType === 'internal' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setTransferType('internal')}
                >
                  <CardContent className="p-4 text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Between Accounts</p>
                    <p className="text-xs text-muted-foreground">Instant • Free</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer border-2 ${transferType === 'contact' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setTransferType('contact')}
                >
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">To Contact</p>
                    <p className="text-xs text-muted-foreground">15 min • $2.99</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer border-2 ${transferType === 'external' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setTransferType('external')}
                >
                  <CardContent className="p-4 text-center">
                    <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">1-2 days • $0.99</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* From Account */}
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account to send from" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.account_number} ({account.account_type})</span>
                        <span className="ml-4 font-medium">${account.balance.toLocaleString()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Account/Recipient */}
            {transferType === 'internal' ? (
              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select value={toAccount} onValueChange={setToAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.filter(acc => acc.id !== fromAccount).map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{account.account_number} ({account.account_type})</span>
                          <span className="ml-4 font-medium">${account.balance.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient's full name"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                {transferType === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="recipient@email.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  step="0.01"
                />
              </div>
              {selectedFromAccount && parseFloat(amount) > selectedFromAccount.balance && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Insufficient funds</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this transfer for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Transfer Speed (for external transfers) */}
            {transferType !== 'internal' && (
              <div className="space-y-3">
                <Label>Transfer Speed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card 
                    className={`cursor-pointer border-2 ${!isUrgent ? 'border-primary' : 'border-border'}`}
                    onClick={() => setIsUrgent(false)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Standard</p>
                          <p className="text-sm text-muted-foreground">1-2 business days • $0.99</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer border-2 ${isUrgent ? 'border-primary' : 'border-border'}`}
                    onClick={() => setIsUrgent(true)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Express</p>
                          <p className="text-sm text-muted-foreground">15 minutes • $2.99</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">From</span>
                    <div className="text-right">
                      <p className="font-medium">{selectedFromAccount?.account_number}</p>
                      <p className="text-sm text-muted-foreground">{selectedFromAccount?.account_type}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">To</span>
                    <div className="text-right">
                      {transferType === 'internal' ? (
                        <>
                          <p className="font-medium">{accounts?.find(acc => acc.id === toAccount)?.account_number}</p>
                          <p className="text-sm text-muted-foreground">{accounts?.find(acc => acc.id === toAccount)?.account_type}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{recipient}</p>
                          <p className="text-sm text-muted-foreground">
                            {transferType === 'contact' ? recipientEmail : 'External Bank'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span>Transfer Amount</span>
                  <span className="font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Fee</span>
                  <span className="font-medium">${getTransferFee()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Processing Time</span>
                  <span>{getTransferTime()}</span>
                </div>
              </CardContent>
            </Card>

            {description && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          {step === 'details' ? (
            <>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!fromAccount || !amount || (transferType === 'internal' && !toAccount) || (transferType !== 'internal' && !recipient)}
                className="flex-1"
              >
                Review Transfer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleTransfer} 
                disabled={transferMoney.isPending || (selectedFromAccount && totalAmount > selectedFromAccount.balance)}
                className="flex-1"
              >
                {transferMoney.isPending ? 'Processing...' : `Send $${amount}`}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};