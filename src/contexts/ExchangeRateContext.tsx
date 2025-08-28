import React, { createContext, useContext, ReactNode } from 'react';
import { useExchangeRates } from '@/hooks/useExchangeRates';

interface ExchangeRateContextType {
  convertFromBase: (amount: number, targetCurrency: string) => number;
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getRate: (fromCurrency: string, toCurrency: string) => number;
  isLoadingRates: boolean;
  lastUpdated: number | undefined;
  ratesError: boolean;
  rates: Record<string, number>;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

interface ExchangeRateProviderProps {
  children: ReactNode;
}

export const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({ children }) => {
  const {
    convertFromBase,
    convert,
    getRate,
    isLoading: isLoadingRates,
    lastUpdated,
    isError: ratesError,
    rates
  } = useExchangeRates('USD');

  console.log('ExchangeRateProvider:', { isLoadingRates, ratesError, rates, lastUpdated });

  const contextValue: ExchangeRateContextType = {
    convertFromBase,
    convert,
    getRate,
    isLoadingRates,
    lastUpdated,
    ratesError,
    rates
  };

  return (
    <ExchangeRateContext.Provider value={contextValue}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRateContext = (): ExchangeRateContextType => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRateContext must be used within an ExchangeRateProvider');
  }
  return context;
};