import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, MessageCircle, TrendingUp, AlertCircle, CheckCircle2, X, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAIInsights,
  useFinancialHealthScore,
  useGenerateInsights,
  useCalculateHealthScore,
  useDismissInsight,
  useMarkInsightAsRead,
  useChatSessions,
  useChatMessages,
  useSendChatMessage
} from '@/hooks/useAIAssistant';

export const AIFinancialAssistant = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [activeChatSession, setActiveChatSession] = useState<string | null>(null);

  const { data: insights, isLoading: insightsLoading } = useAIInsights();
  const { data: healthScore, isLoading: healthLoading } = useFinancialHealthScore();
  const { data: chatSessions } = useChatSessions();
  const { data: chatMessages } = useChatMessages(activeChatSession || undefined);

  const generateInsights = useGenerateInsights();
  const calculateHealthScore = useCalculateHealthScore();
  const dismissInsight = useDismissInsight();
  const markAsRead = useMarkInsightAsRead();
  const sendMessage = useSendChatMessage();

  const handleGenerateInsights = async () => {
    try {
      await generateInsights.mutateAsync();
      toast.success('AI insights generated successfully!');
    } catch (error) {
      toast.error('Failed to generate insights');
    }
  };

  const handleCalculateHealthScore = async () => {
    try {
      await calculateHealthScore.mutateAsync();
      toast.success('Financial health score updated!');
    } catch (error) {
      toast.error('Failed to calculate health score');
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    try {
      const result = await sendMessage.mutateAsync({
        message: chatMessage,
        sessionId: activeChatSession || undefined,
        createNewSession: !activeChatSession
      });

      if (!activeChatSession && result.sessionId) {
        setActiveChatSession(result.sessionId);
      }

      setChatMessage('');
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return <TrendingUp className="h-4 w-4" />;
      case 'budget_suggestion':
        return <AlertCircle className="h-4 w-4" />;
      case 'saving_opportunity':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'investment_advice':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'budget_suggestion':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'saving_opportunity':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'investment_advice':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Financial Assistant
          </h1>
          <p className="text-muted-foreground">
            Get personalized insights and advice for your financial goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateInsights}
            disabled={generateInsights.isPending}
            variant="outline"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
          <Button
            onClick={handleCalculateHealthScore}
            disabled={calculateHealthScore.isPending}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Update Health Score
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="health">Financial Health</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Financial Insights</CardTitle>
              <CardDescription>
                AI-powered recommendations based on your spending patterns and financial behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : insights && insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <Card key={insight.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getInsightColor(insight.insight_type)}`}>
                              {getInsightIcon(insight.insight_type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{insight.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(insight.confidence_score * 100)}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead.mutate(insight.id)}
                              disabled={insight.is_read}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissInsight.mutate(insight.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {insight.action_items && Array.isArray(insight.action_items) && insight.action_items.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recommended Actions:</h4>
                            <ul className="space-y-1">
                              {insight.action_items.map((action, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1 h-1 bg-current rounded-full" />
                                  {String(action)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Click "Generate Insights" to get AI-powered financial recommendations
                  </p>
                  <Button onClick={handleGenerateInsights} disabled={generateInsights.isPending}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Your First Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
              <CardDescription>
                Track your overall financial wellness across key areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <div className="space-y-4">
                  <div className="h-32 bg-muted animate-pulse rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : healthScore ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {healthScore.overall_score}/100
                    </div>
                    <p className="text-muted-foreground">Overall Financial Health</p>
                    <Progress value={healthScore.overall_score} className="mt-4" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {healthScore.spending_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Spending</p>
                        <Progress value={healthScore.spending_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {healthScore.saving_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Saving</p>
                        <Progress value={healthScore.saving_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {healthScore.debt_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Debt</p>
                        <Progress value={healthScore.debt_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {healthScore.investment_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Investment</p>
                        <Progress value={healthScore.investment_score} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {healthScore.recommendations && Array.isArray(healthScore.recommendations) && healthScore.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(healthScore.recommendations as string[]).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No health score yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Calculate your financial health score to track your progress
                  </p>
                  <Button onClick={handleCalculateHealthScore} disabled={calculateHealthScore.isPending}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Calculate Health Score
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveChatSession(null)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                  {chatSessions?.map((session) => (
                    <Button
                      key={session.id}
                      variant={activeChatSession === session.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveChatSession(session.id)}
                    >
                      <div className="truncate">
                        {session.title || 'Untitled Chat'}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">AI Financial Advisor</CardTitle>
                <CardDescription>
                  Ask questions about your finances, budgeting, investing, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {chatMessages && chatMessages.length > 0 ? (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>Start a conversation with your AI financial advisor</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your finances..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={sendMessage.isPending}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sendMessage.isPending || !chatMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};