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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateCard } from '@/hooks/useCards';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  account_id: z.string().min(1, 'Please select an account'),
  card_type: z.string().min(1, 'Please select a card type'),
  spending_limit: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateCardDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCardDialog: React.FC<CreateCardDialogProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const createCard = useCreateCard();
  const { data: accounts } = useAccounts();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_id: '',
      card_type: 'debit',
      spending_limit: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createCard.mutateAsync({
        account_id: data.account_id,
        card_type: data.card_type as 'debit' | 'credit',
        spending_limit: data.spending_limit ? parseFloat(data.spending_limit) : undefined,
      });

      toast({
        title: 'Card created successfully!',
        description: 'Your new virtual card is ready to use.',
      });

      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error creating card',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Virtual Card</DialogTitle>
          <DialogDescription>
            Create a new virtual card for secure online payments and spending control.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_type} - ${account.balance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The account this card will be linked to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose between debit (direct account access) or credit card
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spending_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Spending Limit (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="1000.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Set a monthly spending limit for this card
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCard.isPending}>
                {createCard.isPending ? 'Creating...' : 'Create Card'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};