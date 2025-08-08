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
import { useCreateCard, useCards } from '@/hooks/useCards';
import { useAccounts } from '@/hooks/useAccounts';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const getAccountDisplayName = (accountType: string) => {
  const accountTypes: { [key: string]: string } = {
    // Personal Banking
    'checking': 'Personal Checking Account',
    'savings': 'Personal Savings Account',
    'money_market': 'Money Market Account',
    'certificate_deposit': 'Certificate of Deposit (CD)',
    'high_yield_savings': 'High-Yield Savings Account',
    
    // Business Banking
    'business': 'Business Checking Account',
    'business_savings': 'Business Savings Account',
    'business_credit': 'Business Credit Line',
    'merchant': 'Merchant Payment Account',
    'corporate': 'Corporate Banking Account',
    'escrow': 'Escrow Account',
    'payroll': 'Payroll Management Account',
    
    // Investment & Wealth
    'investment': 'Investment Portfolio Account',
    'brokerage': 'Brokerage Trading Account',
    'robo_advisor': 'Robo-Advisor Investment Account',
    'mutual_fund': 'Mutual Fund Account',
    'etf': 'ETF Portfolio Account',
    'real_estate': 'Real Estate Investment Account',
    
    // Retirement Planning
    'retirement_401k': '401(k) Retirement Account',
    'retirement_ira': 'Traditional IRA Account',
    'retirement_roth': 'Roth IRA Account',
    'retirement_sep': 'SEP-IRA Account',
    'retirement_simple': 'SIMPLE IRA Account',
    'pension': 'Pension Fund Account',
    
    // Specialized Accounts
    'student': 'Student Banking Account',
    'joint': 'Joint Account',
    'trust': 'Trust Fund Account',
    'custodial': 'Custodial Account (Minor)',
    'estate': 'Estate Management Account',
    'nonprofit': 'Non-Profit Organization Account',
    
    // Digital & Crypto
    'crypto': 'Cryptocurrency Wallet',
    'defi': 'DeFi Staking Account',
    'nft': 'NFT Collection Wallet',
    'digital_assets': 'Digital Assets Portfolio',
    
    // Trading & Forex
    'forex': 'Forex Trading Account',
    'commodities': 'Commodities Trading Account',
    'futures': 'Futures Trading Account',
    'options': 'Options Trading Account',
    'day_trading': 'Day Trading Account',
    
    // Premium & VIP Services
    'premium': 'Premium Banking Account',
    'vip': 'VIP Private Banking',
    'private_wealth': 'Private Wealth Management',
    'concierge': 'Concierge Banking Account',
    
    // International & Multi-Currency
    'international': 'International Banking Account',
    'multi_currency': 'Multi-Currency Account',
    'foreign_exchange': 'Foreign Exchange Account',
    'offshore': 'Offshore Banking Account',
    
    // Specialized Financial Services
    'insurance': 'Insurance Premium Account',
    'loan_servicing': 'Loan Servicing Account',
    'credit_builder': 'Credit Building Account',
    'debt_consolidation': 'Debt Consolidation Account',
    'emergency_fund': 'Emergency Fund Account',
    
    // Family & Education
    'family_plan': 'Family Banking Plan',
    'education_savings': 'Education Savings Account (529)',
    'child_savings': 'Children\'s Savings Account',
    'allowance': 'Kids Allowance Account'
  };
  return accountTypes[accountType] || accountType;
};

