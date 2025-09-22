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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthProvider } from "@/contexts/MockAuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ExchangeRateProvider } from "@/contexts/ExchangeRateContext";
import { PlatformGuard } from "@/components/PlatformGuard";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ComplianceFooter from "@/components/ComplianceFooter";
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

// Import Admin components
import ProvidersIndexPage from "./pages/admin/ProvidersIndex";
import NiumAdminPage from "./pages/admin/NiumAdmin";
import SystemCheck from "./pages/SystemCheck";
import PaymentsSendPage from "./pages/PaymentsSend";
import CollectionsAccountsPage from "./pages/CollectionsAccounts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TaglinesAdmin from "./pages/admin/TaglinesAdmin";
import AllowlistAdmin from "./pages/admin/AllowlistAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformGuard>
      <SecurityProvider>
        <MockAuthProvider>
          <ExchangeRateProvider>
            <CurrencyProvider>
            <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<MockAuth />} />
            <Route path="/aikeys" element={<Aikeys />} />
            <Route path="/travel" element={
              <ProtectedRoute>
                <Travel />
              </ProtectedRoute>
            } />
            <Route path="/education" element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            } />
            <Route path="/logistics" element={
              <ProtectedRoute>
                <Logistics />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/family" element={
              <ProtectedRoute>
                <FamilyControls />
              </ProtectedRoute>
            } />
            <Route path="/cards" element={
              <ProtectedRoute>
                <Cards />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/security" element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            } />
            <Route path="/super-app" element={
              <ProtectedRoute>
                <SuperApp />
              </ProtectedRoute>
            } />
            <Route path="/crypto" element={
              <ProtectedRoute>
                <CryptoHub />
              </ProtectedRoute>
            } />
            <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            } />
            <Route path="/admin/system-check" element={
              <AdminRoute>
                <SystemCheck />
              </AdminRoute>
            } />
            <Route path="/kyc" element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/mobile-app" element={
              <ProtectedRoute>
                <MobileApp />
              </ProtectedRoute>
            } />
            <Route path="/keyspay/admin" element={
              <AdminRoute>
                <KeyspayAdmin />
              </AdminRoute>
            } />
            <Route path="/keyspay/buy" element={
              <ProtectedRoute>
                <KeyspayBuy />
              </ProtectedRoute>
            } />
            <Route path="/keyspay/sell" element={
              <ProtectedRoute>
                <KeyspaySell />
              </ProtectedRoute>
            } />
            <Route path="/keyspay/admin/providers" element={
              <AdminRoute>
                <ProvidersIndexPage />
              </AdminRoute>
            } />
            <Route path="/keyspay/admin/providers/nium" element={
              <AdminRoute>
                <NiumAdminPage />
              </AdminRoute>
            } />
            <Route path="/admin/providers" element={
              <AdminRoute>
                <ProvidersIndexPage />
              </AdminRoute>
            } />
            <Route path="/admin/providers/nium" element={
              <AdminRoute>
                <NiumAdminPage />
              </AdminRoute>
            } />
            <Route path="/payments/send" element={
              <ProtectedRoute>
                <PaymentsSendPage />
              </ProtectedRoute>
            } />
            <Route path="/collections/accounts" element={
              <ProtectedRoute>
                <CollectionsAccountsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/taglines" element={
              <AdminRoute>
                <TaglinesAdmin />
              </AdminRoute>
            } />
            <Route path="/admin/allowlist" element={
              <AdminRoute>
                <AllowlistAdmin />
              </AdminRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ComplianceFooter />
        </BrowserRouter>
            </TooltipProvider>
            </CurrencyProvider>
          </ExchangeRateProvider>
      </MockAuthProvider>
      </SecurityProvider>
    </PlatformGuard>
  </QueryClientProvider>
);

export default App;
