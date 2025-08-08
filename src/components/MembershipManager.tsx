import React, { useState } from 'react';
import { Crown, Star, Award, CreditCard, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface MembershipTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  cardLimit: number;
  benefits: string[];
  badgeColor: string;
  popular?: boolean;
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'regular',
    name: 'Regular',
    icon: <CreditCard className="h-5 w-5" />,
    price: 0,
    cardLimit: 3,
    benefits: [
      'Up to 3 virtual cards',
      'Basic spending controls',
      'Standard customer support',
      'Keys Pay blue cards'
    ],
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'silver',
    name: 'Silver',
    icon: <Award className="h-5 w-5" />,
    price: 9.99,
    cardLimit: 5,
    benefits: [
      'Up to 5 virtual cards',
      'Enhanced spending controls',
      'Priority customer support',
      'Silver tier card designs',
      'Monthly spending reports'
    ],
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300'
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: <Star className="h-5 w-5" />,
    price: 19.99,
    cardLimit: 8,
    benefits: [
      'Up to 8 virtual cards',
      'Advanced spending analytics',
      '24/7 premium support',
      'Gold tier card designs',
      'Real-time notifications',
      'Cashback rewards (1%)'
    ],
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    popular: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    icon: <Crown className="h-5 w-5" />,
    price: 39.99,
    cardLimit: 15,
    benefits: [
      'Up to 15 virtual cards',
      'Complete financial insights',
      'Dedicated account manager',
      'Platinum tier card designs',
      'Custom spending limits',
      'Enhanced cashback (2%)',
      'Travel insurance',
      'Concierge services'
    ],
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'vip',
    name: 'VIP',
    icon: <Crown className="h-5 w-5" />,
    price: 99.99,
    cardLimit: 20,
    benefits: [
      'Unlimited virtual cards',
      'White-glove service',
      'Personal financial advisor',
      'Exclusive VIP card designs',
      'Priority transaction processing',
      'Premium cashback (3%)',
      'Airport lounge access',
      'Investment advisory'
    ],
    badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400'
  }
];

interface MembershipManagerProps {
  currentTier?: string;
}

export const MembershipManager: React.FC<MembershipManagerProps> = ({ 
  currentTier = 'regular' 
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { toast } = useToast();

  const currentMembership = membershipTiers.find(tier => tier.id === currentTier) || membershipTiers[0];
  const selectedMembership = membershipTiers.find(tier => tier.id === selectedTier);

  const handleUpgrade = async () => {
    if (!selectedMembership) return;

    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Membership upgraded successfully!',
        description: `Welcome to ${selectedMembership.name} membership. Your new benefits are now active.`,
      });
      
      setShowUpgradeDialog(false);
      setSelectedTier(null);
    } catch (error) {
      toast({
        title: 'Upgrade failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Membership Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentMembership.icon}
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Membership: {currentMembership.name}
                  <Badge className={currentMembership.badgeColor}>
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {currentMembership.cardLimit} cards available • ${currentMembership.price}/month
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Current Benefits</h4>
              <ul className="text-sm space-y-1">
                {currentMembership.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{currentMembership.cardLimit}</p>
                <p className="text-sm text-muted-foreground">Virtual Cards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Upgrade Your Membership</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {membershipTiers
            .filter(tier => tier.id !== currentTier)
            .map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedTier === tier.id ? 'ring-2 ring-primary' : ''
                } ${tier.popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {tier.icon}
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {tier.name}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    ${tier.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {tier.benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                    {tier.benefits.length > 4 && (
                      <li className="text-muted-foreground text-xs">
                        +{tier.benefits.length - 4} more benefits
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Upgrade Button */}
      {selectedTier && (
        <div className="flex justify-center">
          <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                Upgrade to {selectedMembership?.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade to {selectedMembership?.name}</DialogTitle>
                <DialogDescription>
                  Confirm your membership upgrade to unlock new features and benefits.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{selectedMembership?.name} Membership</p>
                    <p className="text-sm text-muted-foreground">Monthly subscription</p>
                  </div>
                  <p className="text-xl font-bold">${selectedMembership?.price}/month</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">You'll get access to:</h4>
                  <ul className="space-y-1">
                    {selectedMembership?.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUpgradeDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpgrade}
                    className="flex-1"
                  >
                    Confirm Upgrade
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};