const getCardLimits = (userTier: string = 'regular') => {
  const limits: { [key: string]: { max: number; description: string } } = {
    'regular': { max: 3, description: 'Regular members can create up to 3 cards' },
    'silver': { max: 5, description: 'Silver members can create up to 5 cards' },
    'gold': { max: 8, description: 'Gold members can create up to 8 cards' },
    'platinum': { max: 15, description: 'Platinum members can create up to 15 cards' },
    'vip': { max: 20, description: 'VIP members can create up to 20 cards' }
  };
  return limits[userTier] || limits['regular'];
};

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
  const { data: existingCards } = useCards();
  const { data: profile } = useProfile();
  
  // Get user's membership tier and card limits
  const userTier = profile?.membership_tier || 'regular';
  const cardLimits = getCardLimits(userTier);

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
      // Check card limits
      const currentCardCount = existingCards?.length || 0;
      if (currentCardCount >= cardLimits.max) {
        toast({
          title: 'Card limit reached',
          description: `${cardLimits.description}. Please upgrade your membership to create more cards.`,
          variant: 'destructive',
        });
        return;
      }

      await createCard.mutateAsync({
        account_id: data.account_id,
        card_type: data.card_type,
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
            {existingCards && (
              <span className="block mt-2 text-sm">
                <span className="text-muted-foreground">Cards created: {existingCards.length} / {cardLimits.max}</span>
                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Member
                </span>
              </span>
            )}
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
                     <SelectContent className="max-h-[400px]">
                        {/* Existing User Accounts */}
                        {accounts && accounts.length > 0 && (
                          <>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{getAccountDisplayName(account.account_type)}</span>
                                  <span className="text-sm text-muted-foreground">Balance: ${account.balance?.toLocaleString()}</span>
                                </div>
                              </SelectItem>
                            ))}
                            <div className="px-2 py-1">
                              <div className="h-px bg-border my-1"></div>
                            </div>
                          </>
                        )}
                        
                        {/* Recommended Personal Banking */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Personal Banking
                        </div>
                        <SelectItem value="checking">
                          <div className="flex flex-col">
                            <span className="font-medium">Personal Checking Account</span>
                            <span className="text-sm text-muted-foreground">Everyday banking with debit access</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="savings">
                          <div className="flex flex-col">
                            <span className="font-medium">Personal Savings Account</span>
                            <span className="text-sm text-muted-foreground">High-yield savings with earning potential</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high_yield_savings">
                          <div className="flex flex-col">
                            <span className="font-medium">High-Yield Savings Account</span>
                            <span className="text-sm text-muted-foreground">Premium rates for your savings</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="money_market">
                          <div className="flex flex-col">
                            <span className="font-medium">Money Market Account</span>
                            <span className="text-sm text-muted-foreground">Higher interest with check writing</span>
                          </div>
                        </SelectItem>

                        {/* Business Banking */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                          Business Banking
                        </div>
                        <SelectItem value="business">
                          <div className="flex flex-col">
                            <span className="font-medium">Business Checking Account</span>
                            <span className="text-sm text-muted-foreground">Professional banking for businesses</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="business_savings">
                          <div className="flex flex-col">
                            <span className="font-medium">Business Savings Account</span>
                            <span className="text-sm text-muted-foreground">Grow your business reserves</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="merchant">
                          <div className="flex flex-col">
                            <span className="font-medium">Merchant Payment Account</span>
                            <span className="text-sm text-muted-foreground">Accept payments from customers</span>
                          </div>
                        </SelectItem>

                        {/* Investment & Wealth */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                          Investment & Wealth
                        </div>
                        <SelectItem value="investment">
                          <div className="flex flex-col">
                            <span className="font-medium">Investment Portfolio Account</span>
                            <span className="text-sm text-muted-foreground">Diversified investment management</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="brokerage">
                          <div className="flex flex-col">
                            <span className="font-medium">Brokerage Trading Account</span>
                            <span className="text-sm text-muted-foreground">Active trading and portfolio management</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="robo_advisor">
                          <div className="flex flex-col">
                            <span className="font-medium">Robo-Advisor Investment Account</span>
                            <span className="text-sm text-muted-foreground">Automated investment strategies</span>
                          </div>
                        </SelectItem>

                        {/* Retirement Planning */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                          Retirement Planning
                        </div>
                        <SelectItem value="retirement_401k">
                          <div className="flex flex-col">
                            <span className="font-medium">401(k) Retirement Account</span>
                            <span className="text-sm text-muted-foreground">Employer-sponsored retirement savings</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="retirement_ira">
                          <div className="flex flex-col">
                            <span className="font-medium">Traditional IRA Account</span>
                            <span className="text-sm text-muted-foreground">Tax-deferred retirement planning</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="retirement_roth">
                          <div className="flex flex-col">
                            <span className="font-medium">Roth IRA Account</span>
                            <span className="text-sm text-muted-foreground">Tax-free retirement growth</span>
                          </div>
                        </SelectItem>

                        {/* Digital Assets */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                          Digital Assets
                        </div>
                        <SelectItem value="crypto">
                          <div className="flex flex-col">
                            <span className="font-medium">Cryptocurrency Wallet</span>
                            <span className="text-sm text-muted-foreground">Bitcoin, Ethereum, and digital assets</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="defi">
                          <div className="flex flex-col">
                            <span className="font-medium">DeFi Staking Account</span>
                            <span className="text-sm text-muted-foreground">Decentralized finance protocols</span>
                          </div>
                        </SelectItem>

                        {/* Premium Services */}
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                          Premium Services
                        </div>
                        <SelectItem value="premium">
                          <div className="flex flex-col">
                            <span className="font-medium">Premium Banking Account</span>
                            <span className="text-sm text-muted-foreground">Enhanced features and benefits</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="vip">
                          <div className="flex flex-col">
                            <span className="font-medium">VIP Private Banking</span>
                            <span className="text-sm text-muted-foreground">Exclusive concierge banking services</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private_wealth">
                          <div className="flex flex-col">
                            <span className="font-medium">Private Wealth Management</span>
                            <span className="text-sm text-muted-foreground">Personalized wealth strategies</span>
                          </div>
                        </SelectItem>
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
                       <SelectItem value="debit">Keys Pay Debit Card (Regular)</SelectItem>
                       <SelectItem value="credit">Keys Pay Credit Card (Regular)</SelectItem>
                       <SelectItem value="silver_debit">Silver Debit Card (VIP)</SelectItem>
                       <SelectItem value="silver_credit">Silver Credit Card (VIP)</SelectItem>
                       <SelectItem value="gold_debit">Gold Debit Card (Premium)</SelectItem>
                       <SelectItem value="gold_credit">Gold Credit Card (Premium)</SelectItem>
                       <SelectItem value="platinum_debit">Platinum Debit Card (Elite)</SelectItem>
                       <SelectItem value="platinum_credit">Platinum Credit Card (Elite)</SelectItem>
                     </SelectContent>
                  </Select>
                   <FormDescription>
                     Choose your card type and membership level for exclusive benefits
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