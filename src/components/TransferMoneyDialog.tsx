import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransferMoney } from '@/hooks/useTransfer';
import { useToast } from '@/hooks/use-toast';
import type { FamilyMember } from '@/hooks/useFamilyMembers';
import { useAuth } from '@/contexts/MockAuthContext';

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransferMoneyDialogProps {
  open: boolean;
  onClose: () => void;
  member: FamilyMember | null;
}

export const TransferMoneyDialog: React.FC<TransferMoneyDialogProps> = ({
  open,
  onClose,
  member,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const transferMoney = useTransferMoney();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });

  const parentAccount = accounts?.find(account => account.user_id === user?.id);
  const childAccount = accounts?.find(account => account.user_id === member?.child_id);

  const onSubmit = async (data: FormData) => {
    if (!member || !parentAccount || !childAccount) {
      toast({
        title: 'Error',
        description: 'Account information not found',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(data.amount);

    try {
      await transferMoney.mutateAsync({
        fromAccountId: parentAccount.id,
        toAccountId: childAccount.id,
        amount: amount,
        description: data.description || `Transfer to ${member.child_profile?.first_name} ${member.child_profile?.last_name}`,
        recipient: `${member.child_profile?.first_name} ${member.child_profile?.last_name}`,
      });

      toast({
        title: 'Transfer completed!',
        description: `$${amount.toFixed(2)} sent to ${member.child_profile?.first_name} ${member.child_profile?.last_name}`,
      });

      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Transfer failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Transfer money to {member.child_profile?.first_name} {member.child_profile?.last_name}'s account
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Information */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Balance:</span>
                <span className="font-medium">${parentAccount?.balance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Child's Balance:</span>
                <span className="font-medium">${childAccount?.balance?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you want to transfer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a note for this transfer..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={transferMoney.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {transferMoney.isPending ? 'Sending...' : 'Send Money'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};