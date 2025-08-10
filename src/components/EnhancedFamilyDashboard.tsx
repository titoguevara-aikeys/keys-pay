import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Target, 
  CheckSquare, 
  TrendingUp, 
  Clock,
  Star,
  Gift,
  BookOpen,
  Shield,
  AlertTriangle,
  Calendar,
  Award
} from 'lucide-react';
import { AllowanceManager } from './AllowanceManager';
import { ChoreManager } from './ChoreManager';
import { ChildSavingsGoals } from './ChildSavingsGoals';
import { FamilyActivityFeed } from './FamilyActivityFeed';
import { SpendingControls } from './SpendingControls';
import { FinancialEducationHub } from './FinancialEducationHub';

const EnhancedFamilyDashboardComponent = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Memoized data to prevent unnecessary recalculations
  const familyStats = useMemo(() => ({
    totalChildren: 3,
    totalAllowancesPaid: 425.50,
    completedChores: 12,
    activeGoals: 5,
    educationProgress: 75
  }), []);

  const children = useMemo(() => [
    {
      id: '1',
      name: 'Emma',
      age: 12,
      balance: 45.50,
      completedChores: 3,
      allowanceNext: '2025-01-15',
      savingsGoal: { name: 'New Bike', progress: 65 },
      educationLevel: 'Intermediate'
    },
    {
      id: '2', 
      name: 'Jake',
      age: 10,
      balance: 32.25,
      completedChores: 2,
      allowanceNext: '2025-01-15',
      savingsGoal: { name: 'Gaming Console', progress: 35 },
      educationLevel: 'Beginner'
    },
    {
      id: '3',
      name: 'Sophie',
      age: 8,
      balance: 18.75,
      completedChores: 1,
      allowanceNext: '2025-01-15',
      savingsGoal: { name: 'Art Supplies', progress: 80 },
      educationLevel: 'Beginner'
    }
  ], []);

  const recentActivities = useMemo(() => [
    {
      id: '1',
      type: 'chore_completed',
      childName: 'Emma',
      title: 'Chore Completed',
      description: 'Cleaned room and organized desk',
      amount: 5.00,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'allowance_paid',
      childName: 'Jake',
      title: 'Allowance Paid',
      description: 'Weekly allowance payment',
      amount: 10.00,
      timestamp: '1 day ago'
    },
    {
      id: '3',
      type: 'goal_progress',
      childName: 'Sophie',
      title: 'Savings Goal Update',
      description: 'Added $5 to Art Supplies fund',
      amount: 5.00,
      timestamp: '2 days ago'
    }
  ], []);

  // Memoized callback for tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Family Controls</h1>
          <p className="text-muted-foreground">Manage your family's financial journey</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Users className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      {/* Family Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Children</p>
                <p className="text-2xl font-bold">{familyStats.totalChildren}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Allowances Paid</p>
                <p className="text-2xl font-bold">${familyStats.totalAllowancesPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Chores Done</p>
                <p className="text-2xl font-bold">{familyStats.completedChores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{familyStats.activeGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Education</p>
                <p className="text-2xl font-bold">{familyStats.educationProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allowances">Allowances</TabsTrigger>
          <TabsTrigger value="chores">Chores</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Children Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <Card key={child.id} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{child.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Age {child.age}</p>
                    </div>
                    <Badge variant="secondary">{child.educationLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="font-semibold text-green-600">${child.balance}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Chores Done</span>
                    <div className="flex items-center space-x-1">
                      <CheckSquare className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{child.completedChores}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Savings Goal</span>
                      <span className="text-sm font-medium">{child.savingsGoal.progress}%</span>
                    </div>
                    <Progress value={child.savingsGoal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{child.savingsGoal.name}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Allowance</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{child.allowanceNext}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Family Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {activity.type === 'chore_completed' && <CheckSquare className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'allowance_paid' && <DollarSign className="h-4 w-4 text-green-500" />}
                        {activity.type === 'goal_progress' && <Target className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.childName} - {activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+${activity.amount}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allowances">
          <AllowanceManager />
        </TabsContent>

        <TabsContent value="chores">
          <ChoreManager />
        </TabsContent>

        <TabsContent value="goals">
          <ChildSavingsGoals />
        </TabsContent>

        <TabsContent value="controls">
          <SpendingControls />
        </TabsContent>

        <TabsContent value="education">
          <FinancialEducationHub />
        </TabsContent>

        <TabsContent value="activity">
          <FamilyActivityFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const EnhancedFamilyDashboard = React.memo(EnhancedFamilyDashboardComponent);