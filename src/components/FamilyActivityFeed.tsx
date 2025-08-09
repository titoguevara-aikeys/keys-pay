import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter,
  DollarSign,
  CheckSquare,
  Target,
  Trophy,
  BookOpen,
  CreditCard,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

export const FamilyActivityFeed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterChild, setFilterChild] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - replace with actual data hooks
  const activities = [
    {
      id: '1',
      type: 'chore_completed',
      childName: 'Emma',
      childId: '1',
      title: 'Chore Completed',
      description: 'Cleaned bedroom and organized desk',
      amount: 5.00,
      timestamp: '2025-01-09T14:30:00Z',
      status: 'completed',
      metadata: { choreId: 'chore-123', category: 'bedroom' }
    },
    {
      id: '2',
      type: 'allowance_paid',
      childName: 'Jake',
      childId: '2',
      title: 'Weekly Allowance',
      description: 'Automatic weekly allowance payment',
      amount: 10.00,
      timestamp: '2025-01-09T09:00:00Z',
      status: 'completed',
      metadata: { allowanceId: 'allow-456', frequency: 'weekly' }
    },
    {
      id: '3',
      type: 'savings_goal_progress',
      childName: 'Sophie',
      childId: '3',
      title: 'Savings Goal Update',
      description: 'Added $5 to Art Supplies fund from chore reward',
      amount: 5.00,
      timestamp: '2025-01-08T16:45:00Z',
      status: 'completed',
      metadata: { goalId: 'goal-789', goalName: 'Art Supplies', progress: 80 }
    },
    {
      id: '4',
      type: 'spending_limit_reached',
      childName: 'Emma',
      childId: '1',
      title: 'Spending Limit Alert',
      description: 'Daily entertainment spending limit reached ($15)',
      amount: 15.00,
      timestamp: '2025-01-08T13:20:00Z',
      status: 'warning',
      metadata: { category: 'entertainment', limitType: 'daily' }
    },
    {
      id: '5',
      type: 'education_completed',
      childName: 'Jake',
      childId: '2',
      title: 'Learning Module Completed',
      description: 'Finished "Banking Basics" with 92% score',
      amount: 0,
      timestamp: '2025-01-08T11:15:00Z',
      status: 'completed',
      metadata: { moduleId: 'module-101', score: 92, points: 50 }
    },
    {
      id: '6',
      type: 'card_transaction',
      childName: 'Emma',
      childId: '1',
      title: 'Card Purchase',
      description: 'Lunch at school cafeteria',
      amount: -7.50,
      timestamp: '2025-01-08T12:30:00Z',
      status: 'completed',
      metadata: { merchant: 'School Cafeteria', category: 'food' }
    },
    {
      id: '7',
      type: 'goal_achieved',
      childName: 'Sophie',
      childId: '3',
      title: 'Savings Goal Achieved! 🎉',
      description: 'Reached $50 target for Art Supplies fund',
      amount: 50.00,
      timestamp: '2025-01-07T19:20:00Z',
      status: 'celebration',
      metadata: { goalId: 'goal-789', goalName: 'Art Supplies', targetAmount: 50 }
    },
    {
      id: '8',
      type: 'chore_assigned',
      childName: 'Jake',
      childId: '2',
      title: 'New Chore Assigned',
      description: 'Take out trash bins for pickup day',
      amount: 3.00,
      timestamp: '2025-01-07T18:00:00Z',
      status: 'pending',
      metadata: { choreId: 'chore-124', dueDate: '2025-01-10', priority: 'high' }
    }
  ];

  const getActivityIcon = (type: string, status: string) => {
    switch (type) {
      case 'chore_completed':
        return <CheckSquare className="h-5 w-5 text-blue-500" />;
      case 'allowance_paid':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'savings_goal_progress':
        return <Target className="h-5 w-5 text-purple-500" />;
      case 'goal_achieved':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'education_completed':
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case 'card_transaction':
        return <CreditCard className="h-5 w-5 text-gray-500" />;
      case 'spending_limit_reached':
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'chore_assigned':
        return <CheckSquare className="h-5 w-5 text-gray-400" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'celebration':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.childName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesChild = filterChild === 'all' || activity.childId === filterChild;
    
    return matchesSearch && matchesType && matchesChild;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'amount_high':
        return Math.abs(b.amount) - Math.abs(a.amount);
      case 'amount_low':
        return Math.abs(a.amount) - Math.abs(b.amount);
      case 'child_name':
        return a.childName.localeCompare(b.childName);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Family Activity Feed</h2>
          <p className="text-muted-foreground">Real-time updates on family financial activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{activities.length} total activities</Badge>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chore_completed">Chores</SelectItem>
                <SelectItem value="allowance_paid">Allowances</SelectItem>
                <SelectItem value="savings_goal_progress">Savings</SelectItem>
                <SelectItem value="education_completed">Education</SelectItem>
                <SelectItem value="card_transaction">Transactions</SelectItem>
                <SelectItem value="spending_limit_reached">Alerts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterChild} onValueChange={setFilterChild}>
              <SelectTrigger>
                <SelectValue placeholder="Child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                <SelectItem value="1">Emma</SelectItem>
                <SelectItem value="2">Jake</SelectItem>
                <SelectItem value="3">Sophie</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount_high">Highest Amount</SelectItem>
                <SelectItem value="amount_low">Lowest Amount</SelectItem>
                <SelectItem value="child_name">Child Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="space-y-4">
        {sortedActivities.map((activity) => (
          <Card key={activity.id} className="border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-muted/50 rounded-full">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {activity.childName}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>•</span>
                          <span>
                            {activity.metadata.category && `Category: ${activity.metadata.category}`}
                            {activity.metadata.goalName && `Goal: ${activity.metadata.goalName}`}
                            {activity.metadata.score && `Score: ${activity.metadata.score}%`}
                            {activity.metadata.merchant && `at ${activity.metadata.merchant}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {activity.amount !== 0 && (
                  <div className="text-right ml-4">
                    <p className={`font-semibold ${
                      activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                    </p>
                    {activity.type === 'savings_goal_progress' && activity.metadata.progress && (
                      <p className="text-xs text-muted-foreground">
                        {activity.metadata.progress}% complete
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedActivities.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all' || filterChild !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Family activities will appear here as they happen'
              }
            </p>
            {(searchTerm || filterType !== 'all' || filterChild !== 'all') && (
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterChild('all');
              }}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {sortedActivities.length > 10 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
};