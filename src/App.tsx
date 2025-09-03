/*
 * AIKEYS FINANCIAL PLATFORM - MAIN APPLICATION
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL SOFTWARE
 * Protected by Intellectual Property Laws
 * Unauthorized reproduction, distribution, or reverse engineering prohibited
 * 
 * For licensing inquiries: legal@aikeys.ai
 * Platform Version: 1.0.0
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { KeysPayAuthProvider } from "@/contexts/KeysPayAuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ExchangeRateProvider } from "@/contexts/ExchangeRateContext";
import { PlatformGuard } from "@/components/PlatformGuard";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import { KeysPayProtectedRoute } from "@/components/KeysPayProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ComplianceFooter from "@/components/ComplianceFooter";
import { KeysPaySidebar } from '@/components/KeysPaySidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useKeysPayAuth } from '@/contexts/KeysPayAuthContext';

// Keys Pay Pages
import Dashboard from './pages/Dashboard';
import CryptoBuyPage from './pages/CryptoBuyPage';
import Auth from './pages/Auth';
import KeysPayCardsPage from './pages/KeysPayCardsPage';
import ProfilePage from './pages/ProfilePage';

// Legacy Pages
import Index from "./pages/Index";
import MockAuth from "./pages/MockAuth";
import NotFound from "./pages/NotFound";
import FamilyControls from "./pages/FamilyControls";
import Cards from "./pages/Cards";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import SuperApp from "./pages/SuperApp";
import CryptoHub from "./pages/CryptoHub";
import AIAssistant from "./pages/AIAssistant";
import AdminPortal from "./pages/AdminPortal";
import KYC from "./pages/KYC";
import Transactions from "./pages/Transactions";
import Aikeys from "./pages/Aikeys";
import Travel from "./pages/Travel";
import Education from "./pages/Education";
import Logistics from "./pages/Logistics";
import MobileApp from "./pages/MobileApp";
import KeyspayAdmin from "./pages/keyspay/admin";
import KeyspayBuy from "./pages/keyspay/buy";
import KeyspaySell from "./pages/keyspay/sell";
import ProvidersIndexPage from "./pages/admin/ProvidersIndex";
import NiumAdminPage from "./pages/admin/NiumAdmin";
import SystemCheck from "./pages/SystemCheck";
import PaymentsSendPage from "./pages/PaymentsSend";
import CollectionsAccountsPage from "./pages/CollectionsAccounts";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/mock-auth" element={<MockAuth />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <KeysPayProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <KeysPaySidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger className="ml-4" />
                  <div className="flex-1" />
                </header>
                <main className="flex-1">
                  <Dashboard />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </KeysPayProtectedRoute>
      } />
      
      <Route path="/crypto" element={
        <KeysPayProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <KeysPaySidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger className="ml-4" />
                  <div className="flex-1" />
                </header>
                <main className="flex-1">
                  <CryptoBuyPage />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </KeysPayProtectedRoute>
      } />

      <Route path="/keyspay/cards" element={
        <KeysPayProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <KeysPaySidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger className="ml-4" />
                  <div className="flex-1" />
                </header>
                <main className="flex-1">
                  <KeysPayCardsPage />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </KeysPayProtectedRoute>
      } />

      <Route path="/profile" element={
        <KeysPayProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <KeysPaySidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger className="ml-4" />
                  <div className="flex-1" />
                </header>
                <main className="flex-1">
                  <ProfilePage />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </KeysPayProtectedRoute>
      } />

      {/* Redirect keyspay to dashboard */}
      <Route path="/keyspay" element={<Navigate to="/dashboard" replace />} />

      {/* Legacy Routes - Hidden behind feature flags */}
      <Route path="/travel" element={<ProtectedRoute><Travel /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
      <Route path="/logistics" element={<ProtectedRoute><Logistics /></ProtectedRoute>} />
      <Route path="/aikeys" element={<ProtectedRoute><Aikeys /></ProtectedRoute>} />
      <Route path="/family" element={<ProtectedRoute><FamilyControls /></ProtectedRoute>} />
      <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
      <Route path="/super-app" element={<ProtectedRoute><SuperApp /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/mobile-app" element={<MobileApp />} />
      <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />
      <Route path="/admin/system-check" element={<AdminRoute><SystemCheck /></AdminRoute>} />
      <Route path="/keyspay/admin" element={<AdminRoute><KeyspayAdmin /></AdminRoute>} />
      <Route path="/keyspay/buy" element={<ProtectedRoute><KeyspayBuy /></ProtectedRoute>} />
      <Route path="/keyspay/sell" element={<ProtectedRoute><KeyspaySell /></ProtectedRoute>} />
      <Route path="/admin/providers" element={<AdminRoute><ProvidersIndexPage /></AdminRoute>} />
      <Route path="/admin/providers/nium" element={<AdminRoute><NiumAdminPage /></AdminRoute>} />
      <Route path="/payments/send" element={<ProtectedRoute><PaymentsSendPage /></ProtectedRoute>} />
      <Route path="/collections/accounts" element={<ProtectedRoute><CollectionsAccountsPage /></ProtectedRoute>} />
      
      {/* Redirect root based on auth state */}
      <Route path="/" element={<AuthRedirect />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Component for handling auth-based redirects
const AuthRedirect = () => {
  const { user, loading } = useKeysPayAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformGuard>
      <SecurityProvider>
        <KeysPayAuthProvider>
          <ExchangeRateProvider>
            <CurrencyProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                  <ComplianceFooter />
                </BrowserRouter>
              </TooltipProvider>
            </CurrencyProvider>
          </ExchangeRateProvider>
        </KeysPayAuthProvider>
      </SecurityProvider>
    </PlatformGuard>
  </QueryClientProvider>
);

export default App;