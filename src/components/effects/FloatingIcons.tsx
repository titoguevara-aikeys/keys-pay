import React, { useEffect, useRef } from 'react';
import aikeysLogo from '@/assets/aikeys-logo-skyblue.png';

interface FloatingIconsProps {
  className?: string;
}

export function FloatingIcons({ className = '' }: FloatingIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create multiple instances of the logo for variety
  const logoCount = 15;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing logos
    container.innerHTML = '';

    // Create floating logos
    for (let i = 0; i < logoCount; i++) {
      const logoWrapper = document.createElement('div');
      logoWrapper.className = 'floating-logo';
      
      // Random positioning and animation properties
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 20;
      const animationDuration = 20 + Math.random() * 10;
      const size = 24 + Math.random() * 20; // Similar size range as original particles
      const opacity = 0.05 + Math.random() * 0.1; // Very subtle opacity
      const rotation = Math.random() * 360;
      
      logoWrapper.style.cssText = `
        position: absolute;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        opacity: ${opacity};
        animation: float-vertical ${animationDuration}s linear infinite;
        animation-delay: ${animationDelay}s;
        pointer-events: none;
        z-index: 1;
        transform: rotate(${rotation}deg);
        filter: blur(0.2px);
      `;

      // Create the logo image element
      const imgElement = document.createElement('img');
      imgElement.src = aikeysLogo;
      imgElement.alt = 'AIKEYS Logo';
      imgElement.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: all 0.3s ease;
      `;
      
      logoWrapper.appendChild(imgElement);
      container.appendChild(logoWrapper);
    }
  }, []);


  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}