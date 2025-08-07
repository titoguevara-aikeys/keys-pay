import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoreManager } from './ChoreManager';
import { AllowanceManager } from './AllowanceManager';
import { SavingsGoals } from './SavingsGoals';
import { ChildAccountCard } from './ChildAccountCard';
import { EditFamilyMemberDialog } from './EditFamilyMemberDialog';
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
import { useFamilyMembers, useRemoveFamilyMember } from '@/hooks/useFamilyMembers';
import { AddFamilyMemberDialog } from './AddFamilyMemberDialog';
import { TransferMoneyDialog } from './TransferMoneyDialog';
import { useToast } from '@/hooks/use-toast';

import type { FamilyMember } from '@/hooks/useFamilyMembers';

export const FamilyDashboard = () => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const { data: familyMembers, isLoading } = useFamilyMembers();
  const removeFamilyMember = useRemoveFamilyMember();

  // Calculate real stats from actual data
  const dashboardStats = {
    totalChildren: familyMembers?.length || 0,
    activeChores: 0, // No chores implemented yet
    pendingApprovals: 0, // No approvals implemented yet
    totalSavings: 0, // No savings implemented yet
    weeklyAllowances: 0, // No allowances implemented yet
    completedGoals: 0, // No goals implemented yet
    interestEarned: 0, // No interest implemented yet
    avgProgressPercentage: 0 // No progress implemented yet
  };

  // No sample activity data - will be empty until features are implemented
  const recentActivity: any[] = [];

  // No sample events data - will be empty until features are implemented
  const upcomingEvents: any[] = [];

  const handleRemoveMember = async (member: FamilyMember) => {
    if (!confirm(`Are you sure you want to remove ${member.child_profile?.first_name} ${member.child_profile?.last_name} from your family controls? This action cannot be undone.`)) {
      return;
    }

    try {
      await removeFamilyMember.mutateAsync(member.id);
      toast({
        title: 'Family member removed',
        description: `${member.child_profile?.first_name} ${member.child_profile?.last_name} has been removed from your family controls.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error removing family member',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
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
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Activity will appear here as family members use the app</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.child}</p>
                          <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+${activity.amount}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming events</p>
                    <p className="text-sm">Scheduled allowances and chores will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getEventIcon(event.type)}
                          <div>
                            <p className="font-medium text-sm">{event.description}</p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">${event.amount}</Badge>
                      </div>
                    ))}
                  </div>
                )}
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
                  onRemove={handleRemoveMember}
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
      
      <EditFamilyMemberDialog 
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        member={selectedMember}
      />
      
      <TransferMoneyDialog 
        open={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        member={selectedMember}
      />
    </div>
  );
};