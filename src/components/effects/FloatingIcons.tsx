import React, { useEffect, useRef } from 'react';
import { 
  CreditCard, 
  Globe, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users,
  Bitcoin,
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';

interface FloatingIconsProps {
  className?: string;
}

export function FloatingIcons({ className = '' }: FloatingIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const icons = [
    CreditCard,
    Globe, 
    Shield,
    Smartphone,
    TrendingUp,
    Users,
    Bitcoin,
    DollarSign,
    Activity,
    Zap
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing icons
    container.innerHTML = '';

    // Create floating icons
    icons.forEach((IconComponent, index) => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'floating-icon';
      
      // Random positioning
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 20;
      const animationDuration = 20 + Math.random() * 10;
      const size = 20 + Math.random() * 16;
      
      iconWrapper.style.cssText = `
        position: absolute;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        color: hsl(var(--primary) / 0.1);
        animation: float-vertical ${animationDuration}s linear infinite;
        animation-delay: ${animationDelay}s;
        pointer-events: none;
        z-index: 1;
      `;

      // Create the icon using Lucide React approach
      const iconElement = document.createElement('div');
      iconElement.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          ${getIconSVGPath(index)}
        </svg>
      `;
      
      iconWrapper.appendChild(iconElement);
      container.appendChild(iconWrapper);
    });
  }, []);

  const getIconSVGPath = (iconIndex: number): string => {
    const paths = [
      // CreditCard
      '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
      // Globe  
      '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/><path d="M21 12c0 4.97-4 9-9 9s-9-4.03-9-9 4-9 9-9 9 4.03 9 9Z"/>',
      // Shield
      '<path d="M20 13c0 5-3.5 7.5-8 11.5-4.5-4-8-6.5-8-11.5V8l8-3 8 3v5Z"/>',
      // Smartphone
      '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
      // TrendingUp
      '<polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/>',
      // Users
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3 3-3"/>',
      // Bitcoin
      '<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 12.047m5.908 1.042-.347 1.97M15.5 7.5 14 8l1.5.5L14 9.5l1.5.5M8.5 7.5 10 8 8.5 8.5 10 9 8.5 9.5"/>',
      // DollarSign
      '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      // Activity
      '<path d="m22 12-4-4-3 3-6-6-3 3-4-4"/>',
      // Zap
      '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>'
    ];
    return paths[iconIndex] || paths[0];
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}