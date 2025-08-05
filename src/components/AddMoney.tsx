import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowDownLeft } from 'lucide-react';
import { useAccounts, useUpdateAccountBalance } from '@/hooks/useAccounts';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';

interface AddMoneyProps {
  trigger?: React.ReactNode;
}

const AddMoney: React.FC<AddMoneyProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { data: accounts } = useAccounts();
  const updateBalance = useUpdateAccountBalance();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  
  const fundingSources = [
    { id: 'bank', name: 'Bank Account (****1234)' },
    { id: 'debit', name: 'Debit Card (****5678)' },
    { id: 'credit', name: 'Credit Card (****9012)' },
  ];
  
  const handleAddMoney = async () => {
    if (!amount || !toAccount || !source) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Update account balance
      await updateBalance.mutateAsync({
        accountId: toAccount,
        amount: numericAmount,
        type: 'add',
      });
      
      // Create transaction record
      const sourceName = fundingSources.find(s => s.id === source)?.name || source;
      await createTransaction.mutateAsync({
        account_id: toAccount,
        transaction_type: 'deposit',
        amount: numericAmount,
        description: `Deposit from ${sourceName}`,
        recipient: sourceName,
        category: 'Income',
      });
      
      toast({
        title: "Money Added Successfully",
        description: `$${numericAmount.toFixed(2)} added to your account`,
      });
      
      // Reset form
      setAmount('');
      setToAccount('');
      setSource('');
      setOpen(false);
      
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to add money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Plus className="h-5 w-5" />
            Add Money
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-primary" />
            Add Money
          </DialogTitle>
          <DialogDescription>
            Add money to your wallet from a funding source.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="to-account">To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
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
            <Label htmlFor="source">Funding Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select funding source" />
              </SelectTrigger>
              <SelectContent>
                {fundingSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
                min="0"
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Funds will be available immediately. Standard transfer fees may apply.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleAddMoney} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Adding..." : "Add Money"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoney;