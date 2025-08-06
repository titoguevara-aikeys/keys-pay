import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Calendar, DollarSign, PiggyBank, Heart, ShoppingCart, Clock, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AllowanceRule {
  id: string;
  child_name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  splits: {
    spend: number;
    save: number;
    give: number;
  };
  auto_pay: boolean;
  next_payment: string;
  status: 'active' | 'paused';
}

export const AllowanceManager = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const [newAllowance, setNewAllowance] = useState({
    child_name: '',
    amount: 20,
    frequency: 'weekly' as const,
    auto_pay: true,
    spend_percent: 60,
    save_percent: 30,
    give_percent: 10
  });

  // Sample allowance rules for demo
  const allowanceRules: AllowanceRule[] = [
    {
      id: '1',
      child_name: 'Sarah',
      amount: 20,
      frequency: 'weekly',
      splits: { spend: 12, save: 6, give: 2 },
      auto_pay: true,
      next_payment: '2024-12-08',
      status: 'active'
    },
    {
      id: '2',
      child_name: 'Alex',
      amount: 15,
      frequency: 'weekly',
      splits: { spend: 9, save: 4.5, give: 1.5 },
      auto_pay: false,
      next_payment: '2024-12-08',
      status: 'active'
    },
    {
      id: '3',
      child_name: 'Jamie',
      amount: 40,
      frequency: 'monthly',
      splits: { spend: 24, save: 12, give: 4 },
      auto_pay: true,
      next_payment: '2024-12-15',
      status: 'paused'
    }
  ];

  const handleCreateAllowance = () => {
    const spendAmount = (newAllowance.amount * newAllowance.spend_percent) / 100;
    const saveAmount = (newAllowance.amount * newAllowance.save_percent) / 100;
    const giveAmount = (newAllowance.amount * newAllowance.give_percent) / 100;

    toast({
      title: 'Allowance Rule Created',
      description: `${newAllowance.child_name} will receive $${newAllowance.amount} ${newAllowance.frequency}`,
    });
    setShowCreateDialog(false);
  };

  const handleToggleAutoPay = (ruleId: string) => {
    toast({
      title: 'Auto-pay Updated',
      description: 'Automatic payment settings have been updated.',
    });
  };

  const handlePayNow = (rule: AllowanceRule) => {
    toast({
      title: 'Payment Sent',
      description: `$${rule.amount} sent to ${rule.child_name}'s account`,
    });
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'biweekly': return <Repeat className="h-4 w-4" />;
      case 'monthly': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Allowance Manager</h2>
          <p className="text-muted-foreground">Automate allowances and teach money splits</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Set Up Allowance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Allowance Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="child_name">Child Name</Label>
                <Input
                  id="child_name"
                  value={newAllowance.child_name}
                  onChange={(e) => setNewAllowance({ ...newAllowance, child_name: e.target.value })}
                  placeholder="Enter child's name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newAllowance.amount}
                    onChange={(e) => setNewAllowance({ ...newAllowance, amount: Number(e.target.value) })}
                    placeholder="20.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newAllowance.frequency} 
                    onValueChange={(value: any) => setNewAllowance({ ...newAllowance, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Money Split Allocation</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Spend</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={newAllowance.spend_percent}
                        onChange={(e) => setNewAllowance({ ...newAllowance, spend_percent: Number(e.target.value) })}
                        className="w-16 h-8"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm">%</span>
                      <span className="text-sm text-muted-foreground w-12">
                        ${((newAllowance.amount * newAllowance.spend_percent) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PiggyBank className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Save</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={newAllowance.save_percent}
                        onChange={(e) => setNewAllowance({ ...newAllowance, save_percent: Number(e.target.value) })}
                        className="w-16 h-8"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm">%</span>
                      <span className="text-sm text-muted-foreground w-12">
                        ${((newAllowance.amount * newAllowance.save_percent) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Give</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={newAllowance.give_percent}
                        onChange={(e) => setNewAllowance({ ...newAllowance, give_percent: Number(e.target.value) })}
                        className="w-16 h-8"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm">%</span>
                      <span className="text-sm text-muted-foreground w-12">
                        ${((newAllowance.amount * newAllowance.give_percent) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Total: {newAllowance.spend_percent + newAllowance.save_percent + newAllowance.give_percent}%
                  {(newAllowance.spend_percent + newAllowance.save_percent + newAllowance.give_percent) !== 100 && 
                    <span className="text-red-500 ml-1">(Must equal 100%)</span>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto_pay">Enable Auto-pay</Label>
                <Switch
                  id="auto_pay"
                  checked={newAllowance.auto_pay}
                  onCheckedChange={(checked) => setNewAllowance({ ...newAllowance, auto_pay: checked })}
                />
              </div>

              <Button 
                onClick={handleCreateAllowance} 
                className="w-full"
                disabled={(newAllowance.spend_percent + newAllowance.save_percent + newAllowance.give_percent) !== 100}
              >
                Create Allowance Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Weekly</p>
                <p className="text-xl font-bold">$55</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <p className="text-xl font-bold">Dec 8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Auto Rules</p>
                <p className="text-xl font-bold">2/3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-xl font-bold">$156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allowance Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allowanceRules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{rule.child_name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getFrequencyIcon(rule.frequency)}
                    <span className="text-sm text-muted-foreground capitalize">
                      ${rule.amount} {rule.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                    {rule.status}
                  </Badge>
                  {rule.auto_pay && (
                    <Badge variant="outline" className="text-xs">
                      Auto-pay
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Money Split Visualization */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Money Split</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <ShoppingCart className="h-3 w-3 text-green-500" />
                      <span>Spend</span>
                    </div>
                    <span className="font-medium">${rule.splits.spend}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <PiggyBank className="h-3 w-3 text-blue-500" />
                      <span>Save</span>
                    </div>
                    <span className="font-medium">${rule.splits.save}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span>Give</span>
                    </div>
                    <span className="font-medium">${rule.splits.give}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next payment:</span>
                <span className="font-medium">{new Date(rule.next_payment).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePayNow(rule)}
                  className="flex-1"
                >
                  Pay Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleToggleAutoPay(rule.id)}
                  className="flex-1"
                >
                  {rule.auto_pay ? 'Disable Auto' : 'Enable Auto'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};