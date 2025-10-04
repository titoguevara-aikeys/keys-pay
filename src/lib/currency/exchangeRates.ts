/**
 * Currency Exchange Rate Service
 * Provides live foreign exchange rates for currency conversion
 */

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// NOTE: FreeCurrencyAPI key needs to be obtained from https://freecurrencyapi.com/
// For now, using fallback mock data to prevent errors
const API_KEY = ''; // Get your free API key from https://freecurrencyapi.com/
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

/**
 * Fetches live exchange rates from FreeCurrencyAPI
 * @param baseCurrency - Base currency code (default: USD)
 * @param targetCurrencies - Array of target currency codes
 * @returns Promise with exchange rates
 */
export const fetchExchangeRates = async (
  baseCurrency: string = 'USD',
  targetCurrencies?: string[]
): Promise<ExchangeRateResponse> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      base_currency: baseCurrency,
    });

    if (targetCurrencies && targetCurrencies.length > 0) {
      params.append('currencies', targetCurrencies.join(','));
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data) {
      throw new Error('Invalid response format from currency API');
    }

    return {
      success: true,
      timestamp: Date.now(),
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: data.data
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return fallback rates (1:1) to prevent app from breaking
    const fallbackRates: Record<string, number> = {};
    if (targetCurrencies) {
      targetCurrencies.forEach(currency => {
        fallbackRates[currency] = 1;
      });
    }
    
    return {
      success: false,
      timestamp: Date.now(),
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: fallbackRates
    };
  }
};

/**
 * Converts amount from one currency to another using live rates
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rates - Exchange rates object
 * @returns Converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // If converting from base currency (usually USD)
  if (rates[toCurrency]) {
    return amount * rates[toCurrency];
  }

  // If converting to base currency or between non-base currencies
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  // Convert to base currency first, then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
};

/**
 * Get cached exchange rate or fetch new one
 */
export const getCachedExchangeRate = (
  fromCurrency: string,
  toCurrency: string,
  cachedRates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rate = cachedRates[toCurrency] || 1;
  return rate;
};