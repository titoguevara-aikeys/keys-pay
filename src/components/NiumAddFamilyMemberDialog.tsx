import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddNiumFamilyMember } from '@/hooks/useNiumFamily';
import { Loader2, CreditCard, Shield, DollarSign } from 'lucide-react';

interface NiumAddFamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NiumAddFamilyMemberDialog: React.FC<NiumAddFamilyMemberDialogProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    relationshipType: 'child',
    spendingLimit: 200,
    dailyLimit: 50,
  });

  const addFamilyMember = useAddNiumFamilyMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🟢 Form submitted with data:', formData);
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      console.log('🔴 Validation failed - missing required fields');
      return;
    }

    try {
      console.log('🟡 Calling addFamilyMember.mutateAsync...');
      await addFamilyMember.mutateAsync(formData);
      console.log('✅ Family member added successfully!');
      
      // Reset form and close dialog
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        relationshipType: 'child',
        spendingLimit: 200,
        dailyLimit: 50,
      });
      onClose();
    } catch (error) {
      console.error('🔴 Failed to add family member:', error);
    }
  };

  const handleClose = () => {
    if (!addFamilyMember.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Family Member via Keys Pay
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Emma"
                required
                disabled={addFamilyMember.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Johnson"
                required
                disabled={addFamilyMember.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="emma@family.com"
              required
              disabled={addFamilyMember.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select
              value={formData.relationshipType}
              onValueChange={(value) => setFormData({ ...formData, relationshipType: value })}
              disabled={addFamilyMember.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="teen">Teen</SelectItem>
                <SelectItem value="dependent">Dependent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spendingLimit" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Monthly Limit (AED)
              </Label>
              <Input
                id="spendingLimit"
                type="number"
                value={formData.spendingLimit}
                onChange={(e) => setFormData({ ...formData, spendingLimit: Number(e.target.value) })}
                min={10}
                max={5000}
                disabled={addFamilyMember.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyLimit" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Daily Limit (AED)
              </Label>
              <Input
                id="dailyLimit"
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
                min={5}
                max={500}
                disabled={addFamilyMember.isPending}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">What will be created:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keys Pay sandbox account with virtual IBAN</li>
              <li>• Virtual debit card for online purchases</li>
              <li>• Spending controls and transaction monitoring</li>
              <li>• Real-time activity notifications</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={addFamilyMember.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addFamilyMember.isPending}
            >
              {addFamilyMember.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating via Keys Pay...
                </>
              ) : (
                'Create Account & Card'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};