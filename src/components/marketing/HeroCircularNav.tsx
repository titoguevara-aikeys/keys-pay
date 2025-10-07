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
  { icon: Coins, label: 'Crypto Hub', color: 'bg-yellow-500/20 text-yellow-400', position: 'left', to: '/crypto' },
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
    <div className="relative w-full h-full flex items-center justify-center scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100">
      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 lg:h-48 lg:w-48 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm shadow-2xl border-2 border-emerald-500/30">
          <img src={keysLogo} alt="Keys Pay" className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 animate-pulse" />
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
            <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-slate-900/70 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4 shadow-lg border border-slate-700/60 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/25 hover:border-emerald-500/60 hover:bg-slate-900/80">
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                <item.icon className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 stroke-[2.5]" />
              </div>
              <span className="text-sm sm:text-sm lg:text-base font-semibold text-white whitespace-nowrap tracking-wide">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
