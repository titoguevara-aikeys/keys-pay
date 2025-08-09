import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3, 
  Target, AlertTriangle, Plus, Zap, Brain, Activity, Eye, Download,
  ArrowUpRight, ArrowDownRight, Sparkles, Shield, Award, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
  ComposedChart, RadialBarChart, RadialBar, PieChart as RechartsPieChart,
  Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';

const EnhancedAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const { data: transactions = [] } = useTransactions();
  const { data: accounts = [] } = useAccounts();

  // Enhanced mock data with predictive analytics
  const analyticsData = {
    totalSpent: 3247.85,
    totalIncome: 5500.00,
    savingsRate: 41,
    financialHealthScore: 78,
    predictionAccuracy: 92,
    
    // Monthly spending data with predictions
    spendingTrend: [
      { month: 'Aug 2024', actual: 3200, predicted: 3180, budget: 3500 },
      { month: 'Sep 2024', actual: 3450, predicted: 3420, budget: 3500 },
      { month: 'Oct 2024', actual: 3247, predicted: 3280, budget: 3500 },
      { month: 'Nov 2024', actual: 2890, predicted: 2920, budget: 3500 },
      { month: 'Dec 2024', actual: 3100, predicted: 3150, budget: 3500 },
      { month: 'Jan 2025', actual: null, predicted: 3240, budget: 3500 },
      { month: 'Feb 2025', actual: null, predicted: 3180, budget: 3500 },
    ],

    // Cash flow analysis
    cashFlow: [
      { month: 'Aug', income: 5500, expenses: 3200, savings: 2300 },
      { month: 'Sep', income: 5500, expenses: 3450, savings: 2050 },
      { month: 'Oct', income: 5800, expenses: 3247, savings: 2553 },
      { month: 'Nov', income: 5200, expenses: 2890, savings: 2310 },
      { month: 'Dec', income: 5500, expenses: 3100, savings: 2400 },
      { month: 'Jan', income: 5600, expenses: 3240, savings: 2360 },
    ],

    // Category insights with trends
    categoryInsights: [
      { 
        name: 'Groceries', 
        amount: 850.23, 
        percentage: 26.2, 
        trend: '+5%', 
        prediction: 892.74,
        healthScore: 85,
        riskLevel: 'low'
      },
      { 
        name: 'Transportation', 
        amount: 425.67, 
        percentage: 13.1, 
        trend: '-8%', 
        prediction: 391.62,
        healthScore: 92,
        riskLevel: 'low'
      },
      { 
        name: 'Entertainment', 
        amount: 312.45, 
        percentage: 9.6, 
        trend: '+15%', 
        prediction: 359.32,
        healthScore: 65,
        riskLevel: 'medium'
      },
      { 
        name: 'Utilities', 
        amount: 289.50, 
        percentage: 8.9, 
        trend: '+2%', 
        prediction: 295.29,
        healthScore: 88,
        riskLevel: 'low'
      },
      { 
        name: 'Shopping', 
        amount: 524.78, 
        percentage: 16.2, 
        trend: '+28%', 
        prediction: 671.72,
        healthScore: 45,
        riskLevel: 'high'
      },
    ],

    // Financial health metrics
    healthMetrics: {
      spendingPatterns: 78,
      savingsGrowth: 85,
      budgetAdherence: 72,
      debtManagement: 90,
      emergencyFund: 65,
    },

    // AI insights and recommendations
    aiInsights: [
      {
        type: 'opportunity',
        title: 'Optimize Shopping Spending',
        description: 'You could save $200/month by reducing impulse purchases',
        confidence: 94,
        impact: 'high',
        action: 'Set shopping budget alerts',
        icon: Sparkles,
      },
      {
        type: 'warning',
        title: 'Entertainment Budget Trending Up',
        description: 'Entertainment spending increased 15% this month',
        confidence: 87,
        impact: 'medium',
        action: 'Review entertainment subscriptions',
        icon: AlertTriangle,
      },
      {
        type: 'positive',
        title: 'Transportation Savings Success',
        description: 'Great job reducing transportation costs by 8%',
        confidence: 96,
        impact: 'medium',
        action: 'Continue current habits',
        icon: Award,
      },
    ],

    // Spending patterns analysis
    spendingPatterns: [
      { hour: '6AM', amount: 12 },
      { hour: '9AM', amount: 45 },
      { hour: '12PM', amount: 78 },
      { hour: '3PM', amount: 34 },
      { hour: '6PM', amount: 89 },
      { hour: '9PM', amount: 23 },
    ],

    // Goals tracking
    financialGoals: [
      {
        name: 'Emergency Fund',
        target: 10000,
        current: 8000,
        progress: 80,
        deadline: '2025-06-01',
        onTrack: true,
      },
      {
        name: 'Vacation Fund',
        target: 3000,
        current: 1200,
        progress: 40,
        deadline: '2025-08-01',
        onTrack: false,
      },
      {
        name: 'Investment Portfolio',
        target: 25000,
        current: 15600,
        progress: 62,
        deadline: '2025-12-31',
        onTrack: true,
      },
    ],
  };

  const netIncome = analyticsData.totalIncome - analyticsData.totalSpent;
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#ff6b6b', '#4ecdc4', '#45b7d1'];

  return (
    <div className="space-y-8">
      {/* Enhanced Header with AI Insights */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Advanced insights and predictions for your financial health
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="spending">Spending Focus</SelectItem>
              <SelectItem value="savings">Savings Focus</SelectItem>
              <SelectItem value="predictions">Predictions</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Health Score */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Financial Health Score
              </CardTitle>
              <CardDescription>
                AI-powered assessment of your financial wellbeing
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {analyticsData.financialHealthScore}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(analyticsData.healthMetrics).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${analyticsData.totalIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${analyticsData.totalSpent.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-green-600 mr-1" />
              -5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${netIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              {analyticsData.savingsRate}% savings rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Prediction Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.predictionAccuracy}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-purple-600 mr-1" />
              Highly accurate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Cash Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Income, expenses, and savings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={analyticsData.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`$${value}`, name]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
                      <Bar dataKey="expenses" fill="#ff6b6b" name="Expenses" />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        name="Savings"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Spending Analysis</CardTitle>
                <CardDescription>Detailed breakdown with risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryInsights.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{category.name}</span>
                          <Badge 
                            variant={category.riskLevel === 'high' ? 'destructive' : category.riskLevel === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {category.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${category.amount.toFixed(2)}</p>
                          <p className={`text-xs ${category.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                            {category.trend}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Spending Predictions
                </CardTitle>
                <CardDescription>
                  AI-powered spending forecasts vs actual data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.spendingTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`$${value}`, name]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="Actual Spending"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#ff6b6b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted Spending"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="budget" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={1}
                        name="Budget Limit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Month Predictions</CardTitle>
                <CardDescription>Estimated spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryInsights.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Health Score: {category.healthScore}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${category.prediction.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">predicted</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.aiInsights.map((insight, index) => (
              <Card key={index} className={`${
                insight.type === 'opportunity' ? 'border-green-200 bg-green-50/50' :
                insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50/50' :
                'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                      insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <insight.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Confidence:</span>
                      <span className="font-medium">{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                    <div className="flex items-center justify-between">
                      <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                        {insight.impact} impact
                      </Badge>
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Patterns by Time */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Spending Patterns</CardTitle>
                <CardDescription>When you spend money throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.spendingPatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Average Spending']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary)/0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pattern Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Behavior Analysis</CardTitle>
                <CardDescription>Key insights about your spending habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">6PM</div>
                      <div className="text-sm text-muted-foreground">Peak spending hour</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Fri</div>
                      <div className="text-sm text-muted-foreground">Highest spending day</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Impulse Purchases</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Budget Adherence</span>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Seasonal Trends</span>
                      <Badge variant="outline">Stable</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.financialGoals.map((goal, index) => (
              <Card key={goal.name} className={goal.onTrack ? 'border-green-200' : 'border-yellow-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <Badge variant={goal.onTrack ? 'default' : 'secondary'}>
                      {goal.onTrack ? 'On Track' : 'Behind'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Target: ${goal.target.toLocaleString()} by {new Date(goal.deadline).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {goal.progress}% complete
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        ${((goal.target - goal.current) / 6).toFixed(0)}/month needed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;