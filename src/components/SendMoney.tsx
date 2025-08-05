import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, ArrowRight } from 'lucide-react';
import { useAccounts, useUpdateAccountBalance } from '@/hooks/useAccounts';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';

interface SendMoneyProps {
  trigger?: React.ReactNode;
}

const SendMoney: React.FC<SendMoneyProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { data: accounts } = useAccounts();
  const updateBalance = useUpdateAccountBalance();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  
  const handleSendMoney = async () => {
    if (!amount || !recipient || !fromAccount || !description) {
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
        accountId: fromAccount,
        amount: numericAmount,
        type: 'subtract',
      });
      
      // Create transaction record
      await createTransaction.mutateAsync({
        account_id: fromAccount,
        transaction_type: 'transfer_out',
        amount: -numericAmount,
        description: `Transfer to ${recipient}: ${description}`,
        recipient: recipient,
        category: 'Transfer',
      });
      
      toast({
        title: "Money Sent Successfully",
        description: `$${numericAmount.toFixed(2)} sent to ${recipient}`,
      });
      
      // Reset form
      setAmount('');
      setRecipient('');
      setFromAccount('');
      setDescription('');
      setOpen(false);
      
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to send money. Please try again.",
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
          <Button className="h-16 flex-col gap-2">
            <Send className="h-5 w-5" />
            Send Money
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Send Money
          </DialogTitle>
          <DialogDescription>
            Transfer money to another person or account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="from-account">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
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
            <Label htmlFor="recipient">Recipient Email or Phone</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="john@example.com or +1234567890"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What's this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSendMoney} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMoney;