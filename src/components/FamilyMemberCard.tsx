import React, { useState, useCallback } from 'react';
import { MoreHorizontal, Edit, Shield, DollarSign, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUpdateFamilyMember, type FamilyMember } from '@/hooks/useFamilyMembers';
import { useToast } from '@/hooks/use-toast';

interface FamilyMemberCardProps {
  member: FamilyMember;
}

const FamilyMemberCardComponent: React.FC<FamilyMemberCardProps> = ({ member }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateMember = useUpdateFamilyMember();
  const { toast } = useToast();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName || '';
    const last = lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'FM';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleStatusToggle = useCallback(async () => {
    try {
      const newStatus = member.status === 'active' ? 'suspended' : 'active';
      await updateMember.mutateAsync({
        memberId: member.id,
        updates: { status: newStatus }
      });

      toast({
        title: 'Status updated',
        description: `Family member is now ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [member.status, member.id, updateMember, toast]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(
                  member.child_profile?.first_name,
                  member.child_profile?.last_name
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">
                {member.child_profile?.first_name} {member.child_profile?.last_name}
              </h3>
              <Badge variant="outline" className="text-xs">
                {member.relationship_type}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStatusToggle}>
                <Shield className="h-4 w-4 mr-2" />
                {member.status === 'active' ? 'Suspend' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge 
            className={`text-xs ${getStatusColor(member.status)}`}
            variant="outline"
          >
            {member.status}
          </Badge>
        </div>

        {/* Spending Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Monthly Limit</span>
          </div>
          <span className="text-sm font-medium">
            {member.spending_limit ? `$${member.spending_limit}` : 'No limit'}
          </span>
        </div>

        {/* Transaction Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Daily Limit</span>
          </div>
          <span className="text-sm font-medium">
            {member.transaction_limit ? `$${member.transaction_limit}` : 'No limit'}
          </span>
        </div>

        {/* Member Since */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Member Since</span>
          </div>
          <span className="text-sm font-medium">
            {new Date(member.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            View Transactions
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Send Money
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const FamilyMemberCard = React.memo(FamilyMemberCardComponent);