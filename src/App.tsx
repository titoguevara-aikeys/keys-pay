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
import { AuthProvider } from "@/contexts/AuthContext";
import { PlatformGuard } from "@/components/PlatformGuard";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformGuard>
      <SecurityProvider>
        <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
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
            <Route path="/kyc" element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      </SecurityProvider>
    </PlatformGuard>
  </QueryClientProvider>
);

export default App;
