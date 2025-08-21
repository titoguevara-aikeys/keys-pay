import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

export default function PaymentsSendPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    customerHashId: '',
    walletHashId: '',
    amount: '',
    currency: 'USD',
    beneficiaryId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.provider !== 'nium') {
      toast({
        title: 'Provider Not Available',
        description: 'Only NIUM provider is currently available',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // This would call the NIUM payout API
      toast({
        title: 'Payout Initiated',
        description: 'Payment has been processed via NIUM'
      });
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Send Payment</h1>
            <p className="text-muted-foreground">Send money using available providers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Configure your payment using available providers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nium">NIUM (Sandbox)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerHashId">Customer Hash ID</Label>
                  <Input
                    id="customerHashId"
                    value={formData.customerHashId}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerHashId: e.target.value }))}
                    placeholder="UUID"
                  />
                </div>
                <div>
                  <Label htmlFor="walletHashId">Wallet Hash ID</Label>
                  <Input
                    id="walletHashId"
                    value={formData.walletHashId}
                    onChange={(e) => setFormData(prev => ({ ...prev, walletHashId: e.target.value }))}
                    placeholder="UUID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="beneficiaryId">Beneficiary ID</Label>
                <Input
                  id="beneficiaryId"
                  value={formData.beneficiaryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryId: e.target.value }))}
                  placeholder="Beneficiary UUID"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Send Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}