import React, { useState } from 'react';
import { Plus, Settings, Shield, DollarSign, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFamilyMembers, useAddFamilyMember, useUpdateFamilyMember } from '@/hooks/useFamilyMembers';
import { AddFamilyMemberDialog } from '@/components/AddFamilyMemberDialog';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { useToast } from '@/hooks/use-toast';

const FamilyControls = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: familyMembers, isLoading } = useFamilyMembers();
  const { toast } = useToast();

  const stats = {
    totalMembers: familyMembers?.length || 0,
    activeMembers: familyMembers?.filter(m => m.status === 'active').length || 0,
    totalSpendingLimit: familyMembers?.reduce((sum, m) => sum + (m.spending_limit || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Family Controls</h1>
            <p className="text-muted-foreground mt-2">
              Manage spending limits and controls for family members
            </p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Family Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeMembers} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spending Limits</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpendingLimit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Combined limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                All controls enabled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Family Members */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Family Members</h2>
            {familyMembers && familyMembers.length > 0 && (
              <Badge variant="secondary">
                {familyMembers.length} member{familyMembers.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {familyMembers && familyMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <FamilyMemberCard 
                  key={member.id} 
                  member={member}
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
                    Add family members to start managing their spending and controls
                  </p>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Family Member
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common family control tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Spending Reports
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Transaction History
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Global Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddFamilyMemberDialog 
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
};

export default FamilyControls;