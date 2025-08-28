import { useQuery } from '@tanstack/react-query';
import { fetchExchangeRates, convertCurrency, type ExchangeRateResponse } from '@/lib/currency/exchangeRates';
import { SUPPORTED_CURRENCIES } from '@/contexts/CurrencyContext';

/**
 * Hook to fetch and manage live exchange rates
 */
export const useExchangeRates = (baseCurrency: string = 'USD') => {
  const targetCurrencies = SUPPORTED_CURRENCIES
    .map(currency => currency.code)
    .filter(code => code !== baseCurrency);

  const {
    data: ratesData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['exchange-rates', baseCurrency],
    queryFn: () => fetchExchangeRates(baseCurrency, targetCurrencies),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /**
   * Convert amount from base currency to target currency
   */
  const convertFromBase = (amount: number, targetCurrency: string): number => {
    if (!ratesData?.rates) return amount;
    return convertCurrency(amount, baseCurrency, targetCurrency, ratesData.rates);
  };

  /**
   * Convert amount from any currency to any other currency
   */
  const convert = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    console.log('Exchange rate convert called:', { amount, fromCurrency, toCurrency, rates: ratesData?.rates });
    
    if (!ratesData?.rates) {
      console.log('No rates data available');
      return amount;
    }
    if (fromCurrency === toCurrency) return amount;
    
    // If converting from USD to another currency
    if (fromCurrency === baseCurrency) {
      const rate = ratesData.rates[toCurrency] || 1;
      console.log('USD to currency:', { rate, result: amount * rate });
      return amount * rate;
    }
    
    // If converting to USD from another currency  
    if (toCurrency === baseCurrency) {
      const rate = ratesData.rates[fromCurrency] || 1;
      console.log('Currency to USD:', { rate, result: amount / rate });
      return amount / rate;
    }
    
    // Cross-currency conversion: from -> USD -> to
    const fromRate = ratesData.rates[fromCurrency] || 1;
    const toRate = ratesData.rates[toCurrency] || 1;
    const usdAmount = amount / fromRate; // Convert to USD first
    const result = usdAmount * toRate; // Then convert to target currency
    console.log('Cross-currency:', { fromRate, toRate, usdAmount, result });
    return result;
  };

  /**
   * Get exchange rate between two currencies
   */
  const getRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;
    if (!ratesData?.rates) return 1;
    
    return ratesData.rates[toCurrency] || 1;
  };

  return {
    rates: ratesData?.rates || {},
    isLoading,
    isError,
    error,
    lastUpdated: ratesData?.timestamp,
    baseCurrency,
    convertFromBase,
    convert,
    getRate,
    refetch,
    success: ratesData?.success || false,
  };
};

/**
 * Hook for converting a specific amount with live rates
 */
export const useCurrencyConversion = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
) => {
  const { convert, isLoading, isError } = useExchangeRates();

  const convertedAmount = convert(amount, fromCurrency, toCurrency);

  return {
    convertedAmount,
    isLoading,
    isError,
    originalAmount: amount,
    fromCurrency,
    toCurrency,
  };
};