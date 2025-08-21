/*
 * AIKEYS FINANCIAL PLATFORM - FOOTER COMPONENT
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

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
import { CopyrightNotice, TrademarksNotice, PatentNotice } from '@/components/legal/CopyrightNotice';


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
                <img src="/lovable-uploads/4326dc21-0939-4654-8586-fba79c3b8f84.png?v=2" alt="Keys Pay Logo" className="h-8 w-8" />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-white">Keys Pay</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The native utility token powering the entire KEYS ecosystem. Built on Solana blockchain for fast, secure, and cost-effective transactions with comprehensive utility.
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995)</p>
                <p>Technology platform - All services provided by licensed third-party providers</p>
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
                      className="h-12 w-32 object-contain"
                    />
                  </button>
                  <button
                    onClick={() => window.open('https://play.google.com', '_blank')}
                    className="transition-transform hover:scale-105"
                  >
                    <img 
                      src={googlePlayBadge} 
                      alt="Get it on Google Play" 
                      className="h-12 w-40 object-cover"
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
                  <a href="mailto:contact@aikeys.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
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
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995)
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
              <a href="#" className="hover:text-foreground">Risk Disclosure</a>
              <a href="#" className="hover:text-foreground">Regulatory</a>
            </div>
            
            {/* Powered By */}
            <div className="text-xs text-muted-foreground text-center md:text-right">
              <div className="flex items-center gap-2 justify-center md:justify-end">
                <span>Powered by</span>
                <span className="px-2 py-1 bg-muted rounded">Ramp</span>
                <span className="px-2 py-1 bg-muted rounded">Keys Pay</span>
              </div>
            </div>
          </div>
          
          {/* Aggregator Disclaimer */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Keys Pay is an aggregator technology platform. All payments, card issuing, FX, and virtual asset services are executed by regulated third-party providers. Keys Pay does not custody client funds or digital assets and is not Merchant of Record.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};