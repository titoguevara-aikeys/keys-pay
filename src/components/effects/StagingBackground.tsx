import React from 'react';

interface StagingBackgroundProps {
  className?: string;
}

export function StagingBackground({ className = '' }: StagingBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-slate-950" />
      
      {/* Large purple geometric shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-60">
        {/* Main large rounded rectangle */}
        <div 
          className="absolute top-0 left-0 w-96 h-64 bg-gradient-to-br from-purple-800/60 to-purple-900/40 rounded-3xl transform rotate-12 animate-pulse"
          style={{ 
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(126, 34, 206, 0.2))',
            animationDuration: '4s'
          }}
        />
        
        {/* Secondary shape */}
        <div 
          className="absolute top-32 right-0 w-80 h-48 bg-gradient-to-bl from-pink-700/50 to-purple-800/30 rounded-2xl transform -rotate-6 animate-pulse"
          style={{ 
            background: 'linear-gradient(225deg, rgba(190, 24, 93, 0.35), rgba(147, 51, 234, 0.2))',
            animationDuration: '5s',
            animationDelay: '1s'
          }}
        />
        
        {/* Third shape */}
        <div 
          className="absolute bottom-0 left-16 w-72 h-56 bg-gradient-to-tr from-purple-900/40 to-pink-800/30 rounded-2xl transform rotate-3 animate-pulse"
          style={{ 
            background: 'linear-gradient(45deg, rgba(126, 34, 206, 0.3), rgba(190, 24, 93, 0.25))',
            animationDuration: '6s',
            animationDelay: '2s'
          }}
        />
      </div>
      
      {/* Rotating center logo placeholder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 animate-spin-slow flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <div className="text-white text-2xl font-bold">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="m2 17 10 5 10-5"/>
              <path d="m2 12 10 5 10-5"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Floating navigation icons */}
      <div className="absolute top-20 right-32">
        <div className="w-16 h-16 rounded-xl bg-pink-600/80 flex items-center justify-center text-white animate-float-slow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 21-3-3 3-3"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Family</div>
      </div>
      
      <div className="absolute top-80 right-20">
        <div className="w-16 h-16 rounded-xl bg-blue-600/80 flex items-center justify-center text-white animate-float-delayed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="7" height="7" x="3" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="14" rx="1"/>
            <rect width="7" height="7" x="3" y="14" rx="1"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Super App</div>
      </div>
      
      <div className="absolute bottom-40 right-24">
        <div className="w-16 h-16 rounded-xl bg-teal-600/80 flex items-center justify-center text-white animate-float">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Cards</div>
      </div>
      
      <div className="absolute top-72 left-20">
        <div className="w-16 h-16 rounded-xl bg-orange-600/80 flex items-center justify-center text-white animate-float-slow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 5-3.5 7.5-8 11.5-4.5-4-8-6.5-8-11.5V8l8-3 8 3v5Z"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Crypto Hub</div>
      </div>
      
      <div className="absolute bottom-60 left-32">
        <div className="w-16 h-16 rounded-xl bg-yellow-600/80 flex items-center justify-center text-white animate-float-delayed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
            <polyline points="16,7 22,7 22,13"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Analytics</div>
      </div>
      
      <div className="absolute top-40 left-24">
        <div className="w-16 h-16 rounded-xl bg-purple-600/80 flex items-center justify-center text-white animate-float">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">AI Assistant</div>
      </div>
      
      <div className="absolute bottom-32 right-40">
        <div className="w-16 h-16 rounded-xl bg-green-600/80 flex items-center justify-center text-white animate-float-slow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,11 12,14 22,4"/>
            <path d="m21 12-7 7-7-7"/>
          </svg>
        </div>
        <div className="text-white text-sm mt-2 text-center">Transactions</div>
      </div>
    </div>
  );
}