/*
 * AIKEYS FINANCIAL PLATFORM - QUICK TRANSFER DIALOG
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Clock, Users, Zap, Check, Phone, Mail, 
  DollarSign, User
} from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransferMoney } from '@/hooks/useTransfer';
import { useToast } from '@/hooks/use-toast';

interface QuickTransferDialogProps {
  open: boolean;
  onClose: () => void;
}

interface QuickContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  lastTransfer?: string;
  isFrequent: boolean;
}

// Mock recent contacts
const recentContacts: QuickContact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    avatar: '',
    lastTransfer: '$50.00',
    isFrequent: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    phone: '+1 (555) 234-5678',
    avatar: '',
    lastTransfer: '$25.00',
    isFrequent: true
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    avatar: '',
    lastTransfer: '$100.00',
    isFrequent: false
  },
  {
    id: '4',
    name: 'David Brown',
    phone: '+1 (555) 345-6789',
    avatar: '',
    lastTransfer: '$75.00',
    isFrequent: false
  },
];

const quickAmounts = [10, 25, 50, 100, 200, 500];

export const QuickTransferDialog: React.FC<QuickTransferDialogProps> = ({ open, onClose }) => {
  const { data: accounts } = useAccounts();
  const transferMoney = useTransferMoney();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'contacts' | 'amount' | 'confirm' | 'success'>('contacts');
  const [selectedContact, setSelectedContact] = useState<QuickContact | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setStep('contacts');
    setSelectedContact(null);
    setCustomAmount('');
    setSelectedAmount(null);
    setMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleContactSelect = (contact: QuickContact) => {
    setSelectedContact(contact);
    setStep('amount');
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
    setStep('confirm');
  };

  const handleCustomAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      setSelectedAmount(parseFloat(customAmount));
      setStep('confirm');
    }
  };

  const handleTransfer = async () => {
    // Mock quick transfer implementation
    setStep('success');
    toast({
      title: 'Transfer sent!',
      description: `$${selectedAmount} sent to ${selectedContact?.name}`,
    });
  };

  const primaryAccount = accounts?.[0]; // Use first account as default
  const transferAmount = selectedAmount || 0;

  if (step === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Transfer Sent!</h3>
              <p className="text-muted-foreground mt-2">
                ${selectedAmount} sent to {selectedContact?.name}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p>They'll receive a notification and can accept the transfer instantly.</p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {step === 'contacts' && 'Quick Transfer'}
            {step === 'amount' && `Send to ${selectedContact?.name}`}
            {step === 'confirm' && 'Confirm Transfer'}
          </DialogTitle>
          <DialogDescription>
            {step === 'contacts' && 'Send money to your contacts instantly'}
            {step === 'amount' && 'How much would you like to send?'}
            {step === 'confirm' && 'Review your transfer details'}
          </DialogDescription>
        </DialogHeader>

        {step === 'contacts' && (
          <div className="space-y-6">
            {/* Frequent Contacts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label>Frequent Contacts</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentContacts.filter(contact => contact.isFrequent).map((contact) => (
                  <div
                    key={contact.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Last: {contact.lastTransfer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Contacts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label>Recent</Label>
              </div>
              <div className="space-y-2">
                {recentContacts.filter(contact => !contact.isFrequent).map((contact) => (
                  <div
                    key={contact.id}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {contact.email ? (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Last</p>
                        <p className="font-medium text-sm">{contact.lastTransfer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Contact */}
            <Button variant="outline" className="w-full">
              <User className="h-4 w-4 mr-2" />
              Send to New Contact
            </Button>
          </div>
        )}

        {step === 'amount' && selectedContact && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback>
                  {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedContact.email || selectedContact.phone}
                </p>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-3">
              <Label>Quick Amounts</Label>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-16 flex-col gap-1"
                    onClick={() => handleAmountSelect(amount)}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${amount}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-3">
              <Label htmlFor="customAmount">Custom Amount</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-8"
                    step="0.01"
                  />
                </div>
                <Button 
                  onClick={handleCustomAmount}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Account Balance Info */}
            {primaryAccount && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-blue-600">
                  Available balance: ${primaryAccount.balance.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && selectedContact && (
          <div className="space-y-6">
            {/* Transfer Summary */}
            <div className="border rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">${transferAmount}</div>
                <p className="text-muted-foreground">Transfer Amount</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-muted-foreground">{primaryAccount?.account_number}</p>
                </div>
                
                <Send className="h-5 w-5 text-muted-foreground" />
                
                <div className="flex-1 text-center">
                  <Avatar className="w-10 h-10 mx-auto mb-2">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>
                      {selectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.email || selectedContact.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Transfer Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time</span>
                <span className="font-medium">Instant</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Security</span>
                <Badge variant="default" className="text-xs">
                  Encrypted
                </Badge>
              </div>
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Input
                id="message"
                placeholder="What's this for?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          {step === 'contacts' ? (
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          ) : step === 'amount' ? (
            <>
              <Button variant="outline" onClick={() => setStep('contacts')} className="flex-1">
                Back
              </Button>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleTransfer} 
                disabled={transferMoney.isPending}
                className="flex-1"
              >
                {transferMoney.isPending ? 'Sending...' : `Send $${transferAmount}`}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};