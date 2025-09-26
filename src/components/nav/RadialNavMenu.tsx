import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Brain,
  Zap,
  ArrowRightLeft,
  Bitcoin,
  Plus,
  X
} from 'lucide-react';

const RadialNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', color: 'hsl(210, 100%, 70%)' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions', color: 'hsl(200, 100%, 75%)' },
    { to: '/crypto', icon: Bitcoin, label: 'Crypto Hub', color: 'hsl(190, 100%, 80%)' },
    { to: '/ai-assistant', icon: Brain, label: 'AI Assistant', color: 'hsl(220, 100%, 65%)' },
    { to: '/super-app', icon: Zap, label: 'Super App', color: 'hsl(240, 100%, 70%)' },
    { to: '/cards', icon: CreditCard, label: 'Cards', color: 'hsl(260, 100%, 75%)' },
    { to: '/family', icon: Users, label: 'Family', color: 'hsl(280, 100%, 70%)' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', color: 'hsl(300, 100%, 65%)' },
  ];

  const radius = 120;
  const centerX = 80;
  const centerY = 80;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Radial Menu Items */}
      <div className={`relative transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {navItems.map((item, index) => {
          const angle = (index * 360) / navItems.length;
          const radian = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(radian - Math.PI / 2);
          const y = centerY + radius * Math.sin(radian - Math.PI / 2);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="absolute group"
              style={{
                left: `${x - 24}px`,
                top: `${y - 24}px`,
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-200"
                style={{ 
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  boxShadow: `0 0 20px ${item.color}40`
                }}
              >
                <item.icon className="h-6 w-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border">
                {item.label}
              </div>
            </NavLink>
          );
        })}

        {/* Center Connection Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {navItems.map((_, index) => {
            const angle = (index * 360) / navItems.length;
            const radian = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(radian - Math.PI / 2);
            const y = centerY + radius * Math.sin(radian - Math.PI / 2);

            return (
              <div
                key={index}
                className="absolute w-px bg-gradient-to-r from-primary/40 to-transparent"
                style={{
                  left: `${centerX}px`,
                  top: `${centerY}px`,
                  width: `${radius}px`,
                  height: '1px',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                  opacity: isOpen ? 0.3 : 0,
                  transition: 'opacity 300ms ease-in-out'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Central Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 shadow-xl hover:shadow-2xl transition-all duration-300"
        style={{
          boxShadow: '0 0 40px hsl(210 100% 70% / 0.4)',
        }}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          {isOpen ? <X className="h-8 w-8" /> : <Plus className="h-8 w-8" />}
        </div>
        
        {/* Animated Ring */}
        <div 
          className={`absolute inset-0 rounded-full border-2 border-primary/30 ${
            isOpen ? 'animate-ping' : ''
          }`}
        />
      </Button>

      {/* Background Blur Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RadialNavMenu;