import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedAIAssistant } from '@/components/EnhancedAIAssistant';
import { AIFinancialAssistant } from '@/components/AIFinancialAssistant';
import { AIKEYSIntelligence } from '@/components/AIKEYSIntelligence';
import { AIKEYSFinancial } from '@/components/AIKEYSFinancial';
import { AIKEYSWealth } from '@/components/AIKEYSWealth';
import { AIAssistantSidebar } from '@/components/AIAssistantSidebar';
import { Home, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AIAssistant = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'intelligence');

  useEffect(() => {
    const tab = searchParams.get('tab') || 'intelligence';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

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
                  <AIKEYSIntelligence />
                </TabsContent>

                <TabsContent value="assistant">
                  <AIFinancialAssistant />
                </TabsContent>

                <TabsContent value="financial">
                  <AIKEYSFinancial />
                </TabsContent>

                <TabsContent value="wealth">
                  <AIKEYSWealth />
                </TabsContent>

                <TabsContent value="enhanced">
                  <EnhancedAIAssistant />
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