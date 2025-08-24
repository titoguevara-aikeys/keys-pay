import { useCurrency } from '@/contexts/CurrencyContext';

/**
 * Hook for formatting currency amounts consistently across the platform
 * This provides backward compatibility and makes migration easier
 */
export const useCurrencyFormatter = () => {
  const { formatAmount, getCurrencySymbol, selectedCurrency } = useCurrency();

  /**
   * Legacy formatter for components that haven't migrated yet
   * @param amount - The amount to format
   * @param showSymbol - Whether to show the currency symbol
   * @returns Formatted currency string
   */
  const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
    return formatAmount(amount, showSymbol);
  };

  /**
   * Get just the currency symbol
   */
  const currencySymbol = getCurrencySymbol();

  /**
   * Get the currency code (e.g., "USD", "EUR")
   */
  const currencyCode = selectedCurrency.code;

  return {
    formatCurrency,
    formatAmount,
    currencySymbol,
    currencyCode,
    selectedCurrency,
  };
};