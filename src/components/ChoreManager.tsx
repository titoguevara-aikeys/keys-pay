import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, DollarSign, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useChores } from '@/hooks/useChores';
import { useToast } from '@/hooks/use-toast';

interface Chore {
  id: string;
  title: string;
  description?: string;
  reward_amount: number;
  assigned_to: string;
  due_date?: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  created_at: string;
}

export const ChoreManager = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: chores, isLoading } = useChores();
  const { toast } = useToast();
  const [newChore, setNewChore] = useState({
    title: '',
    description: '',
    reward_amount: 0,
    assigned_to: '',
    due_date: '',
    frequency: 'once' as const,
    category: 'household',
    difficulty: 3 as const
  });

  const choreCategories = [
    { value: 'household', label: 'Household' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'pets', label: 'Pet Care' },
    { value: 'academic', label: 'Academic' },
    { value: 'personal', label: 'Personal Care' },
    { value: 'helping', label: 'Helping Others' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'approved': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleCreateChore = () => {
    toast({
      title: 'Chore Created',
      description: `"${newChore.title}" has been added to the chore list.`,
    });
    setShowCreateDialog(false);
    setNewChore({
      title: '',
      description: '',
      reward_amount: 0,
      assigned_to: '',
      due_date: '',
      frequency: 'once',
      category: 'household',
      difficulty: 3
    });
  };

  const handleChoreAction = (choreId: string, action: 'complete' | 'approve' | 'reject') => {
    const actionText = action === 'complete' ? 'marked as completed' : 
                     action === 'approve' ? 'approved' : 'rejected';
    toast({
      title: 'Chore Updated',
      description: `Chore has been ${actionText}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chore Manager</h2>
          <p className="text-muted-foreground">Track chores, rewards, and build responsibility</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Chore
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Chore</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Chore Title</Label>
                <Input
                  id="title"
                  value={newChore.title}
                  onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
                  placeholder="Take out trash, wash dishes..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newChore.description}
                  onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
                  placeholder="Additional details or instructions..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reward">Reward Amount</Label>
                  <Input
                    id="reward"
                    type="number"
                    value={newChore.reward_amount}
                    onChange={(e) => setNewChore({ ...newChore, reward_amount: Number(e.target.value) })}
                    placeholder="5.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newChore.category} 
                    onValueChange={(value) => setNewChore({ ...newChore, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {choreCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newChore.frequency} 
                    onValueChange={(value: any) => setNewChore({ ...newChore, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One Time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={newChore.difficulty.toString()} 
                    onValueChange={(value) => setNewChore({ ...newChore, difficulty: Number(value) as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star - Easy</SelectItem>
                      <SelectItem value="2">2 Stars - Simple</SelectItem>
                      <SelectItem value="3">3 Stars - Moderate</SelectItem>
                      <SelectItem value="4">4 Stars - Hard</SelectItem>
                      <SelectItem value="5">5 Stars - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newChore.due_date}
                  onChange={(e) => setNewChore({ ...newChore, due_date: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateChore} className="w-full">
                Create Chore
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chore Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-xl font-bold">$45.50</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chore List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sample chores for demo */}
        {[
          {
            id: '1',
            title: 'Take out trash',
            description: 'Empty all trash cans and take to curb',
            reward_amount: 5,
            status: 'pending' as const,
            frequency: 'weekly' as const,
            category: 'household',
            difficulty: 2,
            due_date: '2024-12-08',
            assigned_to: 'Sarah'
          },
          {
            id: '2',
            title: 'Wash dishes',
            description: 'Load dishwasher and hand wash pots',
            reward_amount: 3,
            status: 'completed' as const,
            frequency: 'daily' as const,
            category: 'household',
            difficulty: 1,
            assigned_to: 'Alex'
          },
          {
            id: '3',
            title: 'Walk the dog',
            description: '30 minute walk around the neighborhood',
            reward_amount: 8,
            status: 'approved' as const,
            frequency: 'daily' as const,
            category: 'pets',
            difficulty: 3,
            assigned_to: 'Jamie'
          }
        ].map((chore) => (
          <Card key={chore.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{chore.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">Assigned to {chore.assigned_to}</p>
                </div>
                <Badge className={getStatusColor(chore.status)}>
                  {chore.status.charAt(0).toUpperCase() + chore.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {chore.description && (
                <p className="text-sm text-muted-foreground">{chore.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium">${chore.reward_amount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getDifficultyStars(chore.difficulty)}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize">{chore.frequency}</span>
                <span className="capitalize">{chore.category}</span>
              </div>
              
              {chore.due_date && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Due {new Date(chore.due_date).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                {chore.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleChoreAction(chore.id, 'complete')}
                    className="flex-1"
                  >
                    Mark Complete
                  </Button>
                )}
                {chore.status === 'completed' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleChoreAction(chore.id, 'approve')}
                      className="flex-1"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleChoreAction(chore.id, 'reject')}
                      className="flex-1"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};