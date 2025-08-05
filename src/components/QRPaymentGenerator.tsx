import React, { useState } from 'react';
import { QrCode, Download, Share, Copy, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { useQRPayments, useCreateQRPayment } from '@/hooks/usePayments';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

const QRPaymentGenerator = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [expiresHours, setExpiresHours] = useState('24');
  const [isReusable, setIsReusable] = useState(false);
  const [maxUses, setMaxUses] = useState('1');

  const { data: accounts = [] } = useAccounts();
  const { data: qrPayments = [] } = useQRPayments();
  const createQRPayment = useCreateQRPayment();
  const { toast } = useToast();

  const handleCreateQR = async () => {
    if (!selectedAccount) {
      toast({
        title: 'Account Required',
        description: 'Please select an account for the QR payment',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createQRPayment.mutateAsync({
        account_id: selectedAccount,
        amount: amount ? parseFloat(amount) : undefined,
        description,
        expires_hours: parseInt(expiresHours),
        is_reusable: isReusable,
        max_uses: isReusable ? parseInt(maxUses) : 1,
      });

      toast({
        title: 'QR Payment Created!',
        description: 'Your QR payment code has been generated successfully.',
      });

      // Reset form
      setAmount('');
      setDescription('');
      setExpiresHours('24');
      setIsReusable(false);
      setMaxUses('1');
    } catch (error: any) {
      toast({
        title: 'Error Creating QR Payment',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'QR code data copied to clipboard.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generate QR Payment
          </CardTitle>
          <CardDescription>
            Create a QR code for receiving payments from other users
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_type.toUpperCase()} - ${account.balance.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Optional)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this payment for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Expiration */}
            <div className="space-y-2">
              <Label>Expires In</Label>
              <Select value={expiresHours} onValueChange={setExpiresHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="6">6 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="72">3 Days</SelectItem>
                  <SelectItem value="168">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reusable */}
            <div className="space-y-2">
              <Label>Reusable</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isReusable}
                  onCheckedChange={setIsReusable}
                />
                <span className="text-sm text-muted-foreground">
                  Allow multiple uses
                </span>
              </div>
            </div>

            {/* Max Uses */}
            {isReusable && (
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  max="100"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleCreateQR} 
            className="w-full"
            disabled={createQRPayment.isPending || !selectedAccount}
          >
            {createQRPayment.isPending ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing QR Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Your QR Payments</CardTitle>
          <CardDescription>
            Manage your existing QR payment codes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {qrPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No QR payments created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {qrPayments.map((qr) => (
                <div
                  key={qr.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {qr.description || 'Payment Request'}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(qr.status)}`} />
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {qr.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">
                        {qr.amount ? `$${qr.amount.toFixed(2)}` : 'Any amount'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uses:</span>
                      <p className="font-medium">
                        {qr.current_uses} / {qr.max_uses}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <p className="font-medium">
                        {qr.expires_at 
                          ? formatDistance(new Date(qr.expires_at), new Date(), { addSuffix: true })
                          : 'Never'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">
                        {formatDistance(new Date(qr.created_at), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(qr.qr_code)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRPaymentGenerator;
