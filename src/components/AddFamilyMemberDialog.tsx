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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddFamilyMember } from '@/hooks/useFamilyMembers';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  relationship_type: z.string().min(1, 'Please select a relationship'),
  spending_limit: z.string().optional(),
  daily_limit: z.string().optional(),
  create_account: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface AddFamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddFamilyMemberDialog: React.FC<AddFamilyMemberDialogProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const addFamilyMember = useAddFamilyMember();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      relationship_type: '',
      spending_limit: '',
      daily_limit: '',
      create_account: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submission data:', data);
      
      await addFamilyMember.mutateAsync({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        relationship_type: data.relationship_type,
        spending_limit: data.spending_limit ? parseFloat(data.spending_limit) : undefined,
        daily_limit: data.daily_limit ? parseFloat(data.daily_limit) : undefined,
        create_account: data.create_account,
      });

      const successMessage = data.create_account 
        ? `${data.first_name} ${data.last_name} has been added with a new child account created!`
        : `${data.first_name} ${data.last_name} has been added to your family controls.`;
      
      toast({
        title: 'Family member added!',
        description: successMessage,
      });

      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error adding family member',
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add a family member to manage their spending and set controls. You can either link an existing account or create a new child account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form id="add-family-member-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder="john.doe@example.com" {...field} />
                     </FormControl>
                     <FormDescription>
                       Email address for the account (existing or new)
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="wife">Wife</SelectItem>
                        <SelectItem value="husband">Husband</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="teen">Teen</SelectItem>
                        <SelectItem value="dependent">Dependent</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="grandchild">Grandchild</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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

              <FormField
                control={form.control}
                name="create_account"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Create new child account
                      </FormLabel>
                      <FormDescription>
                        Check this box to automatically create a new account for this family member. If unchecked, they must already have an existing account.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
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
            disabled={addFamilyMember.isPending}
            className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            form="add-family-member-form"
          >
            {addFamilyMember.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              'Add Family Member'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};