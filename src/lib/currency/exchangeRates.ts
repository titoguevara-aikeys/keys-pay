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

// Using a free API that doesn't require authentication
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

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
    // Using exchangerate-api.com which is free and doesn't require authentication
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);
    
    if (!response.ok) {
      console.warn(`Exchange rate API returned ${response.status}, using fallback rates`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.rates) {
      throw new Error('Invalid response format from currency API');
    }

    // Filter rates to only include requested currencies if specified
    let filteredRates = data.rates;
    if (targetCurrencies && targetCurrencies.length > 0) {
      filteredRates = {};
      targetCurrencies.forEach(currency => {
        if (data.rates[currency]) {
          filteredRates[currency] = data.rates[currency];
        }
      });
    }

    return {
      success: true,
      timestamp: Date.now(),
      base: baseCurrency,
      date: data.date || new Date().toISOString().split('T')[0],
      rates: filteredRates
    };
  } catch (error) {
    console.warn('Failed to fetch live exchange rates, using fallback rates. Error:', error);
    
    // Comprehensive fallback rates based on approximate current values
    const fallbackRates: Record<string, number> = {
      'EUR': 0.85,
      'GBP': 0.79,
      'AED': 3.67,
      'SGD': 1.35,
      'CAD': 1.36,
      'AUD': 1.52,
      'JPY': 149.50,
      'CHF': 0.90,
      'CNY': 7.15,
      'INR': 83.25,
      'KRW': 1320.50,
      'BRL': 5.15,
      'MXN': 17.25,
      'RUB': 92.50,
      'ZAR': 18.75,
      'NOK': 10.85,
      'SEK': 10.95,
      'DKK': 6.85,
      'HKD': 7.80,
      'NZD': 1.65,
      'THB': 35.25,
      'MYR': 4.45,
      'PLN': 4.15,
      'SAR': 3.75,
      'PHP': 56.50,
      'IDR': 15750,
      'VND': 24500,
      'EGP': 48.50,
      'TRY': 29.25,
      'QAR': 3.64,
      'KWD': 0.31,
      'BHD': 0.38,
      'OMR': 0.38,
      'ILS': 3.65,
      'TWD': 31.25
    };
    
    // Filter to requested currencies or return all fallback rates
    let filteredRates = fallbackRates;
    if (targetCurrencies && targetCurrencies.length > 0) {
      filteredRates = {};
      targetCurrencies.forEach(currency => {
        filteredRates[currency] = fallbackRates[currency] || 1;
      });
    }
    
    return {
      success: false,
      timestamp: Date.now(),
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: filteredRates
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