import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Shield, 
  Users, 
  CreditCard, 
  Globe, 
  Mail, 
  Phone,
  MessageCircle,
  FileText,
  HelpCircle,
  MapPin
} from 'lucide-react';
import appStoreBadge from '@/assets/app-store-badge.svg';
import googlePlayBadge from '@/assets/google-play-badge.png';


export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 transform rotate-45 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs transform -rotate-45">⬥</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-white">AI KEYS</h3>
                  <span className="text-xs text-gray-400 -mt-1">Fintech Solutions</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The native utility token powering the entire AI KEYS ecosystem. Built on Solana blockchain for fast, secure, and cost-effective transactions with comprehensive utility.
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>License No: VARA-VAS-001-2024</p>
                <p>Registered Address: Gate Village 10, Level 2, DIFC, Dubai, UAE</p>
                <p>Regulatory Authority: UAE Virtual Asset Regulatory Authority (VARA)</p>
              </div>
              
              {/* App Download Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Get the app</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open('https://apps.apple.com', '_blank')}
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src={appStoreBadge} 
                      alt="Download on the App Store" 
                      className="h-12 w-auto"
                    />
                  </button>
                  <button
                    onClick={() => window.open('https://play.google.com', '_blank')}
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src={googlePlayBadge} 
                      alt="Get it on Google Play" 
                      className="h-12 w-auto"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Products</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/crypto" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Crypto Wallet
                  </a>
                </li>
                <li>
                  <a href="/cards" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Virtual Cards
                  </a>
                </li>
                <li>
                  <a href="/family" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Family Controls
                  </a>
                </li>
                <li>
                  <a href="/super-app" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Super App
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="mailto:support@aikeys.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="tel:+1-800-AIKEYS" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Security & Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Security & Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 AI KEYS. All rights reserved. | VARA License No: VARA-VAS-001-2024
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
              <a href="#" className="hover:text-foreground">Risk Disclosure</a>
              <a href="#" className="hover:text-foreground">Regulatory</a>
            </div>
            
            {/* Company Info */}
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>AI KEYS Fintech Solutions DMCC</p>
              <p>Gate Village 10, Level 2, DIFC, Dubai, UAE</p>
              <p>Regulated by UAE Virtual Asset Regulatory Authority (VARA)</p>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              AI KEYS is a VARA-compliant virtual asset service provider in the UAE. Cryptocurrency investments are subject to market risk. 
              Past performance is not indicative of future results. Please read our risk disclosure statement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};