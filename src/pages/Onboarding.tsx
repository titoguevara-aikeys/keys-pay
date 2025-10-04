import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(2, 'Please select a country'),
  preferred_language: z.enum(['en', 'ar']),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<'silver' | 'gold' | 'platinum'>('silver');
  const totalSteps = 4;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      preferred_language: 'en',
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUserId(user.id);

      // Check if already completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, full_name, country, preferred_language')
        .eq('user_id', user.id)
        .single();

      if ((profile as any)?.onboarding_completed) {
        navigate('/dashboard');
      } else if (profile) {
        // Pre-fill form with existing data
        form.reset({
          full_name: (profile as any).full_name || '',
          country: (profile as any).country || '',
          preferred_language: ((profile as any).preferred_language as 'en' | 'ar') || 'en',
        });
      }
    };

    checkAuth();
  }, [navigate, form]);

  const handleProfileSubmit = async (values: ProfileForm) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          country: values.country,
          preferred_language: values.preferred_language,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setStep(1);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTierSelection = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          membership_tier: selectedTier,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setStep(3);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const completeOnboarding = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Welcome to Keys Pay! 🎉',
        description: t('onboarding.done'),
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const progress = ((step + 1) / totalSteps) * 100;

  const tierOptions = [
    {
      value: 'silver' as const,
      name: t('onboarding.tierSilver'),
      description: t('onboarding.tierSilverDesc'),
      features: ['Basic account', 'Standard transfers', 'Mobile app access'],
      gradient: 'from-gray-400 to-gray-600',
    },
    {
      value: 'gold' as const,
      name: t('onboarding.tierGold'),
      description: t('onboarding.tierGoldDesc'),
      features: ['Everything in Silver', 'Lower fees', 'Priority support', 'Advanced analytics'],
      gradient: 'from-yellow-400 to-yellow-600',
    },
    {
      value: 'platinum' as const,
      name: t('onboarding.tierPlatinum'),
      description: t('onboarding.tierPlatinumDesc'),
      features: ['Everything in Gold', 'No fees', 'Concierge service', 'Exclusive perks', 'AI advisor'],
      gradient: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('onboarding.step')} {step + 1} {t('onboarding.of')} {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <CardTitle className="text-2xl">
            {step === 0 && t('onboarding.welcomeTitle')}
            {step === 1 && t('onboarding.profileTitle')}
            {step === 2 && t('onboarding.tierTitle')}
            {step === 3 && t('onboarding.finishTitle')}
          </CardTitle>
          <CardDescription>
            {step === 0 && t('onboarding.welcome')}
            {step === 1 && 'Tell us a bit about yourself'}
            {step === 2 && 'Select the membership level that fits your needs'}
            {step === 3 && t('onboarding.finishDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center p-8">
                <Sparkles className="h-24 w-24 text-primary animate-pulse" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  'Instant account setup',
                  'AI-powered budgeting',
                  'Family wallet management',
                  'Borderless payments',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(1)} className="w-full" size="lg">
                {t('onboarding.next')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('fullName')}</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  {...form.register('full_name')}
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('country')}</Label>
                <Input
                  id="country"
                  placeholder="United Arab Emirates"
                  {...form.register('country')}
                />
                {form.formState.errors.country && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={form.watch('preferred_language')}
                  onValueChange={(value: 'en' | 'ar') => form.setValue('preferred_language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('onboarding.back')}
                </Button>
                <Button type="submit" className="flex-1">
                  {t('onboarding.next')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Membership Tier */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {tierOptions.map((tier) => (
                  <Card
                    key={tier.value}
                    className={`cursor-pointer transition-all ${
                      selectedTier === tier.value
                        ? 'ring-2 ring-primary shadow-lg scale-105'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTier(tier.value)}
                  >
                    <CardHeader>
                      <div className={`h-16 rounded-lg bg-gradient-to-br ${tier.gradient} mb-2`} />
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('onboarding.back')}
                </Button>
                <Button onClick={handleTierSelection} className="flex-1">
                  {t('onboarding.next')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Finish */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center p-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Account Setup Complete!</h3>
                <p className="text-muted-foreground">
                  You're ready to start using Keys Pay. Your {selectedTier} membership gives you access to all the features you need.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('onboarding.back')}
                </Button>
                <Button onClick={completeOnboarding} className="flex-1" size="lg">
                  {t('onboarding.goToDashboard')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
