import React, { useState } from 'react';
import { Package, Truck, Clock, CreditCard, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import physicalCardsImage from '@/assets/physical-cards.png';

interface PhysicalCardOrderProps {
  open: boolean;
  onClose: () => void;
  virtualCard?: {
    id: string;
    card_type: string;
    card_number: string;
  } | null;
}

export const PhysicalCardOrder: React.FC<PhysicalCardOrderProps> = ({
  open,
  onClose,
  virtualCard
}) => {
  // Don't render if no virtual card is provided
  if (!virtualCard) {
    return null;
  }
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '7-10 business days',
      price: 9.99,
      icon: Package
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 24.99,
      icon: Truck
    }
  ];

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast({
        title: 'Incomplete Address',
        description: 'Please fill in all address fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create Stripe checkout session for physical card payment
      const { data, error } = await supabase.functions.invoke('create-physical-card-payment', {
        body: {
          virtualCardId: virtualCard.id,
          deliveryOption,
          deliveryPrice: deliveryOptions.find(opt => opt.id === deliveryOption)?.price,
          address
        }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      if (data?.url) {
        window.open(data.url, '_blank');
        onClose();
        toast({
          title: 'Redirecting to Payment',
          description: 'Complete your payment to process the physical card order.',
        });
      }
    } catch (error: any) {
      console.error('Error creating physical card order:', error);
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to create physical card order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDelivery = deliveryOptions.find(opt => opt.id === deliveryOption);

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Order Physical Card
          </DialogTitle>
          <DialogDescription>
            Get a physical version of your virtual card delivered to your address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card to be Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img 
                  src={physicalCardsImage} 
                  alt="Physical Card Preview" 
                  className="w-24 h-15 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{virtualCard.card_type.replace('_', ' ').toUpperCase()} Card</p>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• {virtualCard.card_number.slice(-4)}</p>
                  <Badge variant="outline" className="mt-1">Physical Version</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Options</CardTitle>
              <CardDescription>Choose your preferred delivery speed</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        deliveryOption === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setDeliveryOption(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="font-medium cursor-pointer">
                          {option.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${option.price}</p>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
              <CardDescription>Where should we send your physical card?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={address.state}
                    onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={address.zipCode}
                    onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={address.country}
                    onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Physical Card Issuance</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span>{selectedDelivery?.name}</span>
                  <span>${selectedDelivery?.price}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(15.00 + (selectedDelivery?.price || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOrder}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ${(15.00 + (selectedDelivery?.price || 0)).toFixed(2)} & Order
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};