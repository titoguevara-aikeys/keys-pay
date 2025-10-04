import { Wallet, Shield, CreditCard, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Wallet,
    title: 'Unified Wallet',
    description: 'Manage cash, crypto, cards, and bills all in one secure place.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with full regulatory compliance.',
  },
  {
    icon: CreditCard,
    title: 'Premium Cards',
    description: 'Silver, Gold, and Platinum cards with exclusive benefits.',
  },
  {
    icon: TrendingUp,
    title: 'AI Budgeting',
    description: 'Smart insights and recommendations powered by AI.',
  },
  {
    icon: Users,
    title: 'Family Access',
    description: 'Share and manage finances with your family safely.',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Send money instantly to anyone, anywhere.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything in one wallet
          </h2>
          <p className="text-lg text-muted-foreground">
            Manage all your financial needs with clarity and control.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
