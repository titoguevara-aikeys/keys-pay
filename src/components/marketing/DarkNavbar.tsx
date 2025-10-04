import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, Globe, Menu, X, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import keysPayLogo from '@/assets/keys-pay-logo.png';

export default function DarkNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
            <Command size={16} />
            <span className="text-sm">K</span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare size={20} />
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white transition-colors">
            <Globe size={18} />
            <span className="text-sm">EN</span>
          </button>
          
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              Open Account
            </Button>
          </Link>
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
            <Link to="/crypto-hub" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Crypto Hub
            </Link>
            <Link to="/cards" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Cards
            </Link>
            <Link to="/family" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-300 hover:text-white transition-colors">
              Family
            </Link>
            
            <div className="border-t border-white/5 pt-4 mt-2">
              <button className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full">
                <Search size={20} />
                <span>Search</span>
              </button>
              
              <button className="flex items-center gap-3 py-2 text-gray-400 hover:text-white transition-colors w-full">
                <MessageSquare size={20} />
                <span>Chat</span>
              </button>
            </div>
            
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
