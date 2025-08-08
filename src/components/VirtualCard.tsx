import React, { useState } from 'react';
import { MoreHorizontal, Lock, Unlock, Copy, Settings, Trash, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import silverCardBg from '@/assets/silver-card-bg.png';
import goldCardBg from '@/assets/gold-card-bg.png';
import platinumCardBg from '@/assets/platinum-card-bg-clean.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Card as CardType } from '@/hooks/useCards';
import { useToast } from '@/hooks/use-toast';
import { PhysicalCardOrder } from '@/components/PhysicalCardOrder';

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
  const [showPhysicalCardOrder, setShowPhysicalCardOrder] = useState(false);

  const getCardGradient = (type: string, membershipTier?: string) => {
    // Membership-based card colors - all cards now use the full card background approach
    if (membershipTier) {
      // Return transparent since we're using background images
      return 'bg-transparent';
    }
    
    // Default card type colors for regular members (Keys Pay blue) - also transparent for consistency
    return 'bg-transparent';
  };

  const getMembershipTier = (type: string) => {
    // Extract membership tier from card type if it contains tier info
    if (type.includes('platinum')) return 'platinum';
    if (type.includes('gold')) return 'gold';
    if (type.includes('silver')) return 'silver';
    return null;
  };

  const getCardDisplayName = (type: string) => {
    const tier = getMembershipTier(type);
    if (tier) {
      return `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${type.includes('credit') ? 'Credit' : 'Debit'} Card`;
    }
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Card`;
  };

  const getCardBackground = (type: string) => {
    const tier = getMembershipTier(type);
    switch (tier) {
      case 'platinum':
        return platinumCardBg; // Elegant platinum design
      case 'gold':
        return goldCardBg;
      case 'silver':
        return silverCardBg;
      default:
        return '/lovable-uploads/eeab292b-99eb-449c-a828-8cf2c55b6ef1.png'; // Keys Pay blue card
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

  const getTierBadgeStyle = (tier: string | null) => {
    switch (tier) {
      case 'silver':
        return 'bg-gray-300/30 border-gray-300/50';
      case 'gold':
        return 'bg-yellow-400/30 border-yellow-400/50';
      case 'platinum':
        return 'bg-gray-100/30 border-gray-100/50';
      default:
        return 'bg-white/20';
    }
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
            backgroundImage: `url('${getCardBackground(card.card_type)}')`,
            aspectRatio: '1.586/1',
            minHeight: '200px'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Card Content */}
          <div className="relative p-6 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <img src="/lovable-uploads/ad78c06f-06c1-4a99-b7fc-aefe5def66cc.png" alt="Keys Logo" className="h-12 w-12 ml-4 mr-8 -mt-2" />
                 <div>
                   <p className="text-white/90 text-sm font-medium uppercase tracking-wider">
                     {getCardDisplayName(card.card_type)}
                   </p>
                   {getMembershipTier(card.card_type) && (
                     <p className="text-white/70 text-xs uppercase tracking-wide">
                       {getMembershipTier(card.card_type)} Member
                     </p>
                   )}
                 </div>
              </div>
              <Badge 
                className={`text-white border-white/30 ${getMembershipTier(card.card_type) ? getTierBadgeStyle(getMembershipTier(card.card_type)) : 'bg-white/20'}`}
                variant="outline"
              >
                {card.card_status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mt-2">
                <div className="ml-4">
                  <p className="text-white/80 text-xs uppercase tracking-wide mt-1">Card Number</p>
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
                <div className="mr-32">
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
                <DropdownMenuItem onClick={() => setShowPhysicalCardOrder(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Order Physical Card
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

      {/* Physical Card Order Dialog */}
      <PhysicalCardOrder
        open={showPhysicalCardOrder}
        onClose={() => setShowPhysicalCardOrder(false)}
        virtualCard={{
          id: card.id,
          card_type: card.card_type,
          card_number: card.card_number
        }}
      />
    </div>
  );
};