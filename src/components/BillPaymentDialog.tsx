/*
 * AIKEYS FINANCIAL PLATFORM - BILL PAYMENT DIALOG
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Receipt, Zap, Wifi, Car, Home, Phone, CreditCard, 
  Calendar, Check, AlertCircle, Repeat
} from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';

interface BillPaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

interface BillProvider {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  accountFormat: string;
}

const billProviders: BillProvider[] = [
  { 
    id: 'electricity', 
    name: 'Electric Company', 
    category: 'Utilities', 
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-600',
    accountFormat: 'Account Number'
  },
  { 
    id: 'internet', 
    name: 'Internet Provider', 
    category: 'Utilities', 
    icon: <Wifi className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-600',
    accountFormat: 'Customer ID'
  },
  { 
    id: 'car_insurance', 
    name: 'Car Insurance', 
    category: 'Insurance', 
    icon: <Car className="h-5 w-5" />,
    color: 'bg-green-100 text-green-600',
    accountFormat: 'Policy Number'
  },
  { 
    id: 'mortgage', 
    name: 'Mortgage Payment', 
    category: 'Housing', 
    icon: <Home className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-600',
    accountFormat: 'Loan Number'
  },
  { 
    id: 'phone', 
    name: 'Phone Bill', 
    category: 'Utilities', 
    icon: <Phone className="h-5 w-5" />,
    color: 'bg-orange-100 text-orange-600',
    accountFormat: 'Phone Number'
  },
  { 
    id: 'credit_card', 
    name: 'Credit Card', 
    category: 'Credit', 
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-red-100 text-red-600',
    accountFormat: 'Card Number'
  },
];

export const BillPaymentDialog: React.FC<BillPaymentDialogProps> = ({ open, onClose }) => {
  const { data: accounts } = useAccounts();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'provider' | 'details' | 'review' | 'success'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<BillProvider | null>(null);
  const [fromAccount, setFromAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState('now');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');

  const resetForm = () => {
    setStep('provider');
    setSelectedProvider(null);
    setFromAccount('');
    setAccountNumber('');
    setAmount('');
    setDescription('');
    setPaymentDate('now');
    setIsRecurring(false);
    setRecurringFrequency('monthly');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleProviderSelect = (provider: BillProvider) => {
    setSelectedProvider(provider);
    setDescription(`${provider.name} Bill Payment`);
    setStep('details');
  };

  const handleNext = () => {
    if (step === 'details') {
      setStep('review');
    }
  };

  const handlePayment = async () => {
    if (!fromAccount || !amount || !selectedProvider) return;

    try {
      await createTransaction.mutateAsync({
        account_id: fromAccount,
        transaction_type: 'debit',
        amount: -parseFloat(amount),
        description,
        category: selectedProvider.category,
        recipient: selectedProvider.name
      });
      
      setStep('success');
      toast({
        title: 'Bill payment successful!',
        description: `Paid $${amount} to ${selectedProvider.name}`,
      });
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const selectedFromAccount = accounts?.find(acc => acc.id === fromAccount);
  const paymentAmount = parseFloat(amount || '0');

  if (step === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your payment of ${amount} to {selectedProvider?.name} has been processed
              </p>
            </div>
            {isRecurring && (
              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
                  <Repeat className="h-4 w-4" />
                  Recurring Payment Set Up
                </div>
                <p className="text-blue-700">
                  This payment will automatically repeat {recurringFrequency}
                </p>
              </div>
            )}
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
            {step === 'provider' && 'Pay Bills'}
            {step === 'details' && `Pay ${selectedProvider?.name}`}
            {step === 'review' && 'Review Payment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'provider' && 'Select a bill type to pay'}
            {step === 'details' && 'Enter your payment details'}
            {step === 'review' && 'Please review your payment details'}
          </DialogDescription>
        </DialogHeader>

        {step === 'provider' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {billProviders.map((provider) => (
                <Card 
                  key={provider.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProviderSelect(provider)}
                >
                  <CardContent className="p-4 text-center space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${provider.color}`}>
                      {provider.icon}
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {provider.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't see your provider? Contact support to add them.
              </p>
            </div>
          </div>
        )}

        {step === 'details' && selectedProvider && (
          <div className="space-y-6">
            {/* Provider Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedProvider.color}`}>
                    {selectedProvider.icon}
                  </div>
                  <div>
                    <p className="font-medium">{selectedProvider.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProvider.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Account */}
            <div className="space-y-2">
              <Label htmlFor="fromAccount">Pay From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account to pay from" />
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

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">{selectedProvider.accountFormat}</Label>
              <Input
                id="accountNumber"
                placeholder={`Enter your ${selectedProvider.accountFormat.toLowerCase()}`}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
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
              {selectedFromAccount && paymentAmount > selectedFromAccount.balance && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Insufficient funds</span>
                </div>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Select value={paymentDate} onValueChange={setPaymentDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Pay Now</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">Next Week</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Payment */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked === true)}
                />
                <Label htmlFor="recurring" className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  Set up recurring payment
                </Label>
              </div>

              {isRecurring && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note for this payment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {step === 'review' && selectedProvider && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedProvider.color}`}>
                      {selectedProvider.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedProvider.name}</p>
                      <p className="text-sm text-muted-foreground">{accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentDate === 'now' ? 'Pay Now' : `Pay ${paymentDate}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span>Payment Amount</span>
                  <span className="font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>From Account</span>
                  <span className="font-medium">{selectedFromAccount?.account_number}</span>
                </div>
                {isRecurring && (
                  <div className="flex justify-between">
                    <span>Recurring</span>
                    <Badge variant="secondary">{recurringFrequency}</Badge>
                  </div>
                )}
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
          {step === 'provider' ? (
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          ) : step === 'details' ? (
            <>
              <Button variant="outline" onClick={() => setStep('provider')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!fromAccount || !amount || !accountNumber}
                className="flex-1"
              >
                Review Payment
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={createTransaction.isPending || (selectedFromAccount && paymentAmount > selectedFromAccount.balance)}
                className="flex-1"
              >
                {createTransaction.isPending ? 'Processing...' : `Pay $${amount}`}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};