/*
 * AIKEYS FINANCIAL PLATFORM - TRANSACTIONS PAGE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import React from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { TransactionSystem } from '@/components/TransactionSystem';

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransactionSystem />
      </main>
      
      <Footer />
    </div>
  );
};

export default Transactions;