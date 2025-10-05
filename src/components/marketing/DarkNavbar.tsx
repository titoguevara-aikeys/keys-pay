import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Globe, Menu, X, Command, CheckCircle, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import keysPayLogo from '@/assets/keys-pay-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '@/components/ui/badge';
import i18n from '@/i18n/config';

export default function DarkNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.toUpperCase());
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const isVerified = profile?.kyc_status === 'verified';

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search logic here
      console.log('Searching for:', searchQuery);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleAIChat = () => {
    navigate('/ai-assistant');
  };

  const handleCommandK = () => {
    setSearchOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={keysPayLogo} alt="Keys Pay" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Keys Pay</span>
            <span className="text-xs text-gray-400 tracking-wider">FINANCIAL PLATFORM</span>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Navigation - Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={handleCommandK}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
            aria-label="Command palette"
          >
            <Command size={16} />
            <span className="text-sm">K</span>
          </button>
          
          <button 
            onClick={handleAIChat}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="AI Assistant"
          >
            <MessageSquare size={20} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
                <Globe size={18} />
                <span className="text-sm">{selectedLanguage}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-[60]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setSelectedLanguage(lang.code.toUpperCase());
                  }}
                  className="cursor-pointer"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <User className="h-4 w-4 text-gray-300" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email?.split('@')[0] || 'User'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      ID: {user.id?.slice(-8)?.toUpperCase() || 'N/A'}
                    </span>
                    {isVerified && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px]">
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { signOut(); navigate('/auth'); }}
                className="text-white hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20">
                  Open Account
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-slate-950">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/transactions" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Transactions
            </Link>
            <Link to="/crypto" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Crypto Hub
            </Link>
            <Link to="/cards" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Cards
            </Link>
            <Link to="/family" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Family
            </Link>
            
            <div className="border-t border-white/5 pt-4 mt-2">
              <button 
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              
              <button 
                onClick={() => {
                  handleAIChat();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full"
              >
                <MessageSquare size={20} />
                <span>AI Assistant</span>
              </button>
            </div>
            
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            
            <Link to="/auth?tab=signup" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Keys Pay</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              type="search"
              placeholder="Search for features, pages, help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setSearchOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
