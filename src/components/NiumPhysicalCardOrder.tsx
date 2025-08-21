import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, Truck, Clock } from 'lucide-react';
import { useNiumOrderPhysicalCard } from '@/hooks/useNiumCards';
import { useToast } from '@/hooks/use-toast';

interface NiumPhysicalCardOrderProps {
  open: boolean;
  onClose: () => void;
}

export const NiumPhysicalCardOrder: React.FC<NiumPhysicalCardOrderProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  });

  const orderPhysicalCard = useNiumOrderPhysicalCard();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['cardHolderName', 'line1', 'city', 'state', 'postalCode', 'country'];
    const missingFields = [];
    
    if (!formData.cardHolderName) missingFields.push('Cardholder Name');
    if (!formData.shippingAddress.line1) missingFields.push('Address Line 1');
    if (!formData.shippingAddress.city) missingFields.push('City');
    if (!formData.shippingAddress.state) missingFields.push('State');
    if (!formData.shippingAddress.postalCode) missingFields.push('Postal Code');
    if (!formData.shippingAddress.country) missingFields.push('Country');

    if (missingFields.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await orderPhysicalCard.mutateAsync({
        customerId: 'demo-customer-' + Date.now(), // In production, this would be the actual customer ID
        cardHolderName: formData.cardHolderName,
        shippingAddress: formData.shippingAddress,
      });
      onClose();
      // Reset form
      setFormData({
        cardHolderName: '',
        shippingAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
        },
      });
    } catch (error) {
      // Error handled by the hook
    }
  };

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'AE', label: 'United Arab Emirates' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Physical NIUM Card
          </DialogTitle>
          <DialogDescription>
            Order a physical card to be shipped to your address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shipping Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900">Shipping Information</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Physical cards are shipped via express delivery and typically arrive within 5-7 business days.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      5-7 business days
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Express shipping included
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cardholder Information */}
          <div>
            <Label htmlFor="cardHolderName" className="text-base font-medium">
              Cardholder Name
            </Label>
            <Input
              id="cardHolderName"
              placeholder="Enter full name as it should appear on card"
              value={formData.cardHolderName}
              onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
              className="mt-2"
            />
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </Label>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="line1">Address Line 1 *</Label>
                <Input
                  id="line1"
                  placeholder="Street address"
                  value={formData.shippingAddress.line1}
                  onChange={(e) => handleInputChange('shippingAddress.line1', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="line2">Address Line 2</Label>
                <Input
                  id="line2"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.shippingAddress.line2}
                  onChange={(e) => handleInputChange('shippingAddress.line2', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    placeholder="Enter state or province"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange('shippingAddress.state', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="Enter postal code"
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => handleInputChange('shippingAddress.postalCode', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.shippingAddress.country}
                    onValueChange={(value) => handleInputChange('shippingAddress.country', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Type:</span>
                  <span className="font-medium">Physical NIUM Card</span>
                </div>
                <div className="flex justify-between">
                  <span>Cardholder:</span>
                  <span className="font-medium">{formData.cardHolderName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-medium">Free Express Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">5-7 business days</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please ensure your shipping address is correct. 
                Physical cards cannot be re-shipped to a different address once processed. 
                You will receive tracking information via email once your card is shipped.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={orderPhysicalCard.isPending}
          >
            {orderPhysicalCard.isPending ? 'Processing Order...' : 'Order Physical Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};