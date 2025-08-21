import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Settings,
  Package,
  Smartphone,
  Copy,
  CheckCircle
} from 'lucide-react';
import type { NiumCard } from '@/lib/nium/cards-api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface NiumVirtualCardProps {
  card: NiumCard;
  showNumber?: boolean;
  onToggleStatus?: () => void;
  onSettings?: () => void;
}

export const NiumVirtualCard: React.FC<NiumVirtualCardProps> = ({
  card,
  showNumber = false,
  onToggleStatus,
  onSettings
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'blocked':
        return 'bg-red-500';
      case 'expired':
        return 'bg-gray-500';
      case 'issued':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'blocked':
        return 'destructive';
      case 'expired':
        return 'secondary';
      case 'issued':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const maskCardNumber = (number: string) => {
    if (showNumber) return number;
    return number.replace(/\d(?=\d{4})/g, '*');
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardContent className="p-6">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {card.cardType === 'virtual' ? (
              <Smartphone className="h-5 w-5" />
            ) : (
              <Package className="h-5 w-5" />
            )}
            <span className="text-sm font-medium capitalize">{card.cardType} Card</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(card.status)}`} />
            <Badge variant={getStatusVariant(card.status)} className="text-xs">
              {card.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-mono tracking-wider">
              {formatCardNumber(maskCardNumber(card.cardNumber))}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:text-gray-300"
              onClick={() => handleCopy(card.cardNumber, 'Card number')}
            >
              {copied === 'Card number' ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Card Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Cardholder</p>
            <p className="text-sm font-medium">{card.cardHolderName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Expires</p>
            <p className="text-sm font-medium">{card.expiryMonth}/{card.expiryYear}</p>
          </div>
        </div>

        {/* Balance and Limits */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Available Balance</span>
            <span className="text-lg font-bold">${card.balance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Spending Limit</span>
            <span className="text-sm">${card.spendingLimit.toLocaleString()}</span>
          </div>
        </div>

        {/* Physical Card Status */}
        {card.cardType === 'physical' && card.physicalCardStatus && (
          <div className="mb-4 p-2 bg-black/20 rounded">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Card Status</span>
              <Badge variant="outline" className="text-xs">
                {card.physicalCardStatus.toUpperCase()}
              </Badge>
            </div>
            {card.trackingNumber && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">Tracking</span>
                <span className="text-xs font-mono">{card.trackingNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Activation URL for new cards */}
        {card.status === 'issued' && card.activationUrl && (
          <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p className="text-xs text-yellow-400 mb-1">Activation Required</p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-yellow-400 hover:text-yellow-300"
              onClick={() => window.open(card.activationUrl, '_blank')}
            >
              Activate Card
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {onToggleStatus && (
            <Button
              variant={card.status === 'active' ? 'destructive' : 'default'}
              size="sm"
              className="flex-1"
              onClick={onToggleStatus}
            >
              {card.status === 'active' ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Block
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3 mr-1" />
                  Unblock
                </>
              )}
            </Button>
          )}
          
          {onSettings && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={onSettings}
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          )}
        </div>

        {/* NIUM Branding */}
        <div className="absolute top-4 right-4 opacity-30">
          <CreditCard className="h-8 w-8" />
        </div>
        
        <div className="absolute bottom-2 right-4">
          <span className="text-xs text-gray-400">Powered by NIUM</span>
        </div>
      </CardContent>
    </Card>
  );
};