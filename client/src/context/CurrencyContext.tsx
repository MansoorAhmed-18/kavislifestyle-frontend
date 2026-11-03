import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'INR (₹)', rate: 1.0 }
];

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInInr: number) => string;
  convertPrice: (amountInInr: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'kavis_selected_currency_v2';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('INR');

  useEffect(() => {
    try {
      // Strictly maintain Indian Rupees (₹) as the sole store currency
      localStorage.setItem(CURRENCY_STORAGE_KEY, 'INR');
    } catch (e) {
      console.error('Failed to sync currency to localStorage', e);
    }
  }, []);

  const convertPrice = (amountInInr: number): number => {
    return Number(amountInInr) || 0;
  };

  const formatPrice = (amountInInr: number): string => {
    const num = Math.round(Number(amountInInr) || 0);
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const setCurrency = (_code: CurrencyCode) => {
    setCurrentCurrency('INR');
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
