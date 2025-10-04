import React from 'react';
import MegaNav from '@/components/nav/MegaNav';
import ParticleField from '@/components/effects/ParticleField';

interface AppLayoutProps {
  children: React.ReactNode;
  showParticles?: boolean;
  className?: string;
}

export function AppLayout({ children, showParticles = false, className = '' }: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <MegaNav />
      <div className="relative">
        {showParticles && (
          <ParticleField 
            particleCount={30}
            className="fixed inset-0"
            color="hsl(var(--primary))"
          />
        )}
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}