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
                Seamless crypto payments with advanced security. Trusted by millions globally.
              </p>
              
              {/* App Download Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Get the app</p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-12 px-4"
                    onClick={() => window.open('https://apps.apple.com', '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Download on the</div>
                      <div className="text-sm font-medium">App Store</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-12 px-4"
                    onClick={() => window.open('https://play.google.com', '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Get it on</div>
                      <div className="text-sm font-medium">Google Play</div>
                    </div>
                  </Button>
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
              © 2024 AIKEYS. All rights reserved.
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Licensed Custodian</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>$50M USD Insurance</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>FIPS 140-2 Level 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};