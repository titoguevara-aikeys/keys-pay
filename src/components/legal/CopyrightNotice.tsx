/*
 * AIKEYS FINANCIAL PLATFORM - COPYRIGHT HEADER
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL - UNAUTHORIZED USE PROHIBITED
 * Protected by Intellectual Property Laws
 */

import React from 'react';

interface CopyrightNoticeProps {
  className?: string;
  variant?: 'footer' | 'watermark' | 'full';
}

export const CopyrightNotice: React.FC<CopyrightNoticeProps> = ({ 
  className = '', 
  variant = 'footer' 
}) => {
  const currentYear = new Date().getFullYear();
  
  if (variant === 'watermark') {
    return (
      <div 
        className={`fixed bottom-0 right-0 p-2 text-xs opacity-10 pointer-events-none select-none ${className}`}
        style={{ 
          fontSize: '8px',
          fontFamily: 'monospace',
          color: 'rgba(0,0,0,0.1)',
          background: 'transparent',
          zIndex: 9999
        }}
      >
        © {currentYear} AIKEYS Financial Technologies
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`text-xs text-muted-foreground space-y-1 ${className}`}>
        <p className="font-semibold">
          © {currentYear} AIKEYS Financial Technologies. All Rights Reserved.
        </p>
        <p className="text-xs opacity-75">
          AIKEYS Financial Platform™ - Proprietary Software
        </p>
        <p className="text-xs opacity-60">
          Protected by Intellectual Property Laws. Unauthorized use prohibited.
        </p>
      </div>
    );
  }

  return (
    <div className={`text-xs text-muted-foreground ${className}`}>
      © {currentYear} AIKEYS Financial Technologies. All Rights Reserved.
    </div>
  );
};

export const TrademarksNotice: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-xs text-muted-foreground ${className}`}>
    <p>
      AIKEYS®, AIKEYS Financial Platform™, and related marks are trademarks 
      of AIKEYS Financial Technologies.
    </p>
  </div>
);

export const PatentNotice: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-xs text-muted-foreground ${className}`}>
    <p>
      Protected by patents and patent applications. Additional patents pending.
    </p>
  </div>
);