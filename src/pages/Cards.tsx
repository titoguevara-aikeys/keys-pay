import React from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import NiumCardManagement from '@/components/NiumCardManagement';

const Cards = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <NiumCardManagement />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cards;