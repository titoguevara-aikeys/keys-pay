import React, { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Target, AlertTriangle, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBudgets, useSpendingInsights, useCreateBudget } from '@/hooks/useBudgets';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';

const AdvancedAnalytics = () => {
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const { data: budgets = [] } = useBudgets();
  const { data: spendingInsights = [] } = useSpendingInsights();
  const { data: transactions = [] } = useTransactions();
  const createBudget = useCreateBudget();
  const { toast } = useToast();

  const handleCreateBudget = async () => {
    if (!budgetName || !budgetCategory || !budgetAmount) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const startDate = new Date();
      const endDate = new Date();
      
      switch (budgetPeriod) {
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'yearly':
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
        default: // monthly
          endDate.setMonth(startDate.getMonth() + 1);
      }

      await createBudget.mutateAsync({
        name: budgetName,
        category: budgetCategory,
        amount: parseFloat(budgetAmount),
        period: budgetPeriod,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        alert_threshold: parseFloat(alertThreshold) / 100,
      });

      toast({
        title: 'Budget Created!',
        description: `Budget for ${budgetName} has been created successfully.`,
      });

      // Reset form
      setBudgetName('');
      setBudgetCategory('');
      setBudgetAmount('');
      setBudgetPeriod('monthly');
      setAlertThreshold('80');
      setShowBudgetDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error Creating Budget',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate spending for each budget
  const budgetsWithSpending = budgets.map(budget => {
    const categoryTransactions = transactions.filter(t => 
      t.category?.toLowerCase() === budget.category.toLowerCase() &&
      new Date(t.created_at) >= new Date(budget.start_date) &&
      (budget.end_date ? new Date(t.created_at) <= new Date(budget.end_date) : true) &&
      t.transaction_type === 'debit'
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const percentage = (spent / budget.amount) * 100;
    const isOverBudget = spent > budget.amount;
    const isNearLimit = percentage >= (budget.alert_threshold * 100);
    
    return {
      ...budget,
      spent,
      percentage,
      isOverBudget,
      isNearLimit,
      remaining: Math.max(0, budget.amount - spent),
    };
  });

  // Category spending insights
  const categorySpending = spendingInsights.reduce((acc, insight) => {
    acc[insight.category] = (acc[insight.category] || 0) + insight.total_amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  const categories = [
    'food', 'transportation', 'entertainment', 'shopping', 'utilities',
    'healthcare', 'education', 'travel', 'business', 'other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Track your spending patterns and manage budgets
          </p>
        </div>
        <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
              <DialogDescription>
                Set spending limits for different categories
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budgetName">Budget Name *</Label>
                <Input
                  id="budgetName"
                  placeholder="Groceries, Entertainment, etc."
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetCategory">Category *</Label>
                <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Amount *</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetPeriod">Period</Label>
                  <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="80"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBudgetDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBudget}
                disabled={createBudget.isPending}
              >
                {createBudget.isPending ? 'Creating...' : 'Create Budget'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetsWithSpending.map((budget) => (
          <Card key={budget.id} className={budget.isOverBudget ? 'border-red-200' : budget.isNearLimit ? 'border-yellow-200' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{budget.name}</CardTitle>
                {budget.isOverBudget && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {budget.isNearLimit && !budget.isOverBudget && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <CardDescription className="capitalize">
                {budget.category} • {budget.period}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: ${budget.spent.toFixed(2)}</span>
                  <span>Budget: ${budget.amount.toFixed(2)}</span>
                </div>
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className={`h-2 ${budget.isOverBudget ? 'bg-red-100' : budget.isNearLimit ? 'bg-yellow-100' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{budget.percentage.toFixed(0)}% used</span>
                  <span className={budget.isOverBudget ? 'text-red-500' : 'text-green-500'}>
                    {budget.isOverBudget ? `-$${(budget.spent - budget.amount).toFixed(2)}` : `$${budget.remaining.toFixed(2)} left`}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spending Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
            <CardDescription>
              Your spending distribution this month
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {Object.keys(categorySpending).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No spending data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categorySpending)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([category, amount]) => {
                    const percentage = (amount / totalSpending) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">${amount.toFixed(2)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">
                          {percentage.toFixed(1)}% of total
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Trends
            </CardTitle>
            <CardDescription>
              Insights and recommendations
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {budgetsWithSpending.filter(b => b.isOverBudget || b.isNearLimit).map((budget) => (
                <div key={budget.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`h-4 w-4 ${budget.isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
                    <span className="font-medium">{budget.name}</span>
                    <Badge variant={budget.isOverBudget ? 'destructive' : 'secondary'}>
                      {budget.isOverBudget ? 'Over Budget' : 'Near Limit'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {budget.isOverBudget 
                      ? `You've exceeded your budget by $${(budget.spent - budget.amount).toFixed(2)}`
                      : `You've used ${budget.percentage.toFixed(0)}% of your budget`
                    }
                  </p>
                </div>
              ))}
              
              {budgetsWithSpending.filter(b => b.isOverBudget || b.isNearLimit).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 text-green-500/50" />
                  <p>Great job! All budgets are on track.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;