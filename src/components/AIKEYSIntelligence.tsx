import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Send, 
  Sparkles,
  Zap,
  Target,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  CreditCard,
  Shield,
  Bell,
  Calendar,
  Clock,
  Users,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Upload,
  Star,
  Lightbulb,
  TrendingDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'spending' | 'saving' | 'investment' | 'risk' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionItems: string[];
  estimatedImpact: string;
  createdAt: string;
}

interface PortfolioAnalysis {
  totalValue: number;
  monthlyGrowth: number;
  diversificationScore: number;
  riskScore: number;
  recommendations: string[];
}

interface SmartAlert {
  id: string;
  type: 'price' | 'portfolio' | 'spending' | 'opportunity';
  message: string;
  threshold: number;
  isActive: boolean;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Optimize Crypto Allocation',
    description: 'Your Bitcoin allocation is 15% above recommended diversification levels. Consider rebalancing.',
    type: 'investment',
    priority: 'medium',
    confidence: 87,
    actionItems: ['Reduce BTC by 10%', 'Increase ETH allocation', 'Add SOL position'],
    estimatedImpact: '$2,400 potential annual savings',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Recurring Spending Pattern',
    description: 'You spend 23% more on dining out compared to similar users. AI suggests setting a monthly limit.',
    type: 'spending',
    priority: 'high',
    confidence: 94,
    actionItems: ['Set $800 monthly dining budget', 'Use grocery delivery instead', 'Track meal prep savings'],
    estimatedImpact: '$280 monthly savings potential',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    title: 'Staking Opportunity',
    description: 'Your idle USDC could earn 8.5% APY through our insured staking program.',
    type: 'opportunity',
    priority: 'medium',
    confidence: 96,
    actionItems: ['Stake $5,000 USDC', 'Enable auto-compound', 'Monitor returns monthly'],
    estimatedImpact: '$425 annual passive income',
    createdAt: '2024-01-15T08:45:00Z'
  }
];

const mockPortfolio: PortfolioAnalysis = {
  totalValue: 125750,
  monthlyGrowth: 8.3,
  diversificationScore: 72,
  riskScore: 68,
  recommendations: [
    'Consider adding real estate exposure through REITs',
    'Increase stable coin allocation for reduced volatility',
    'Set up DCA strategy for consistent growth'
  ]
};

export const AIKEYSIntelligence = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [portfolio] = useState<PortfolioAnalysis>(mockPortfolio);
  const [chatMessage, setChatMessage] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoInvestAmount, setAutoInvestAmount] = useState([500]);
  const [riskTolerance, setRiskTolerance] = useState([5]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([
    { id: '1', type: 'price', message: 'BTC price drops below $40,000', threshold: 40000, isActive: true },
    { id: '2', type: 'portfolio', message: 'Portfolio value increases by 10%', threshold: 10, isActive: true },
    { id: '3', type: 'spending', message: 'Monthly spending exceeds budget by 20%', threshold: 20, isActive: false }
  ]);

  const handleDismissInsight = (id: string) => {
    setInsights(insights.filter(insight => insight.id !== id));
    toast.success('Insight dismissed');
  };

  const handleImplementAction = (insight: AIInsight) => {
    toast.success(`Implementing recommendations for: ${insight.title}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-metric-warning text-white';
      case 'medium': return 'bg-metric-info text-white';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spending': return <CreditCard className="h-4 w-4" />;
      case 'saving': return <DollarSign className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'risk': return <Shield className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice input activated');
    } else {
      toast.success('Voice input deactivated');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AIKEYS Intelligence
          </h1>
          <p className="text-muted-foreground">
            Advanced AI-powered financial insights and wealth optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-green-600">
                +{portfolio.monthlyGrowth}% this month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary">
                {insights.filter(i => i.priority === 'high').length} high priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Diversification</p>
                <p className="text-2xl font-bold">{portfolio.diversificationScore}/100</p>
              </div>
              <PieChart className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={portfolio.diversificationScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{portfolio.riskScore}/100</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={portfolio.riskScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          <TabsTrigger value="optimization">Portfolio Optimization</TabsTrigger>
          <TabsTrigger value="automation">Smart Automation</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Financial Insights</CardTitle>
              <CardDescription>
                AI-generated recommendations based on your financial behavior and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                            {getTypeIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{insight.title}</h3>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            <div className="text-sm font-medium text-green-600">
                              {insight.estimatedImpact}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleImplementAction(insight)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissInsight(insight.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {insight.actionItems.map((action, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Financial Advisor
              </CardTitle>
              <CardDescription>
                Chat with your personal AI advisor for instant financial guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/20">
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <p className="text-sm">Hello! I'm your AI financial advisor. I've analyzed your portfolio and have some insights to share. How can I help you today?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 rounded-lg bg-primary text-primary-foreground">
                    <p className="text-sm">What's the best strategy for my crypto investments this month?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <p className="text-sm">Based on current market conditions and your risk profile, I recommend a 60/30/10 allocation: 60% established coins (BTC, ETH), 30% DeFi tokens, and 10% experimental positions. Would you like specific recommendations?</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your AI advisor anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleVoiceInput}
                  className={isListening ? 'bg-red-500 text-white' : ''}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">Portfolio Analysis</Button>
                <Button variant="outline" size="sm">Market Trends</Button>
                <Button variant="outline" size="sm">Risk Assessment</Button>
                <Button variant="outline" size="sm">Tax Optimization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Portfolio Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Diversification Score</span>
                    <span className="font-medium">{portfolio.diversificationScore}/100</span>
                  </div>
                  <Progress value={portfolio.diversificationScore} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Score</span>
                    <span className="font-medium">{portfolio.riskScore}/100</span>
                  </div>
                  <Progress value={portfolio.riskScore} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Growth Potential</span>
                    <span className="font-medium">85/100</span>
                  </div>
                  <Progress value={85} />
                </div>
                
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Portfolio
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Automation
                </CardTitle>
                <CardDescription>
                  Set up automated investing and rebalancing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-Invest</span>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Amount: ${autoInvestAmount[0]}</label>
                    <Slider
                      value={autoInvestAmount}
                      onValueChange={setAutoInvestAmount}
                      max={2000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Risk Tolerance: {riskTolerance[0]}/10</label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-Rebalance</span>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tax-Loss Harvesting</span>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Automation Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Smart Alerts
                </CardTitle>
                <CardDescription>
                  Customize your AI-powered notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {smartAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.type} • Threshold: {alert.threshold}
                      </div>
                    </div>
                    <Switch 
                      checked={alert.isActive}
                      onCheckedChange={(checked) => {
                        setSmartAlerts(smartAlerts.map(a => 
                          a.id === alert.id ? { ...a, isActive: checked } : a
                        ));
                      }}
                    />
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Add New Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Preferences
              </CardTitle>
              <CardDescription>
                Customize how your AI assistant works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Communication Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Responses</span>
                    <Switch checked={isVoiceEnabled} onCheckedChange={setIsVoiceEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Reports</span>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Updates</span>
                    <Switch checked={true} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">AI Behavior</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conservative Advice</span>
                    <Switch checked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Proactive Suggestions</span>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Advanced Analytics</span>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Learning Mode</span>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Share Anonymous Usage Data</span>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Personalized Insights</span>
                  <Switch checked={true} />
                </div>
              </div>
              
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};