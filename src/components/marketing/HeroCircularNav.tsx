import { 
  LayoutDashboard, 
  Bot, 
  ArrowUpDown, 
  CreditCard, 
  Users, 
  Smartphone, 
  Bitcoin, 
  BarChart3 
} from 'lucide-react';

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', color: 'from-emerald-500 to-teal-600', position: 'top' },
  { icon: Bot, label: 'AI Assistant', color: 'from-purple-500 to-pink-600', position: 'top-right' },
  { icon: ArrowUpDown, label: 'Transactions', color: 'from-blue-500 to-indigo-600', position: 'right' },
  { icon: CreditCard, label: 'Cards', color: 'from-cyan-500 to-blue-600', position: 'bottom-right' },
  { icon: Bitcoin, label: 'Crypto Hub', color: 'from-orange-500 to-amber-600', position: 'bottom' },
  { icon: BarChart3, label: 'Analytics', color: 'from-yellow-500 to-orange-600', position: 'bottom-left' },
  { icon: Smartphone, label: 'Super App', color: 'from-indigo-500 to-purple-600', position: 'left' },
  { icon: Users, label: 'Family', color: 'from-pink-500 to-rose-600', position: 'top-left' },
];

const positionClasses = {
  'top': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-[15%] right-[15%]',
  'right': 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
  'bottom-right': 'bottom-[15%] right-[15%]',
  'bottom': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'bottom-left': 'bottom-[15%] left-[15%]',
  'left': 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-left': 'top-[15%] left-[15%]',
};

export default function HeroCircularNav() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Logo */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl animate-pulse" />
        
        {/* Central circle */}
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
          <div className="w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-20 h-20 text-blue-400">
              <path
                fill="currentColor"
                d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
              />
            </svg>
          </div>
        </div>

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {navigationItems.map((_, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const x1 = 50;
            const y1 = 50;
            const x2 = 50 + Math.cos(angle - Math.PI / 2) * 40;
            const y2 = 50 + Math.sin(angle - Math.PI / 2) * 40;
            
            return (
              <line
                key={index}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Navigation items */}
        {navigationItems.map((item, index) => (
          <div
            key={item.label}
            className={`absolute ${positionClasses[item.position as keyof typeof positionClasses]} group cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm text-gray-300 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
