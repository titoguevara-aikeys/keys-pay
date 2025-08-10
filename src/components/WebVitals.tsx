import React, { useEffect } from 'react';

interface WebVitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// In-memory store for development
const vitalsStore: WebVitalsData[] = [];

export function logWebVitals() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    const logVital = (vital: WebVitalsData) => {
      vitalsStore.push(vital);
      console.log(`[Web Vitals] ${vital.name}:`, {
        value: vital.value,
        rating: vital.rating,
        delta: vital.delta
      });
      
      // Store in sessionStorage for debugging
      const existing = JSON.parse(sessionStorage.getItem('webVitals') || '[]');
      existing.push(vital);
      sessionStorage.setItem('webVitals', JSON.stringify(existing));
    };

    onCLS(logVital);
    onFID(logVital);
    onFCP(logVital);
    onLCP(logVital);
    onTTFB(logVital);
  });
}

export function WebVitals() {
  useEffect(() => {
    logWebVitals();
  }, []);

  return null;
}

export function getWebVitalsData(): WebVitalsData[] {
  return [...vitalsStore];
}

export function clearWebVitalsData(): void {
  vitalsStore.length = 0;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('webVitals');
  }
}