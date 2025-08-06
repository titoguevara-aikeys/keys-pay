import React, { useState } from 'react';
import { MoreHorizontal, Lock, Unlock, Copy, Settings, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Card as CardType } from '@/hooks/useCards';
import { useToast } from '@/hooks/use-toast';

interface VirtualCardProps {
  card: CardType;
  showNumber?: boolean;
  onToggleStatus?: () => void;
}

export const VirtualCard: React.FC<VirtualCardProps> = ({ 
  card, 
  showNumber = false,
  onToggleStatus 
}) => {
  const { toast } = useToast();

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'credit':
        return 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800';
      case 'debit':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800';
      default:
        return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'frozen':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatCardNumber = (number: string) => {
    if (!showNumber) return '•••• •••• •••• ••••';
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const copyCardNumber = () => {
    navigator.clipboard.writeText(card.card_number);
    toast({
      title: 'Card number copied',
      description: 'Card number has been copied to clipboard.',
    });
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Virtual Card */}
      <div className="relative rounded-xl shadow-lg overflow-hidden">
        {/* Card Image Background */}
        <div 
          className="relative w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/lovable-uploads/eeab292b-99eb-449c-a828-8cf2c55b6ef1.png')`,
            aspectRatio: '1.586/1',
            minHeight: '200px'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Card Content */}
          <div className="relative p-6 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="ml-20">
                <p className="text-white/90 text-sm font-medium uppercase tracking-wider">
                  {card.card_type} Card
                </p>
              </div>
              <Badge 
                className="bg-white/20 text-white border-white/30"
                variant="outline"
              >
                {card.card_status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="ml-4">
                  <p className="text-white/80 text-xs uppercase tracking-wide">Card Number</p>
                  <p className="text-lg font-mono font-medium">
                    {formatCardNumber(card.card_number)}
                  </p>
                </div>
                {showNumber && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCardNumber}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex justify-between items-end">
                <div className="ml-4">
                  <p className="text-white/80 text-xs uppercase tracking-wide">Expires</p>
                  <p className="text-sm font-medium">{getExpiryDate()}</p>
                </div>
                <div className="mr-20">
                  <p className="text-white/80 text-xs uppercase tracking-wide">CVV</p>
                  <p className="text-sm font-medium">{showNumber ? '123' : '•••'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Card Controls</h4>
              <p className="text-sm text-muted-foreground">
                {card.spending_limit ? `$${card.spending_limit} monthly limit` : 'No spending limit'}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Limits
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Button
              variant={card.card_status === 'active' ? 'outline' : 'default'}
              size="sm"
              onClick={onToggleStatus}
              className="flex-1"
            >
              {card.card_status === 'active' ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Freeze Card
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Activate Card
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};