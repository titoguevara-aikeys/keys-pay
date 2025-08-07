import React from 'react';
import { CreditCard, DollarSign, Shield, Clock, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccounts } from '@/hooks/useAccounts';
import type { FamilyMember } from '@/hooks/useFamilyMembers';

interface ChildAccountCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onTransfer: (member: FamilyMember) => void;
  onRemove: (member: FamilyMember) => void;
}

export const ChildAccountCard: React.FC<ChildAccountCardProps> = ({
  member,
  onEdit,
  onTransfer,
  onRemove,
}) => {
  const { data: accounts } = useAccounts();
  
  // Find the child's account
  const childAccount = accounts?.find(account => account.user_id === member.child_id);
  
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'CH';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const relationshipLabels = {
    child: 'Child',
    teen: 'Teenager',
    dependent: 'Dependent',
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(member.child_profile?.first_name, member.child_profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              {member.child_profile?.first_name} {member.child_profile?.last_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {relationshipLabels[member.relationship_type as keyof typeof relationshipLabels] || member.relationship_type}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
              <span className="text-xs capitalize">{member.status}</span>
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(member)}>
              Edit Controls
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTransfer(member)}>
              Send Money
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onRemove(member)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Account Information */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Account Balance</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            ${childAccount?.balance?.toFixed(2) || '0.00'}
          </span>
        </div>

        {/* Spending Limits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">Monthly Limit</span>
            </div>
            <span className="text-sm font-medium">
              ${member.spending_limit?.toFixed(2) || 'None'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">Daily Limit</span>
            </div>
            <span className="text-sm font-medium">
              ${member.transaction_limit?.toFixed(2) || 'None'}
            </span>
          </div>
        </div>

        {/* Security Status */}
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <Shield className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Protected Account</span>
          <Badge variant="outline" className="ml-auto text-xs">
            Parent Controlled
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onTransfer(member)}>
            <DollarSign className="h-3 w-3 mr-1" />
            Send Money
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(member)}>
            View Activity
          </Button>
        </div>

        {/* Account Details */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Account: {childAccount?.account_number || 'Not found'}</div>
          <div>Created: {new Date(member.created_at).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  );
};