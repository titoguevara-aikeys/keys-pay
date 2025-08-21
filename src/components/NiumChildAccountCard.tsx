import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Send, 
  Pause, 
  Play,
  Shield,
  Banknote
} from 'lucide-react';
import type { NiumFamilyMember } from '@/lib/nium/family-api';
import { useBlockChildCard, useIssueChildCard } from '@/hooks/useNiumFamily';

interface NiumChildAccountCardProps {
  member: NiumFamilyMember;
  onEdit: (member: NiumFamilyMember) => void;
  onTransfer: (member: NiumFamilyMember) => void;
  onSuspend: (member: NiumFamilyMember) => void;
}

export const NiumChildAccountCard: React.FC<NiumChildAccountCardProps> = ({
  member,
  onEdit,
  onTransfer,
  onSuspend,
}) => {
  const issueCard = useIssueChildCard();
  const blockCard = useBlockChildCard();

  const handleIssueCard = async () => {
    if (!member.cardDetails) {
      await issueCard.mutateAsync(member.id);
    }
  };

  const handleBlockCard = async () => {
    if (member.cardDetails) {
      await blockCard.mutateAsync({ 
        memberId: member.id, 
        cardId: member.cardDetails.cardId 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{member.firstName} {member.lastName}</CardTitle>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          <Badge className={getStatusColor(member.status)}>
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Account Balance */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">NIUM Account Balance</p>
              <p className="text-xl font-bold">AED {member.balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Account: {member.accountNumber}</p>
            <p className="text-xs text-muted-foreground">IBAN: {member.iban.slice(0, 10)}...</p>
          </div>
        </div>

        {/* Virtual Card Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">NIUM Virtual Card</p>
              {member.cardDetails ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">**** {member.cardDetails.last4}</p>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(member.cardDetails.status)}
                  >
                    {member.cardDetails.status}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No card issued</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!member.cardDetails ? (
              <Button 
                size="sm" 
                onClick={handleIssueCard}
                disabled={issueCard.isPending}
              >
                {issueCard.isPending ? 'Issuing...' : 'Issue Card'}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleBlockCard}
                disabled={blockCard.isPending}
              >
                {member.cardDetails.status === 'active' ? (
                  <><Pause className="h-4 w-4 mr-1" /> Block</>
                ) : (
                  <><Play className="h-4 w-4 mr-1" /> Unblock</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Spending Limits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-muted-foreground">Monthly Limit</p>
            </div>
            <p className="font-semibold">AED {member.spendingLimit}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Daily Limit</p>
            </div>
            <p className="font-semibold">AED {member.dailyLimit}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onTransfer(member)}
          >
            <Send className="h-4 w-4 mr-2" />
            Transfer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(member)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSuspend(member)}
            disabled={member.status === 'suspended'}
          >
            <Pause className="h-4 w-4 mr-2" />
            {member.status === 'active' ? 'Suspend' : 'Suspended'}
          </Button>
        </div>

        {/* Account Details */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div className="flex justify-between">
            <span>Customer ID:</span>
            <span className="font-mono">{member.customerHashId.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Wallet ID:</span>
            <span className="font-mono">{member.walletHashId.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(member.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Relationship:</span>
            <span className="capitalize">{member.relationship_type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};