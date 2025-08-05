import React, { useState } from 'react';
import { DollarSign, PlusCircle, Calendar, Repeat, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useBills, useCreateBill } from '@/hooks/usePayments';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

const BillPaySystem = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [payeeName, setPayeeName] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [selectedAccount, setSelectedAccount] = useState('');

  const { data: bills = [] } = useBills();
  const { data: accounts = [] } = useAccounts();
  const createBill = useCreateBill();
  const { toast } = useToast();

  const handleCreateBill = async () => {
    if (!payeeName || !payeeAccount) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please enter payee name and account information.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createBill.mutateAsync({
        payee_name: payeeName,
        payee_account: payeeAccount,
        amount: amount ? parseFloat(amount) : undefined,
        due_date: dueDate,
        category,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? frequency : undefined,
        account_id: selectedAccount || undefined,
      });

      toast({
        title: 'Bill Created!',
        description: `Bill for ${payeeName} has been added successfully.`,
      });

      // Reset form
      setPayeeName('');
      setPayeeAccount('');
      setAmount('');
      setDueDate('');
      setCategory('');
      setDescription('');
      setIsRecurring(false);
      setFrequency('monthly');
      setSelectedAccount('');
      setShowCreateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error Creating Bill',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const categories = [
    'utilities', 'rent', 'mortgage', 'insurance', 'subscriptions', 
    'loans', 'credit_cards', 'phone', 'internet', 'other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bill Pay</h2>
          <p className="text-muted-foreground">
            Manage and pay your bills automatically
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
              <DialogDescription>
                Set up a new bill for tracking and automatic payments
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payeeName">Payee Name *</Label>
                  <Input
                    id="payeeName"
                    placeholder="Electric Company"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payeeAccount">Account Number *</Label>
                <Input
                  id="payeeAccount"
                  placeholder="Account or reference number"
                  value={payeeAccount}
                  onChange={(e) => setPayeeAccount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Payment Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type.toUpperCase()} - ${account.balance.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                  <Label htmlFor="recurring">Recurring Bill</Label>
                </div>

                {isRecurring && (
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBill}
                disabled={createBill.isPending}
              >
                {createBill.isPending ? 'Creating...' : 'Add Bill'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bills</CardTitle>
          <CardDescription>
            Track and manage all your bills in one place
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No bills added yet</p>
              <p className="text-sm">Add your first bill to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{bill.payee_name}</h3>
                        {bill.is_recurring && (
                          <Repeat className="h-4 w-4 text-muted-foreground" />
                        )}
                        {bill.due_date && isOverdue(bill.due_date) && bill.status === 'pending' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bill.status)}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {bill.status}
                      </Badge>
                      {bill.category && (
                        <Badge variant="secondary" className="capitalize">
                          {bill.category.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">
                        {bill.amount ? `$${bill.amount.toFixed(2)}` : 'Variable'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <p className="font-medium">
                        {bill.due_date 
                          ? new Date(bill.due_date).toLocaleDateString()
                          : 'Not set'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account:</span>
                      <p className="font-medium">{bill.payee_account}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <p className="font-medium capitalize">
                        {bill.is_recurring ? bill.recurring_frequency : 'One-time'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Pay Now
                    </Button>
                    {bill.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillPaySystem;