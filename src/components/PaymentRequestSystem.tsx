import React, { useState } from 'react';
import { Send, DollarSign, Users, Clock, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePaymentRequests, useCreatePaymentRequest, useRespondToPaymentRequest } from '@/hooks/useSocial';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

const PaymentRequestSystem = () => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expiresHours, setExpiresHours] = useState('72');

  const { data: paymentRequests = [] } = usePaymentRequests();
  const { data: accounts = [] } = useAccounts();
  const createPaymentRequest = useCreatePaymentRequest();
  const respondToPaymentRequest = useRespondToPaymentRequest();
  const { toast } = useToast();

  const handleCreateRequest = async () => {
    if (!toEmail || !amount) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please enter recipient email and amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPaymentRequest.mutateAsync({
        to_email: toEmail,
        amount: parseFloat(amount),
        description,
        expires_hours: parseInt(expiresHours),
      });

      toast({
        title: 'Payment Request Sent!',
        description: `Request for $${amount} sent to ${toEmail}`,
      });

      // Reset form
      setToEmail('');
      setAmount('');
      setDescription('');
      setExpiresHours('72');
      setShowRequestDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error Sending Request',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePayRequest = async (requestId: string, fromAccount: string, toAccount: string) => {
    try {
      await respondToPaymentRequest.mutateAsync({
        requestId,
        action: 'pay',
        paymentData: {
          fromAccountId: fromAccount,
          toAccountId: toAccount,
        },
      });

      toast({
        title: 'Payment Sent!',
        description: 'Payment has been sent successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await respondToPaymentRequest.mutateAsync({
        requestId,
        action: 'cancel',
      });

      toast({
        title: 'Request Declined',
        description: 'Payment request has been declined.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'expired':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isExpired = (expiresAt: string | null) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  // Separate sent and received requests
  const sentRequests = paymentRequests.filter(req => req.from_user_id);
  const receivedRequests = paymentRequests.filter(req => req.to_user_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Requests</h2>
          <p className="text-muted-foreground">
            Request and send payments to friends and family
          </p>
        </div>
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Request Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Request Payment</DialogTitle>
              <DialogDescription>
                Send a payment request to someone
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toEmail">Recipient Email *</Label>
                <Input
                  id="toEmail"
                  type="email"
                  placeholder="friend@example.com"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this payment for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires">Expires In</Label>
                <select
                  id="expires"
                  className="w-full p-2 border rounded"
                  value={expiresHours}
                  onChange={(e) => setExpiresHours(e.target.value)}
                >
                  <option value="24">24 Hours</option>
                  <option value="72">3 Days</option>
                  <option value="168">1 Week</option>
                  <option value="720">1 Month</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRequest}
                disabled={createPaymentRequest.isPending}
              >
                {createPaymentRequest.isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Received Requests
            </CardTitle>
            <CardDescription>
              Payment requests you've received from others
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No payment requests received</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Payment Request from User
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`} />
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {request.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-lg font-semibold">
                          ${request.amount.toFixed(2)}
                        </span>
                      </div>
                      {request.description && (
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistance(new Date(request.created_at), new Date(), { 
                            addSuffix: true 
                          })}
                        </span>
                        {request.expires_at && (
                          <span>
                            • Expires {formatDistance(new Date(request.expires_at), new Date(), { 
                              addSuffix: true 
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && !isExpired(request.expires_at) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // In a real app, you'd show account selection
                            const defaultAccount = accounts[0];
                            if (defaultAccount) {
                              handlePayRequest(request.id, defaultAccount.id, 'recipient-account-id');
                            }
                          }}
                          disabled={respondToPaymentRequest.isPending}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Pay
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDeclineRequest(request.id)}
                          disabled={respondToPaymentRequest.isPending}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Sent Requests
            </CardTitle>
            <CardDescription>
              Payment requests you've sent to others
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {sentRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No payment requests sent</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {request.to_email || 'Unknown Recipient'}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`} />
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {request.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-lg font-semibold">
                          ${request.amount.toFixed(2)}
                        </span>
                      </div>
                      {request.description && (
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistance(new Date(request.created_at), new Date(), { 
                            addSuffix: true 
                          })}
                        </span>
                        {request.expires_at && (
                          <span>
                            • Expires {formatDistance(new Date(request.expires_at), new Date(), { 
                              addSuffix: true 
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && !isExpired(request.expires_at) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.id)}
                          disabled={respondToPaymentRequest.isPending}
                        >
                          Cancel Request
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentRequestSystem;