import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Globe } from 'lucide-react';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  className = "", 
  showLabel = true 
}) => {
  const { selectedCurrency, setSelectedCurrency, getSupportedCurrencies } = useCurrency();
  const supportedCurrencies = getSupportedCurrencies();

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Currency:</span>
        </div>
      )}
      <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-auto min-w-[120px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{selectedCurrency.flag}</span>
              <span className="font-medium">{selectedCurrency.code}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span>{currency.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-xs text-muted-foreground">{currency.name}</span>
                </div>
                <span className="text-muted-foreground ml-auto">{currency.symbol}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;