import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const EnhancedAIAssistant = lazy(() => import('@/components/EnhancedAIAssistant').then(m => ({ default: m.EnhancedAIAssistant })));
const AIFinancialAssistant = lazy(() => import('@/components/AIFinancialAssistant').then(m => ({ default: m.AIFinancialAssistant })));
const AIKEYSIntelligence = lazy(() => import('@/components/AIKEYSIntelligence').then(m => ({ default: m.AIKEYSIntelligence })));
const AIKEYSFinancial = lazy(() => import('@/components/AIKEYSFinancial').then(m => ({ default: m.AIKEYSFinancial })));
const AIKEYSWealth = lazy(() => import('@/components/AIKEYSWealth').then(m => ({ default: m.AIKEYSWealth })));
import { AIAssistantSidebar } from '@/components/AIAssistantSidebar';
import AIAssistantSkeleton from '@/components/skeletons/AIAssistantSkeleton';
import { Home, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AIAssistant = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'intelligence');

  useEffect(() => {
    const tab = searchParams.get('tab') || 'intelligence';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  }, [setSearchParams]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        {/* Enhanced Sidebar */}
        <AIAssistantSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Navigation */}
          <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <NavLink 
                to="/" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </NavLink>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">AI Assistant Hub</span>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
                  <TabsTrigger value="assistant">Financial Assistant</TabsTrigger>
                  <TabsTrigger value="financial">Financial Services</TabsTrigger>
                  <TabsTrigger value="wealth">Wealth Management</TabsTrigger>
                  <TabsTrigger value="enhanced">Enhanced Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="intelligence">
                  <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading Intelligence...</div>}>
                    <AIKEYSIntelligence />
                  </Suspense>
                </TabsContent>

                <TabsContent value="assistant">
                  <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading Assistant...</div>}>
                    <AIFinancialAssistant />
                  </Suspense>
                </TabsContent>

                <TabsContent value="financial">
                  <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading Financial Services...</div>}>
                    <AIKEYSFinancial />
                  </Suspense>
                </TabsContent>

                <TabsContent value="wealth">
                  <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading Wealth Management...</div>}>
                    <AIKEYSWealth />
                  </Suspense>
                </TabsContent>

                <TabsContent value="enhanced">
                  <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading Enhanced Chat...</div>}>
                    <EnhancedAIAssistant />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AIAssistant;