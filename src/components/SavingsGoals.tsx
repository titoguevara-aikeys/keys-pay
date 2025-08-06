import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, DollarSign, Calendar, TrendingUp, Gift, Gamepad2, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavingsGoal {
  id: string;
  child_name: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  interest_rate: number;
  category: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export const SavingsGoals = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState({
    child_name: '',
    title: '',
    description: '',
    target_amount: 0,
    target_date: '',
    interest_rate: 5,
    category: 'toy'
  });

  // Sample goals for demo
  const savingsGoals: SavingsGoal[] = [
    {
      id: '1',
      child_name: 'Sarah',
      title: 'New Bicycle',
      description: 'Mountain bike for weekend rides',
      target_amount: 300,
      current_amount: 125,
      target_date: '2025-03-15',
      interest_rate: 5,
      category: 'sports',
      status: 'active',
      created_at: '2024-11-01'
    },
    {
      id: '2',
      child_name: 'Alex',
      title: 'Gaming Console',
      description: 'Nintendo Switch for birthday',
      target_amount: 350,
      current_amount: 280,
      target_date: '2024-12-25',
      interest_rate: 3,
      category: 'electronics',
      status: 'active',
      created_at: '2024-10-15'
    },
    {
      id: '3',
      child_name: 'Jamie',
      title: 'College Fund',
      description: 'Starting early for future education',
      target_amount: 2000,
      current_amount: 450,
      interest_rate: 8,
      category: 'education',
      status: 'active',
      created_at: '2024-09-01'
    }
  ];

  const goalCategories = [
    { value: 'toy', label: 'Toys & Games', icon: Gamepad2 },
    { value: 'electronics', label: 'Electronics', icon: Target },
    { value: 'sports', label: 'Sports & Outdoors', icon: Target },
    { value: 'education', label: 'Education', icon: Target },
    { value: 'travel', label: 'Travel', icon: Car },
    { value: 'charity', label: 'Charity', icon: Gift },
    { value: 'other', label: 'Other', icon: Target }
  ];

  const getCategoryIcon = (category: string) => {
    const cat = goalCategories.find(c => c.value === category);
    const IconComponent = cat?.icon || Target;
    return <IconComponent className="h-4 w-4" />;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const calculateMonthlyNeeded = (goal: SavingsGoal) => {
    if (!goal.target_date) return 0;
    const now = new Date();
    const target = new Date(goal.target_date);
    const monthsLeft = Math.max(1, (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const remaining = goal.target_amount - goal.current_amount;
    return remaining / monthsLeft;
  };

  const calculateInterestEarnings = (goal: SavingsGoal) => {
    const monthsElapsed = Math.floor((new Date().getTime() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30));
    return (goal.current_amount * (goal.interest_rate / 100) * monthsElapsed) / 12;
  };

  const handleCreateGoal = () => {
    toast({
      title: 'Savings Goal Created',
      description: `${newGoal.child_name} is now saving for "${newGoal.title}"`,
    });
    setShowCreateDialog(false);
    setNewGoal({
      child_name: '',
      title: '',
      description: '',
      target_amount: 0,
      target_date: '',
      interest_rate: 5,
      category: 'toy'
    });
  };

  const handleAddMoney = (goalId: string, amount: number) => {
    toast({
      title: 'Money Added',
      description: `$${amount} added to savings goal`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Savings Goals</h2>
          <p className="text-muted-foreground">Track progress and earn interest on savings</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="child_name">Child Name</Label>
                <Input
                  id="child_name"
                  value={newGoal.child_name}
                  onChange={(e) => setNewGoal({ ...newGoal, child_name: e.target.value })}
                  placeholder="Enter child's name"
                />
              </div>
              
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="New bicycle, gaming console..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Additional details about the goal..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_amount">Target Amount</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: Number(e.target.value) })}
                    placeholder="100.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="interest_rate"
                    type="number"
                    value={newGoal.interest_rate}
                    onChange={(e) => setNewGoal({ ...newGoal, interest_rate: Number(e.target.value) })}
                    placeholder="5"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="target_date">Target Date (Optional)</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateGoal} className="w-full">
                Create Savings Goal
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
              <Target className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-xl font-bold">$855</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Interest Earned</p>
                <p className="text-xl font-bold">$12.45</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
                <p className="text-xl font-bold">62%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const progressPercentage = (goal.current_amount / goal.target_amount) * 100;
          const monthlyNeeded = calculateMonthlyNeeded(goal);
          const interestEarned = calculateInterestEarnings(goal);

          return (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      {getCategoryIcon(goal.category)}
                      <span>{goal.title}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.child_name}</p>
                  </div>
                  <Badge variant="outline">
                    {progressPercentage.toFixed(0)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(progressPercentage, 100)} 
                    className="h-2"
                  />
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Interest Rate</p>
                    <p className="font-medium flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {goal.interest_rate}% APY
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interest Earned</p>
                    <p className="font-medium text-green-600">+${interestEarned.toFixed(2)}</p>
                  </div>
                </div>

                {goal.target_date && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Target Date</p>
                    <p className="font-medium">{new Date(goal.target_date).toLocaleDateString()}</p>
                    {monthlyNeeded > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Need ${monthlyNeeded.toFixed(2)}/month to reach goal
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddMoney(goal.id, 10)}
                    className="flex-1"
                  >
                    Add $10
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddMoney(goal.id, 25)}
                    className="flex-1"
                  >
                    Add $25
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    className="flex-1"
                  >
                    Add Custom
                  </Button>
                </div>

                {progressPercentage >= 100 && (
                  <div className="text-center">
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">
                      🎉 Goal Completed!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};