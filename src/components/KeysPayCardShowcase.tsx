import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  Crown,
  Award,
  Star,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

// Import card background images
import platinumCardBg from '@/assets/platinum-card-bg.png';
import goldCardBg from '@/assets/gold-card-bg.png';
import silverCardBg from '@/assets/silver-card-bg.png';

interface CardTier {
  id: string;
  name: string;
  tier: string;
  backgroundImage: string;
  gradient: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  features: string[];
  limits: {
    spending: string;
    withdrawal: string;
  };
  benefits: string[];
}

const cardTiers: CardTier[] = [
  {
    id: 'platinum',
    name: 'Keys Pay Platinum',
    tier: 'Premium',
    backgroundImage: platinumCardBg,
    gradient: 'from-slate-400 via-slate-300 to-slate-200',
    icon: Crown,
    iconColor: 'text-purple-400',
    features: ['Unlimited transactions', 'Global acceptance', 'Premium support'],
    limits: {
      spending: '$50,000/month',
      withdrawal: '$10,000/day'
    },
    benefits: ['Airport lounge access', 'Travel insurance', 'Cashback rewards']
  },
  {
    id: 'gold',
    name: 'Keys Pay Gold',
    tier: 'Premium',
    backgroundImage: goldCardBg,
    gradient: 'from-yellow-400 via-yellow-300 to-yellow-200',
    icon: Award,
    iconColor: 'text-yellow-500',
    features: ['High limits', 'Priority support', 'Rewards program'],
    limits: {
      spending: '$25,000/month',
      withdrawal: '$5,000/day'
    },
    benefits: ['Concierge service', 'Purchase protection', '2% cashback']
  },
  {
    id: 'silver',
    name: 'Keys Pay Silver',
    tier: 'Standard',
    backgroundImage: silverCardBg,
    gradient: 'from-gray-300 via-gray-200 to-gray-100',
    icon: Star,
    iconColor: 'text-gray-500',
    features: ['Standard limits', 'Basic support', 'Mobile payments'],
    limits: {
      spending: '$10,000/month',
      withdrawal: '$2,500/day'
    },
    benefits: ['Fraud protection', 'Mobile banking', '1% cashback']
  },
  {
    id: 'virtual',
    name: 'Keys Pay Virtual',
    tier: 'Digital',
    backgroundImage: '',
    gradient: 'from-blue-600 via-purple-600 to-indigo-600',
    icon: Smartphone,
    iconColor: 'text-blue-400',
    features: ['Instant issuance', 'Digital wallet', 'Online payments'],
    limits: {
      spending: '$5,000/month',
      withdrawal: '$1,000/day'
    },
    benefits: ['Instant activation', 'Virtual security', 'Digital receipts']
  }
];

interface KeysPayCardShowcaseProps {
  onSelectCard?: (cardId: string) => void;
  showCreateButton?: boolean;
  onCreateCard?: () => void;
}

export const KeysPayCardShowcase: React.FC<KeysPayCardShowcaseProps> = ({
  onSelectCard,
  showCreateButton = true,
  onCreateCard
}) => {
  const handleCardSelect = (cardId: string) => {
    onSelectCard?.(cardId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Keys Pay Card Collection</h2>
        <p className="text-muted-foreground">
          Choose from our premium card tiers designed for your lifestyle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardTiers.map((cardTier) => (
          <Card 
            key={cardTier.id}
            className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleCardSelect(cardTier.id)}
          >
            <CardContent className="p-0">
              {/* Card Design Preview */}
              <div className="relative aspect-[3/2] overflow-hidden">
                {cardTier.backgroundImage ? (
                  <div
                    className="w-full h-full bg-cover bg-center relative"
                    style={{ 
                      backgroundImage: `url(${cardTier.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Card overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                  </div>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cardTier.gradient} relative`} />
                )}
                
                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
                        alt="Keys Pay Logo" 
                        className="h-6 w-6" 
                      />
                      <Badge variant="secondary" className="text-xs">
                        {cardTier.tier}
                      </Badge>
                    </div>
                    <cardTier.icon className={`h-5 w-5 ${cardTier.iconColor}`} />
                  </div>
                  
                  {/* Card Number Placeholder */}
                  <div className="font-mono text-lg tracking-wider">
                    •••• •••• •••• 1234
                  </div>
                  
                  {/* Bottom Row */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-75">CARDHOLDER</p>
                      <p className="text-sm font-semibold">{cardTier.name}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">EXPIRES</p>
                      <p className="text-sm font-semibold">12/28</p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{cardTier.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <cardTier.icon className={`h-4 w-4 ${cardTier.iconColor}`} />
                    <span>{cardTier.tier} Tier</span>
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spending Limit</span>
                    <span className="font-medium">{cardTier.limits.spending}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Withdrawal</span>
                    <span className="font-medium">{cardTier.limits.withdrawal}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Key Features</h4>
                  <div className="space-y-1">
                    {cardTier.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardSelect(cardTier.id);
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Apply for {cardTier.name}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateButton && onCreateCard && (
        <div className="text-center">
          <Button size="lg" onClick={onCreateCard} className="animate-fade-in">
            <CreditCard className="h-5 w-5 mr-2" />
            Create Your Keys Pay Card
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Get started with instant virtual card issuance
          </p>
        </div>
      )}
    </div>
  );
};