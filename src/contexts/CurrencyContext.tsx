import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatAmount: (amount: number, showSymbol?: boolean) => string;
  getCurrencySymbol: () => string;
  getSupportedCurrencies: () => Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'keys-pay-currency-preference';

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(SUPPORTED_CURRENCIES[0]); // Default to USD

  // Load saved currency preference on mount
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem(STORAGE_KEY);
    if (savedCurrencyCode) {
      const currency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrencyCode);
      if (currency) {
        setSelectedCurrencyState(currency);
      }
    }
  }, []);

  const setSelectedCurrency = (currency: Currency) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem(STORAGE_KEY, currency.code);
  };

  const formatAmount = (amount: number, showSymbol: boolean = true): string => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    if (!showSymbol) {
      return formattedNumber;
    }

    // Handle negative amounts
    const prefix = amount < 0 ? '-' : '';
    return `${prefix}${selectedCurrency.symbol}${formattedNumber}`;
  };

  const getCurrencySymbol = (): string => {
    return selectedCurrency.symbol;
  };

  const getSupportedCurrencies = (): Currency[] => {
    return SUPPORTED_CURRENCIES;
  };

  const contextValue: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    formatAmount,
    getCurrencySymbol,
    getSupportedCurrencies,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};