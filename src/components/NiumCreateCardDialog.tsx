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
import { CreditCard, Smartphone, Package, DollarSign } from 'lucide-react';
import { useNiumIssueCard } from '@/hooks/useNiumCards';
import { useToast } from '@/hooks/use-toast';

interface NiumCreateCardDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NiumCreateCardDialog: React.FC<NiumCreateCardDialogProps> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    cardType: 'virtual' as 'virtual' | 'physical',
    cardSubType: 'debit' as 'debit' | 'prepaid',
    cardHolderName: '',
    spendingLimit: 1000,
    dailyLimit: 200,
    currency: 'USD',
  });

  const issueCard = useNiumIssueCard();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.cardHolderName) {
      toast({
        title: 'Validation Error',
        description: 'Cardholder name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await issueCard.mutateAsync({
        customerId: 'demo-customer-' + Date.now(), // In production, this would be the actual customer ID
        ...formData,
      });
      onClose();
      // Reset form
      setFormData({
        cardType: 'virtual',
        cardSubType: 'debit',
        cardHolderName: '',
        spendingLimit: 1000,
        dailyLimit: 200,
        currency: 'USD',
      });
    } catch (error) {
      // Error handled by the hook
    }
  };

  const cardTypeOptions = [
    {
      value: 'virtual',
      label: 'Virtual Card',
      description: 'Instant digital card for online payments',
      icon: Smartphone,
      features: ['Instant issuance', 'Online payments', 'Mobile wallets'],
    },
    {
      value: 'physical',
      label: 'Physical Card',
      description: 'Physical card shipped to your address',
      icon: Package,
      features: ['ATM withdrawals', 'In-store payments', 'Contactless payments'],
    },
  ];

  const cardSubTypeOptions = [
    {
      value: 'debit',
      label: 'Debit Card',
      description: 'Direct access to account balance',
    },
    {
      value: 'prepaid',
      label: 'Prepaid Card',
      description: 'Preloaded with specific amount',
    },
  ];

  const selectedCardType = cardTypeOptions.find(option => option.value === formData.cardType);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create New NIUM Card
          </DialogTitle>
          <DialogDescription>
            Issue a new virtual or physical card through NIUM sandbox
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Type Selection */}
          <div>
            <Label className="text-base font-medium">Card Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {cardTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      formData.cardType === option.value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleInputChange('cardType', option.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-1 text-primary" />
                        <div className="flex-1">
                          <h3 className="font-medium">{option.label}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Card Sub Type */}
          <div>
            <Label htmlFor="cardSubType" className="text-base font-medium">
              Card Sub Type
            </Label>
            <Select
              value={formData.cardSubType}
              onValueChange={(value) => handleInputChange('cardSubType', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select card sub type" />
              </SelectTrigger>
              <SelectContent>
                {cardSubTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cardholder Name */}
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

          {/* Spending Limits */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Spending Limits</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spendingLimit">Monthly Limit</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="spendingLimit"
                    type="number"
                    placeholder="1000"
                    value={formData.spendingLimit}
                    onChange={(e) => handleInputChange('spendingLimit', parseFloat(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dailyLimit">Daily Limit</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dailyLimit"
                    type="number"
                    placeholder="200"
                    value={formData.dailyLimit}
                    onChange={(e) => handleInputChange('dailyLimit', parseFloat(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency" className="text-base font-medium">
              Currency
            </Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="AED">AED - UAE Dirham</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          {selectedCardType && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <selectedCardType.icon className="h-4 w-4" />
                  Card Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{formData.cardType} {formData.cardSubType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cardholder:</span>
                    <span className="font-medium">{formData.cardHolderName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Limit:</span>
                    <span className="font-medium">{formData.currency} ${formData.spendingLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Limit:</span>
                    <span className="font-medium">{formData.currency} ${formData.dailyLimit}</span>
                  </div>
                  {formData.cardType === 'physical' && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                      Physical cards will be shipped to your registered address and may take 5-7 business days to arrive.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={issueCard.isPending || !formData.cardHolderName}
          >
            {issueCard.isPending ? 'Creating...' : 'Create Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};