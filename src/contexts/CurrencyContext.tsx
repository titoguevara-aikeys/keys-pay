import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useExchangeRateContext } from './ExchangeRateContext';

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
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ق.ر', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', flag: '🇴🇲' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatAmount: (amount: number, showSymbol?: boolean, fromCurrency?: string) => string;
  getCurrencySymbol: () => string;
  getSupportedCurrencies: () => Currency[];
  convertAmount: (amount: number, fromCurrency: string) => number;
  isLoadingRates: boolean;
  lastUpdated: number | undefined;
  ratesError: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'keys-pay-currency-preference';

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(SUPPORTED_CURRENCIES[0]); // Default to USD
  
  // Get exchange rate context (this will be undefined if not wrapped in ExchangeRateProvider)
  let exchangeRateContext;
  try {
    exchangeRateContext = useExchangeRateContext();
  } catch {
    // If not wrapped in ExchangeRateProvider, use fallback values
    exchangeRateContext = null;
  }

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

  const convertAmount = (amount: number, fromCurrency: string = 'USD'): number => {
    console.log('Converting:', { amount, fromCurrency, selectedCurrency: selectedCurrency.code, exchangeRateContext });
    
    if (fromCurrency === selectedCurrency.code) {
      return amount;
    }
    
    // Use live exchange rates if available
    if (exchangeRateContext && exchangeRateContext.convert) {
      const converted = exchangeRateContext.convert(amount, fromCurrency, selectedCurrency.code);
      console.log('Converted result:', { original: amount, converted, fromCurrency, toCurrency: selectedCurrency.code });
      return converted;
    }
    
    console.log('No exchange rate context available, returning original amount');
    // Fallback: return original amount
    return amount;
  };

  const formatAmount = (amount: number, showSymbol: boolean = true, fromCurrency: string = 'USD'): string => {
    // Convert amount to selected currency if needed
    const convertedAmount = convertAmount(amount, fromCurrency);
    
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(convertedAmount));

    if (!showSymbol) {
      return formattedNumber;
    }

    // Handle negative amounts
    const prefix = convertedAmount < 0 ? '-' : '';
    const sym = selectedCurrency.symbol;
    const needsSpace = /^[A-Z]{2,4}$/.test(sym);
    const displaySymbol = needsSpace ? `${sym} ` : sym;
    return `${prefix}${displaySymbol}${formattedNumber}`;
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
    convertAmount,
    isLoadingRates: exchangeRateContext?.isLoadingRates || false,
    lastUpdated: exchangeRateContext?.lastUpdated,
    ratesError: exchangeRateContext?.ratesError || false,
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