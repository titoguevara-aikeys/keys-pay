import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tiers = [
  {
    name: 'Silver',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'AI budgeting',
      'Family wallet (basic)',
      'Essential payments',
      'Basic card benefits',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Gold',
    price: '$9',
    period: '/month',
    description: 'For growing families',
    features: [
      'Everything in Silver',
      'Enhanced spending limits',
      'Priority support',
      'Advanced analytics',
      'Travel insurance',
      'Cashback rewards',
    ],
    cta: 'Get Gold',
    highlighted: true,
  },
  {
    name: 'Platinum',
    price: '$29',
    period: '/month',
    description: 'Premium experience',
    features: [
      'Everything in Gold',
      'Premium metal card',
      'Concierge service',
      'Exclusive perks',
      'Higher limits',
      'Airport lounge access',
    ],
    cta: 'Get Platinum',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="membership" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose your membership
          </h2>
          <p className="text-lg text-muted-foreground">
            Select a plan that grows with your financial needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative ${
                tier.highlighted
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border'
              }`}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground">{tier.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="block">
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? 'default' : 'outline'}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
