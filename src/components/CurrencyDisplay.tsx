import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  showSymbol?: boolean;
  className?: string;
  fromCurrency?: string;
}

/**
 * A reusable component for displaying currency amounts
 * with proper formatting based on the selected currency
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  amount, 
  showSymbol = true, 
  className = "",
  fromCurrency = "USD"
}) => {
  const { formatAmount } = useCurrency();

  return (
    <span className={className}>
      {formatAmount(amount, showSymbol, fromCurrency)}
    </span>
  );
};

export default CurrencyDisplay;