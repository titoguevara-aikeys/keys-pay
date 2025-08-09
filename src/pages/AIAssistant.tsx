import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedAIAssistant } from '@/components/EnhancedAIAssistant';
import { AIFinancialAssistant } from '@/components/AIFinancialAssistant';
import { AIKEYSIntelligence } from '@/components/AIKEYSIntelligence';
import { AIKEYSFinancial } from '@/components/AIKEYSFinancial';
import { AIKEYSWealth } from '@/components/AIKEYSWealth';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('intelligence');

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
  );
};

export default AIAssistant;