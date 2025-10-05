import { 
  LayoutDashboard, 
  Bot, 
  ArrowLeftRight, 
  CreditCard, 
  Users, 
  Smartphone, 
  Coins, 
  BarChart3 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import keysLogo from '@/assets/keys-logo-icon.png';

const navigationItems = [
  { icon: Users, label: 'Family', color: 'bg-pink-500/20 text-pink-400', position: 'top', to: '/family' },
  { icon: Bot, label: 'AI Assistant', color: 'bg-purple-500/20 text-purple-400', position: 'top-right', to: '/aikeys' },
  { icon: LayoutDashboard, label: 'Dashboard', color: 'bg-emerald-500/20 text-emerald-400', position: 'right', to: '/analytics' },
  { icon: ArrowLeftRight, label: 'Transactions', color: 'bg-blue-500/20 text-blue-400', position: 'bottom-right', to: '/transactions' },
  { icon: CreditCard, label: 'Cards', color: 'bg-teal-500/20 text-teal-400', position: 'bottom', to: '/cards' },
  { icon: BarChart3, label: 'Analytics', color: 'bg-orange-500/20 text-orange-400', position: 'bottom-left', to: '/analytics' },
  { icon: Coins, label: 'Crypto Hub', color: 'bg-yellow-500/20 text-yellow-400', position: 'left', to: '/crypto-hub' },
  { icon: Smartphone, label: 'Super App', color: 'bg-blue-500/20 text-blue-400', position: 'top-left', to: '/super-app' },
];

// Calculate circular positions - radius of 230px from center
const radius = 230;
const positionStyles = {
  'top': { top: '50%', left: '50%', transform: `translate(-50%, calc(-50% - ${radius}px))` },
  'top-right': { top: '50%', left: '50%', transform: `translate(calc(-50% + ${radius * 0.707}px), calc(-50% - ${radius * 0.707}px))` },
  'right': { top: '50%', left: '50%', transform: `translate(calc(-50% + ${radius}px), -50%)` },
  'bottom-right': { top: '50%', left: '50%', transform: `translate(calc(-50% + ${radius * 0.707}px), calc(-50% + ${radius * 0.707}px))` },
  'bottom': { top: '50%', left: '50%', transform: `translate(-50%, calc(-50% + ${radius}px))` },
  'bottom-left': { top: '50%', left: '50%', transform: `translate(calc(-50% - ${radius * 0.707}px), calc(-50% + ${radius * 0.707}px))` },
  'left': { top: '50%', left: '50%', transform: `translate(calc(-50% - ${radius}px), -50%)` },
  'top-left': { top: '50%', left: '50%', transform: `translate(calc(-50% - ${radius * 0.707}px), calc(-50% - ${radius * 0.707}px))` },
};

export default function HeroCircularNav() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-sm shadow-2xl border border-emerald-500/20">
          <img src={keysLogo} alt="Keys Pay" className="h-20 w-20 animate-pulse" />
          {/* Animated glow rings */}
          <div className="absolute h-full w-full rounded-full border-2 border-emerald-400/30 animate-ping"></div>
          <div className="absolute h-[120%] w-[120%] rounded-full border border-emerald-400/20"></div>
          <div className="absolute h-[140%] w-[140%] rounded-full border border-emerald-400/10"></div>
        </div>
      </div>

      {/* Navigation Items in Circular Layout */}
      <div className="relative w-[600px] h-[600px]">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="absolute group"
            style={positionStyles[item.position as keyof typeof positionStyles]}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/60 backdrop-blur-md px-5 py-4 shadow-lg border border-slate-700/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500/50">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-white whitespace-nowrap">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
