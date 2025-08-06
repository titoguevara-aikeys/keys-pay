import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreManager } from './ChoreManager';
import { AllowanceManager } from './AllowanceManager';
import { SavingsGoals } from './SavingsGoals';
import { ChildAccountCard } from './ChildAccountCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Target, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { AddFamilyMemberDialog } from './AddFamilyMemberDialog';
import { TransferMoneyDialog } from './TransferMoneyDialog';
import type { FamilyMember } from '@/hooks/useFamilyMembers';

export const FamilyDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const { data: familyMembers, isLoading } = useFamilyMembers();

  // Sample data for demo
  const dashboardStats = {
    totalChildren: 3,
    activeChores: 12,
    pendingApprovals: 4,
    totalSavings: 855,
    weeklyAllowances: 75,
    completedGoals: 2,
    interestEarned: 12.45,
    avgProgressPercentage: 68
  };

  const recentActivity = [
    { id: 1, type: 'chore_completed', child: 'Sarah', description: 'Completed "Take out trash"', amount: 5, time: '2 hours ago' },
    { id: 2, type: 'allowance_paid', child: 'Alex', description: 'Weekly allowance deposited', amount: 15, time: '1 day ago' },
    { id: 3, type: 'goal_progress', child: 'Jamie', description: 'Added to "New Bicycle" savings', amount: 20, time: '2 days ago' },
    { id: 4, type: 'interest_earned', child: 'Sarah', description: 'Interest earned on savings', amount: 2.15, time: '3 days ago' }
  ];

  const upcomingEvents = [
    { id: 1, type: 'allowance', description: 'Sarah\'s weekly allowance', date: '2024-12-08', amount: 20 },
    { id: 2, type: 'chore_due', description: 'Alex: "Clean room" due', date: '2024-12-09', amount: 8 },
    { id: 3, type: 'goal_target', description: 'Jamie\'s "Gaming Console" target date', date: '2024-12-25', amount: 350 }
  ];

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    // Edit functionality would be implemented here
  };

  const handleTransferMoney = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowTransferDialog(true);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chore_completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'allowance_paid': return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'goal_progress': return <Target className="h-4 w-4 text-purple-500" />;
      case 'interest_earned': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'allowance': return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'chore_due': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'goal_target': return <Target className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Family Dashboard</h1>
          <p className="text-muted-foreground">Complete family finance management in one place</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Family Members</p>
                <p className="text-2xl font-bold">{dashboardStats.totalChildren}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Chores</p>
                <p className="text-2xl font-bold">{dashboardStats.activeChores}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">${dashboardStats.totalSavings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Interest Earned</p>
                <p className="text-2xl font-bold">${dashboardStats.interestEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chores">Chores</TabsTrigger>
          <TabsTrigger value="allowances">Allowances</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.child}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">+${activity.amount}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      ${event.amount}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">{dashboardStats.pendingApprovals}</span>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Chores awaiting review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekly Allowances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${dashboardStats.weeklyAllowances}</span>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total per week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avg. Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">{dashboardStats.avgProgressPercentage}%</span>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all savings goals</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chores">
          <ChoreManager />
        </TabsContent>

        <TabsContent value="allowances">
          <AllowanceManager />
        </TabsContent>

        <TabsContent value="savings">
          <SavingsGoals />
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          {familyMembers && familyMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <ChildAccountCard 
                  key={member.id} 
                  member={member}
                  onEdit={handleEditMember}
                  onTransfer={handleTransferMoney}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent className="space-y-4">
                <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No family members yet</h3>
                  <p className="text-muted-foreground">
                    Add family members to start using the full FamZoo-inspired features
                  </p>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Family Member
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddFamilyMemberDialog 
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
      
      <TransferMoneyDialog 
        open={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        member={selectedMember}
      />
    </div>
  );
};