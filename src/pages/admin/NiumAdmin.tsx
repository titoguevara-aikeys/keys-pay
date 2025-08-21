import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface HealthStatus {
  ok: boolean;
  env: string;
  baseUrl: string;
  requestId: string;
  timestamp: string;
}

interface BeneficiaryForm {
  customerHashId: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  bankCode: string;
  countryCode: string;
}

interface QuoteForm {
  customerHashId: string;
  walletHashId: string;
  sourceCurrency: string;
  destinationCurrency: string;
  amount: string;
}

interface PayoutForm {
  customerHashId: string;
  walletHashId: string;
  auditId: string;
  amount: string;
  currency: string;
  beneficiaryId: string;
}

export default function NiumAdminPage() {
  const { toast } = useToast();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [beneficiaryForm, setBeneficiaryForm] = useState<BeneficiaryForm>({
    customerHashId: '',
    firstName: '',
    lastName: '',
    accountNumber: '',
    bankCode: '',
    countryCode: 'AE'
  });
  
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({
    customerHashId: '',
    walletHashId: '',
    sourceCurrency: 'AED',
    destinationCurrency: 'USD',
    amount: '100'
  });
  
  const [payoutForm, setPayoutForm] = useState<PayoutForm>({
    customerHashId: '',
    walletHashId: '',
    auditId: '',
    amount: '100',
    currency: 'USD',
    beneficiaryId: ''
  });

  const [results, setResults] = useState<any>({});

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      // Try actual API first, fallback to mock
      let response;
      try {
        response = await fetch('/api/nium/health');
      } catch {
        // Fallback to mock API for development
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        const data = await mockApi.health();
        setHealth(data);
        
        if (data.ok) {
          toast({
            title: 'NIUM Health Check (Mock)',
            description: `Environment: ${data.env} - Mock API connected`
          });
        }
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setHealth(data);
      
      if (data.ok) {
        toast({
          title: 'NIUM Health Check',
          description: `Environment: ${data.env} - Connected successfully`
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: 'Health Check Failed',
        description: 'Could not connect to NIUM service',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createBeneficiary = async () => {
    if (!beneficiaryForm.customerHashId || !beneficiaryForm.firstName || !beneficiaryForm.lastName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let response, data;
      try {
        response = await fetch('/api/nium/beneficiaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerHashId: beneficiaryForm.customerHashId,
            beneficiaryDetail: {
              firstName: beneficiaryForm.firstName,
              lastName: beneficiaryForm.lastName
            },
            payoutDetail: {
              beneficiaryAccountNumber: beneficiaryForm.accountNumber,
              beneficiaryBankCode: beneficiaryForm.bankCode,
              beneficiaryCountryCode: beneficiaryForm.countryCode
            }
          })
        });
        data = await response.json();
      } catch {
        // Fallback to mock API
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        data = await mockApi.createBeneficiary({
          customerHashId: beneficiaryForm.customerHashId,
          beneficiaryDetail: {
            firstName: beneficiaryForm.firstName,
            lastName: beneficiaryForm.lastName
          },
          payoutDetail: {
            beneficiaryAccountNumber: beneficiaryForm.accountNumber,
            beneficiaryBankCode: beneficiaryForm.bankCode,
            beneficiaryCountryCode: beneficiaryForm.countryCode
          }
        });
      }
      
      setResults(prev => ({ ...prev, beneficiary: data }));
      
      if (data.ok) {
        toast({
          title: 'Beneficiary Created',
          description: `Beneficiary ID: ${data.beneficiaryId}`
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Beneficiary Creation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFxQuote = async () => {
    if (!quoteForm.customerHashId || !quoteForm.walletHashId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in customer and wallet hash IDs',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let data;
      try {
        const params = new URLSearchParams({
          customerHashId: quoteForm.customerHashId,
          walletHashId: quoteForm.walletHashId,
          sourceCurrency: quoteForm.sourceCurrency,
          destinationCurrency: quoteForm.destinationCurrency,
          ...(quoteForm.amount && { amount: quoteForm.amount })
        });
        
        const response = await fetch(`/api/nium/payouts/quote?${params}`);
        data = await response.json();
      } catch {
        // Fallback to mock API
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        data = await mockApi.getQuote({
          customerHashId: quoteForm.customerHashId,
          walletHashId: quoteForm.walletHashId,
          sourceCurrency: quoteForm.sourceCurrency,
          destinationCurrency: quoteForm.destinationCurrency,
          amount: quoteForm.amount
        });
      }
      
      setResults(prev => ({ ...prev, quote: data }));
      
      if (data.ok) {
        setPayoutForm(prev => ({ ...prev, auditId: data.auditId }));
        toast({
          title: 'FX Quote Generated',
          description: `Rate: ${data.rate}, Audit ID: ${data.auditId}`
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Quote Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestPayout = async () => {
    if (!payoutForm.auditId || !payoutForm.customerHashId || !payoutForm.walletHashId) {
      toast({
        title: 'Validation Error',
        description: 'Please generate a quote first and fill in required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let data;
      try {
        const response = await fetch('/api/nium/payouts/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerHashId: payoutForm.customerHashId,
            walletHashId: payoutForm.walletHashId,
            auditId: payoutForm.auditId,
            amount: Number(payoutForm.amount),
            currency: payoutForm.currency,
            beneficiaryId: payoutForm.beneficiaryId || undefined
          })
        });
        data = await response.json();
      } catch {
        // Fallback to mock API
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        data = await mockApi.executeTransfer({
          customerHashId: payoutForm.customerHashId,
          walletHashId: payoutForm.walletHashId,
          auditId: payoutForm.auditId,
          amount: Number(payoutForm.amount),
          currency: payoutForm.currency,
          beneficiaryId: payoutForm.beneficiaryId
        });
      }
      
      setResults(prev => ({ ...prev, payout: data }));
      
      if (data.ok) {
        toast({
          title: 'Payout Initiated',
          description: `Reference: ${data.systemReferenceNumber}`
        });
        
        // Auto-poll status after 2 seconds
        setTimeout(() => pollPayoutStatus(data.systemReferenceNumber), 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Payout Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const pollPayoutStatus = async (systemReferenceNumber: string) => {
    try {
      let data;
      try {
        const params = new URLSearchParams({
          customerHashId: payoutForm.customerHashId,
          walletHashId: payoutForm.walletHashId,
          systemReferenceNumber
        });
        
        const response = await fetch(`/api/nium/payouts/status?${params}`);
        data = await response.json();
      } catch {
        // Fallback to mock API
        const { MockNiumAPI } = await import('@/lib/nium/mock-api');
        const mockApi = new MockNiumAPI();
        data = await mockApi.getStatus({
          customerHashId: payoutForm.customerHashId,
          walletHashId: payoutForm.walletHashId,
          systemReferenceNumber
        });
      }
      
      setResults(prev => ({ ...prev, status: data }));
      
      if (data.ok) {
        toast({
          title: 'Payout Status',
          description: `Status: ${data.status}`
        });
      }
    } catch (error) {
      console.error('Status poll failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: text
    });
  };

  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/nium/webhook`
    : '/api/nium/webhook';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/providers">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Providers
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">NIUM Provider Admin</h1>
              <p className="text-muted-foreground">Manage NIUM sandbox integration</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={health?.ok ? 'default' : 'destructive'}>
              {health?.env || 'Unknown'} Environment
            </Badge>
            <Button onClick={checkHealth} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {health?.ok ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {health ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Environment: <Badge>{health.env}</Badge></div>
                <div>Base URL: {health.baseUrl}</div>
                <div>Last Check: {new Date(health.timestamp).toLocaleString()}</div>
                <div>Request ID: {health.requestId}</div>
              </div>
            ) : (
              <p className="text-muted-foreground">No health data available</p>
            )}
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Register this URL in your NIUM dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm">{webhookUrl}</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(webhookUrl)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Beneficiary */}
        <Card>
          <CardHeader>
            <CardTitle>Create Beneficiary (Sandbox)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerHashId">Customer Hash ID</Label>
                <Input
                  id="customerHashId"
                  value={beneficiaryForm.customerHashId}
                  onChange={(e) => setBeneficiaryForm(prev => ({ ...prev, customerHashId: e.target.value }))}
                  placeholder="UUID"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={beneficiaryForm.firstName}
                  onChange={(e) => setBeneficiaryForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={beneficiaryForm.lastName}
                  onChange={(e) => setBeneficiaryForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={beneficiaryForm.accountNumber}
                  onChange={(e) => setBeneficiaryForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={createBeneficiary} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Beneficiary
            </Button>
            {results.beneficiary && (
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.beneficiary, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Get FX Quote */}
        <Card>
          <CardHeader>
            <CardTitle>Get FX Quote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quoteCustomerHashId">Customer Hash ID</Label>
                <Input
                  id="quoteCustomerHashId"
                  value={quoteForm.customerHashId}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, customerHashId: e.target.value }))}
                  placeholder="UUID"
                />
              </div>
              <div>
                <Label htmlFor="walletHashId">Wallet Hash ID</Label>
                <Input
                  id="walletHashId"
                  value={quoteForm.walletHashId}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, walletHashId: e.target.value }))}
                  placeholder="UUID"
                />
              </div>
            </div>
            <Button onClick={getFxQuote} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Get FX Quote
            </Button>
            {results.quote && (
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.quote, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Send Test Payout */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Payout (Small Amount)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="auditId">Audit ID (from quote)</Label>
                <Input
                  id="auditId"
                  value={payoutForm.auditId}
                  onChange={(e) => setPayoutForm(prev => ({ ...prev, auditId: e.target.value }))}
                  placeholder="Generated from quote"
                />
              </div>
              <div>
                <Label htmlFor="beneficiaryId">Beneficiary ID</Label>
                <Input
                  id="beneficiaryId"
                  value={payoutForm.beneficiaryId}
                  onChange={(e) => setPayoutForm(prev => ({ ...prev, beneficiaryId: e.target.value }))}
                  placeholder="From beneficiary creation"
                />
              </div>
            </div>
            <Button onClick={sendTestPayout} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Test Payout
            </Button>
            {results.payout && (
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.payout, null, 2)}
              </pre>
            )}
            {results.status && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Status Updates:</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results.status, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}