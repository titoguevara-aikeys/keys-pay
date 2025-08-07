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
import { useUpdateFamilyMember } from '@/hooks/useFamilyMembers';
import { useToast } from '@/hooks/use-toast';
import type { FamilyMember } from '@/hooks/useFamilyMembers';

const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  relationship_type: z.string().min(1, 'Please select a relationship'),
  spending_limit: z.string().optional(),
  daily_limit: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditFamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: FamilyMember | null;
}

export const EditFamilyMemberDialog: React.FC<EditFamilyMemberDialogProps> = ({
  open,
  onClose,
  member,
}) => {
  const { toast } = useToast();
  const updateFamilyMember = useUpdateFamilyMember();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: member?.child_profile?.first_name || '',
      last_name: member?.child_profile?.last_name || '',
      relationship_type: member?.relationship_type || '',
      spending_limit: member?.spending_limit?.toString() || '',
      daily_limit: member?.transaction_limit?.toString() || '',
    },
  });

  // Update form when member changes
  React.useEffect(() => {
    if (member) {
      form.reset({
        first_name: member.child_profile?.first_name || '',
        last_name: member.child_profile?.last_name || '',
        relationship_type: member.relationship_type || '',
        spending_limit: member.spending_limit?.toString() || '',
        daily_limit: member.transaction_limit?.toString() || '',
      });
    }
  }, [member, form]);

  const onSubmit = async (data: FormData) => {
    if (!member) return;

    try {
      // Update both family controls and profile information
      await updateFamilyMember.mutateAsync({
        memberId: member.id,
        updates: {
          relationship_type: data.relationship_type,
          spending_limit: data.spending_limit ? parseFloat(data.spending_limit) : null,
          transaction_limit: data.daily_limit ? parseFloat(data.daily_limit) : null,
        },
        profileUpdates: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
      
      toast({
        title: 'Family member updated!',
        description: `${data.first_name} ${data.last_name}'s information has been updated.`,
      });

      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error updating family member',
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Family Member</DialogTitle>
          <DialogDescription>
            Update {member.child_profile?.first_name}'s information and family controls.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form id="edit-family-member-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="relationship_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="teen">Teen</SelectItem>
                        <SelectItem value="dependent">Dependent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="spending_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Spending Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="500.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Transaction Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="100.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex gap-3 pt-6 flex-shrink-0 border-t bg-background">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateFamilyMember.isPending}
            className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            form="edit-family-member-form"
          >
            {updateFamilyMember.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              'Update Member'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};