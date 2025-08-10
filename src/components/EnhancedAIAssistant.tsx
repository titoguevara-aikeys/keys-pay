import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Send, 
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  BarChart3,
  DollarSign,
  Target,
  PiggyBank,
  TrendingDown,
  Calculator,
  Lightbulb,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
import { useInsertDemoData } from '@/hooks/useDemoData';
import { debounce } from '../../utils/debounce';
import { useWebWorker } from '@/hooks/useWebWorker';
import { VirtualizedList } from './VirtualizedList';

interface EnhancedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  isPlaying?: boolean;
}

export const EnhancedAIAssistant = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [activeChatSession, setActiveChatSession] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedMessages, setEnhancedMessages] = useState<EnhancedMessage[]>([]);
  
  // Memoized quick actions to prevent re-renders
  const quickActions = useMemo(() => [
    { icon: BarChart3, label: 'Investment Analysis', prompt: 'Analyze my investment portfolio and suggest optimizations' },
    { icon: DollarSign, label: 'Budget Review', prompt: 'Review my spending patterns and suggest budget improvements' },
    { icon: Target, label: 'Goal Planning', prompt: 'Help me create a financial plan for my savings goals' },
    { icon: PiggyBank, label: 'Emergency Fund', prompt: 'Assess my emergency fund and recommend improvements' },
    { icon: TrendingDown, label: 'Debt Strategy', prompt: 'Create a debt payoff strategy based on my current situation' },
    { icon: Calculator, label: 'Tax Optimization', prompt: 'Suggest tax optimization strategies for my situation' },
    { icon: Lightbulb, label: 'Money Tips', prompt: 'Give me personalized money-saving tips based on my spending' },
    { icon: Shield, label: 'Risk Assessment', prompt: 'Evaluate my financial risks and suggest protection strategies' }
  ], []);

  const OFFLINE = typeof window !== 'undefined' ? ((localStorage.getItem('aikeys_offline') ?? '1') === '1') : true;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { postMessage: postToWorker } = useWebWorker();

  const { data: insights, isLoading: insightsLoading } = useAIInsights();
  const { data: healthScore, isLoading: healthLoading } = useFinancialHealthScore();
  const { data: chatSessions } = useChatSessions();
  const { data: chatMessages } = useChatMessages(activeChatSession || undefined);

  const generateInsights = useGenerateInsights();
  const calculateHealthScore = useCalculateHealthScore();
  const dismissInsight = useDismissInsight();
  const markAsRead = useMarkInsightAsRead();
  const sendMessage = useSendChatMessage();
  const insertDemoData = useInsertDemoData();

  const voices = [
    { value: 'alloy', label: 'Alloy (Professional)' },
    { value: 'echo', label: 'Echo (Warm)' },
    { value: 'fable', label: 'Fable (Friendly)' },
    { value: 'onyx', label: 'Onyx (Deep)' },
    { value: 'nova', label: 'Nova (Clear)' },
    { value: 'shimmer', label: 'Shimmer (Bright)' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [enhancedMessages, chatMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Debounced input handler
  const debouncedChatChange = useMemo(
    () => debounce((value: string) => setChatMessage(value), 150),
    []
  );

  useEffect(() => {
    return () => debouncedChatChange.cancel();
  }, [debouncedChatChange]);

  const handleSendMessage = useCallback(async (messageText: string = chatMessage) => {
    if (!messageText.trim()) return;

    setIsProcessing(true);
    try {
      // Send to enhanced AI endpoint (mocked offline)
      let aiResponse = '';
      if (OFFLINE) {
        await new Promise((r) => setTimeout(r, 30));
        aiResponse = `Here’s a quick take: ${messageText}\n\n• Keep emergency fund at 3–6 months.\n• Allocate new savings 60/30/10 (invest/savings/fun).\n• Want me to draft a plan?`;
      } else {
        const { data, error } = await supabase.functions.invoke('ai-financial-chat', {
          body: {
            message: messageText,
            context: { insights: insights?.slice(0, 5), healthScore, recentTransactions: [], budgets: [] },
            userProfile: { riskTolerance: 'moderate', age: 30, goals: ['retirement', 'house_purchase'] }
          }
        });
        if (error) throw error;
        aiResponse = data.response || data.fallbackResponse;
      }
      
      // Add to enhanced messages
      const userMessage: EnhancedMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString()
      };

      const assistantMessage: EnhancedMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setEnhancedMessages(prev => [...prev, userMessage, assistantMessage]);

      // Generate audio if voice is enabled
      if (voiceEnabled) {
        await generateAudio(aiResponse, assistantMessage.id);
      }

      // Also send to regular chat system
      const result = await sendMessage.mutateAsync({
        message: messageText,
        sessionId: activeChatSession || undefined,
        createNewSession: !activeChatSession
      });

      if (!activeChatSession && result.sessionId) {
        setActiveChatSession(result.sessionId);
      }

      setChatMessage('');
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsProcessing(false);
    }
  }, [chatMessage, voiceEnabled, selectedVoice, activeChatSession, sendMessage, generateInsights, insights, healthScore]);

  const generateAudio = async (text: string, messageId: string) => {
    try {
      if (OFFLINE) return; // Skip TTS in offline mode
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: selectedVoice }
      });
      if (error) throw error;
      const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setEnhancedMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, audioUrl } : msg));
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Audio = (e.target?.result as string).split(',')[1];
        
        if (OFFLINE) {
          const transcribedText = '[voice] Quick budget check';
          setChatMessage(transcribedText);
          toast.success('Voice transcribed!');
          if (voiceEnabled && transcribedText.trim()) {
            await handleSendMessage(transcribedText);
          }
        } else {
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });
          if (error) throw error;
          const transcribedText = data.text;
          setChatMessage(transcribedText);
          toast.success('Voice transcribed!');
          if (voiceEnabled && transcribedText.trim()) {
            await handleSendMessage(transcribedText);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (messageId: string, audioUrl: string) => {
    const audio = new Audio(audioUrl);
    
    setEnhancedMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : msg
      )
    );

    audio.onended = () => {
      setEnhancedMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isPlaying: false } : msg
        )
      );
    };

    audio.play();
  };

  const handleQuickAction = useCallback((prompt: string) => {
    setChatMessage(prompt);
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  const handleChatInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedChatChange(e.target.value);
  }, [debouncedChatChange]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Enhanced AI Financial Assistant
          </h1>
          <p className="text-muted-foreground">
            Advanced AI-powered financial advisor with voice interaction and real-time insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => insertDemoData.mutate()}
            disabled={insertDemoData.isPending}
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
          >
            {insertDemoData.isPending ? 'Loading...' : 'Load Demo Data'}
          </Button>
          <Button
            onClick={() => generateInsights.mutate()}
            disabled={generateInsights.isPending}
            variant="outline"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Enhanced Chat</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="health">Financial Health</TabsTrigger>
          <TabsTrigger value="settings">Voice Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Financial Actions</CardTitle>
              <CardDescription>
                Get instant AI advice on common financial topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isProcessing}
                  >
                    <action.icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
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
                    onClick={() => {
                      setActiveChatSession(null);
                      setEnhancedMessages([]);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    New Enhanced Chat
                  </Button>
                  {chatSessions?.map((session) => (
                    <Button
                      key={session.id}
                      variant={activeChatSession === session.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveChatSession(session.id)}
                    >
                      <div className="truncate">
                        {session.title || 'Financial Chat'}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Enhanced AI Financial Advisor
                  {voiceEnabled && <Badge variant="secondary">Voice Enabled</Badge>}
                </CardTitle>
                <CardDescription>
                  Advanced conversational AI with voice interaction and personalized insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {enhancedMessages.length > 0 ? (
                    enhancedMessages.map((message) => (
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
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                            {message.audioUrl && message.role === 'assistant' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => playAudio(message.id, message.audioUrl!)}
                                disabled={message.isPlaying}
                              >
                                {message.isPlaying ? (
                                  <Pause className="h-3 w-3" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to Enhanced AI Chat</h3>
                      <p className="text-muted-foreground mb-4">
                        Ask me anything about your finances, investments, budgeting, or use the quick actions above
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={chatMessage}
                      onChange={handleChatInputChange}
                      placeholder="Ask about your finances, investments, budgeting..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isProcessing}
                    />
                  </div>
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant="outline"
                    size="icon"
                    disabled={isProcessing}
                    className={isRecording ? 'text-red-500' : ''}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || !chatMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Financial Insights</CardTitle>
              <CardDescription>
                Advanced analytics and personalized recommendations
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
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Sparkles className="h-4 w-4" />
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate AI insights to get personalized financial recommendations
                  </p>
                  <Button onClick={() => generateInsights.mutate()} disabled={generateInsights.isPending}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analysis of your financial wellness
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
                        <div className="text-2xl font-bold text-insight-spending mb-1">
                          {healthScore.spending_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Spending</p>
                        <Progress value={healthScore.spending_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-insight-saving mb-1">
                          {healthScore.saving_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Saving</p>
                        <Progress value={healthScore.saving_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-metric-warning mb-1">
                          {healthScore.debt_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Debt</p>
                        <Progress value={healthScore.debt_score} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-insight-investment mb-1">
                          {healthScore.investment_score}
                        </div>
                        <p className="text-sm text-muted-foreground">Investment</p>
                        <Progress value={healthScore.investment_score} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No health score yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Calculate your financial health score to track your progress
                  </p>
                  <Button onClick={() => calculateHealthScore.mutate()} disabled={calculateHealthScore.isPending}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Calculate Health Score
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice & AI Settings</CardTitle>
              <CardDescription>
                Customize your AI assistant experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-enabled">Voice Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable text-to-speech for AI responses
                  </p>
                </div>
                <Switch
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Voice Selection</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose the voice that sounds best for your AI assistant
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Voice Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Click the microphone to record voice questions</li>
                  <li>• Enable voice responses to hear AI answers</li>
                  <li>• Use quick actions for instant financial advice</li>
                  <li>• Voice input automatically sends when recording stops</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};