import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Home,
  BarChart3,
  Shield,
  Smartphone,
  Bitcoin,
  Bot,
  Users,
  TrendingUp,
  ShoppingCart,
  Plane,
  GraduationCap,
  Truck,
  Zap
} from 'lucide-react';

interface Command {
  id: string;
  name: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands: Command[] = [
    // Navigation
    {
      id: 'home',
      name: 'Dashboard',
      description: 'Go to main dashboard',
      icon: Home,
      shortcut: '⌘H',
      action: () => { navigate('/'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'cards',
      name: 'Cards',
      description: 'Manage virtual and physical cards',
      icon: CreditCard,
      shortcut: '⌘C',
      action: () => { navigate('/cards'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'transactions',
      name: 'Transactions',
      description: 'View transaction history',
      icon: BarChart3,
      shortcut: '⌘T',
      action: () => { navigate('/transactions'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'crypto',
      name: 'Crypto Hub',
      description: 'Cryptocurrency features',
      icon: Bitcoin,
      shortcut: '⌘⇧C',
      action: () => { navigate('/crypto'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      description: 'AI-powered financial advisor',
      icon: Bot,
      shortcut: '⌘A',
      action: () => { navigate('/ai-assistant'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Family account controls',
      icon: Users,
      shortcut: '⌘F',
      action: () => { navigate('/family'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Financial insights and reports',
      icon: TrendingUp,
      shortcut: '⌘⇧A',
      action: () => { navigate('/analytics'); setOpen(false); },
      category: 'Navigation'
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Security settings and monitoring',
      icon: Shield,
      shortcut: '⌘S',
      action: () => { navigate('/security'); setOpen(false); },
      category: 'Navigation'
    },
    // Super App Services
    {
      id: 'travel',
      name: 'Travel',
      description: 'Travel booking and management',
      icon: Plane,
      action: () => { navigate('/travel'); setOpen(false); },
      category: 'Super App'
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Learning and financial education',
      icon: GraduationCap,
      action: () => { navigate('/education'); setOpen(false); },
      category: 'Super App'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      description: 'Shipping and logistics services',
      icon: Truck,
      action: () => { navigate('/logistics'); setOpen(false); },
      category: 'Super App'
    },
    // Quick Actions
    {
      id: 'buy-crypto',
      name: 'Buy Crypto',
      description: 'Purchase cryptocurrency',
      icon: ShoppingCart,
      shortcut: '⌘B',
      action: () => { navigate('/keyspay/buy'); setOpen(false); },
      category: 'Quick Actions'
    },
    {
      id: 'mobile-app',
      name: 'Mobile App',
      description: 'Download mobile app',
      icon: Smartphone,
      action: () => { navigate('/mobile-app'); setOpen(false); },
      category: 'Quick Actions'
    },
    // Settings
    {
      id: 'settings',
      name: 'Settings',
      description: 'Application settings',
      icon: Settings,
      action: () => { navigate('/security'); setOpen(false); },
      category: 'Settings'
    },
    {
      id: 'profile',
      name: 'Profile',
      description: 'User profile settings',
      icon: User,
      action: () => { navigate('/security'); setOpen(false); },
      category: 'Settings'
    }
  ];

  const runCommand = React.useCallback((command: Command) => {
    setOpen(false);
    command.action();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          className="h-14 text-base"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="py-8 text-center text-muted-foreground">
            <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
            No results found.
          </CommandEmpty>
          
          {['Navigation', 'Quick Actions', 'Super App', 'Settings'].map((category) => {
            const categoryCommands = commands.filter(cmd => cmd.category === category);
            if (categoryCommands.length === 0) return null;
            
            return (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {categoryCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      value={command.name}
                      onSelect={() => runCommand(command)}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <command.icon className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{command.name}</div>
                        {command.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 text-xs font-mono text-muted-foreground">
                          {command.shortcut}
                        </kbd>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}