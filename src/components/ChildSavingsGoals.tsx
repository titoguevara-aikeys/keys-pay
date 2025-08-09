import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  DollarSign, 
  Calendar, 
  User,
  Gift,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Star,
  Trophy,
  Coins
} from 'lucide-react';

export const ChildSavingsGoals = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('toy');
  const [rewardDescription, setRewardDescription] = useState('');

  // Mock data - replace with actual data hooks
  const children = [
    { id: '1', name: 'Emma', age: 12 },
    { id: '2', name: 'Jake', age: 10 },
    { id: '3', name: 'Sophie', age: 8 }
  ];

  const savingsGoals = [
    {
      id: '1',
      goalName: 'New Bicycle',
      childName: 'Emma',
      childId: '1',
      targetAmount: 150.00,
      currentAmount: 97.50,
      targetDate: '2025-03-15',
      category: 'toy',
      status: 'active',
      rewardDescription: 'A shiny new mountain bike for weekend adventures',
      imageUrl: '/placeholder-bike.jpg',
      weeklyProgress: 15.50,
      estimatedCompletion: '2025-03-10'
    },
    {
      id: '2',
      goalName: 'Gaming Console',
      childName: 'Jake',
      childId: '2',
      targetAmount: 300.00,
      currentAmount: 105.00,
      targetDate: '2025-06-01',
      category: 'electronics',
      status: 'active',
      rewardDescription: 'Latest gaming console with favorite games',
      imageUrl: '/placeholder-console.jpg',
      weeklyProgress: 12.00,
      estimatedCompletion: '2025-05-28'
    },
    {
      id: '3',
      goalName: 'Art Supplies Set',
      childName: 'Sophie',
      childId: '3',
      targetAmount: 50.00,
      currentAmount: 40.00,
      targetDate: '2025-02-01',
      category: 'educational',
      status: 'active',
      rewardDescription: 'Professional art supplies for creative projects',
      imageUrl: '/placeholder-art.jpg',
      weeklyProgress: 8.00,
      estimatedCompletion: '2025-01-25'
    },
    {
      id: '4',
      goalName: 'Soccer Cleats',
      childName: 'Emma',
      childId: '1',
      targetAmount: 80.00,
      currentAmount: 80.00,
      targetDate: '2025-01-01',
      category: 'sports',
      status: 'completed',
      rewardDescription: 'Professional soccer cleats for the new season',
      completedAt: '2024-12-28',
      imageUrl: '/placeholder-cleats.jpg'
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'toy':
        return <Gift className="h-4 w-4" />;
      case 'electronics':
        return <Target className="h-4 w-4" />;
      case 'educational':
        return <Star className="h-4 w-4" />;
      case 'sports':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'toy':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'electronics':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'educational':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sports':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateGoal = () => {
    console.log('Creating savings goal:', {
      selectedChild,
      goalName,
      targetAmount,
      targetDate,
      category,
      rewardDescription
    });
    setIsCreateDialogOpen(false);
  };

  const handleAddMoney = (goalId: string, amount: number) => {
    console.log('Adding money to goal:', goalId, amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Savings Goals</h2>
          <p className="text-muted-foreground">Help your children save for their dreams</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="child">Select Child</Label>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name} (Age {child.age})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., New Bicycle"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount ($)</Label>
                  <Input
                    id="target-amount"
                    type="number"
                    placeholder="100.00"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toy">Toy</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-description">Reward Description</Label>
                <Textarea
                  id="reward-description"
                  placeholder="Describe what makes this goal special..."
                  value={rewardDescription}
                  onChange={(e) => setRewardDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => (
          <Card key={goal.id} className={`border-2 ${goal.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-primary/20'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(goal.category)}
                  <CardTitle className="text-lg">{goal.goalName}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {goal.status === 'completed' && (
                    <Badge className="bg-green-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{goal.childName}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(goal.category)}`}
                >
                  {goal.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{goal.rewardDescription}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    ${goal.currentAmount} / ${goal.targetAmount}
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(goal.currentAmount, goal.targetAmount)} 
                  className="h-3"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}% complete</span>
                  {goal.status === 'active' && (
                    <span>${(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining</span>
                  )}
                </div>
              </div>

              {goal.status === 'active' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Target Date</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{goal.targetDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weekly Progress</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+${goal.weeklyProgress}</span>
                    </div>
                  </div>
                </div>
              )}

              {goal.status === 'completed' && (
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">Goal Achieved!</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Completed on {new Date(goal.completedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}

              {goal.status === 'active' && (
                <>
                  <Separator />
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddMoney(goal.id, 5)}
                    >
                      <Coins className="h-4 w-4 mr-1" />
                      Add $5
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddMoney(goal.id, 10)}
                    >
                      <Coins className="h-4 w-4 mr-1" />
                      Add $10
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {savingsGoals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Savings Goals</h3>
            <p className="text-muted-foreground mb-4">
              Create your first savings goal to teach your children about planning and saving
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};