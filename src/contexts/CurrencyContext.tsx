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
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
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
  
  // Temporary: Use static rates while we fix the exchange rate integration
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [ratesError, setRatesError] = useState(false);

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
    if (fromCurrency === selectedCurrency.code) {
      return amount;
    }
    
    // For now, return the original amount (1:1 conversion) until we fix exchange rates
    // TODO: Implement live FX conversion
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
    convertAmount,
    isLoadingRates,
    lastUpdated,
    ratesError,
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