import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut,
  ChevronRight 
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  panel?: any;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, navItems }) => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
                alt="Keys Pay" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">Keys Pay</span>
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between w-full p-4 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`
                  }
                >
                  <span className="font-medium text-[17px]">{item.label}</span>
                  <ChevronRight className="h-5 w-5" />
                </NavLink>
              ))}
            </nav>

            {/* User Section */}
            {user && (
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user.id?.slice(-8)?.toUpperCase() || 'N/A'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;