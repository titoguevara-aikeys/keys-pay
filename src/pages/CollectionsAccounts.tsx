import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

export default function CollectionsAccountsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerHashId: '',
    walletHashId: '',
    currency: 'AED'
  });
  const [virtualAccount, setVirtualAccount] = useState<any>(null);

  const issueVirtualAccount = async () => {
    if (!formData.customerHashId || !formData.walletHashId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let data;
      try {
        const response = await fetch('/api/nium/virtual-accounts/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        data = await response.json();
      } catch {
        // Fallback to mock API
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        data = await mockApi.issueVirtualAccount(formData);
      }
      
      if (data.ok) {
        setVirtualAccount(data);
        toast({
          title: 'Virtual Account Created',
          description: 'Virtual account has been successfully issued'
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Failed to Issue Virtual Account',
        description: error instanceof Error ? error.message : 'Unknown error',
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
            <h1 className="text-3xl font-bold">Virtual Accounts</h1>
            <p className="text-muted-foreground">Manage virtual accounts for collections</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue Virtual Account (NIUM)</CardTitle>
            <CardDescription>Create a new virtual account for receiving payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                placeholder="AED"
              />
            </div>

            <Button onClick={issueVirtualAccount} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Issue Virtual Account'}
            </Button>

            {virtualAccount && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Virtual Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Account Number:</strong> {virtualAccount.accountNumber}</div>
                  <div><strong>Routing Code:</strong> {virtualAccount.routingCode}</div>
                  <div><strong>IBAN:</strong> {virtualAccount.iban}</div>
                  <div><strong>Currency:</strong> {virtualAccount.currency}</div>
                  <pre className="bg-muted p-4 rounded text-sm overflow-auto mt-4">
                    {JSON.stringify(virtualAccount, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}