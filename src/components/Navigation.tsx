import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/MockAuthContext';
import CurrencySelector from '@/components/CurrencySelector';
import { LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  
  const handleLogin = () => {
    window.location.href = '/auth';
  };

  const handleSignUp = () => {
    window.location.href = '/auth';
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" 
                alt="Keys Pay" 
                className="h-8 w-auto dark:opacity-90"
              />
            </NavLink>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="hidden sm:block">
              <CurrencySelector showLabel={false} className="text-sm" />
            </div>

            {!user ? (
              /* Sign in/Sign up buttons for non-authenticated users */
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignUp}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign up
                </Button>
              </div>
            ) : (
              /* User menu for authenticated users */
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/cards'}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <div className="sm:hidden">
              <Button variant="ghost" size="sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;