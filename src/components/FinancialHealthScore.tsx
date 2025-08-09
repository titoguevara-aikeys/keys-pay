import React, { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Info, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';

interface HealthMetric {
  name: string;
  score: number;
  weight: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendation: string;
}

interface FinancialHealthScoreProps {
  userTransactions?: any[];
  userAccounts?: any[];
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ 
  userTransactions = [], 
  userAccounts = [] 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Financial health metrics with scoring logic
  const healthMetrics: HealthMetric[] = [
    {
      name: 'Spending Patterns',
      score: 78,
      weight: 0.25,
      status: 'good',
      description: 'How consistent and predictable your spending habits are',
      recommendation: 'Consider setting up automatic bill payments to improve consistency'
    },
    {
      name: 'Savings Growth',
      score: 85,
      weight: 0.3,
      status: 'excellent',
      description: 'Your ability to grow savings over time',
      recommendation: 'Excellent progress! Consider increasing your emergency fund target'
    },
    {
      name: 'Budget Adherence',
      score: 72,
      weight: 0.2,
      status: 'good',
      description: 'How well you stick to your planned budgets',
      recommendation: 'Try setting alerts when you reach 80% of category budgets'
    },
    {
      name: 'Debt Management',
      score: 90,
      weight: 0.15,
      status: 'excellent',
      description: 'Your debt-to-income ratio and payment history',
      recommendation: 'Outstanding debt management! Keep up the good work'
    },
    {
      name: 'Emergency Fund',
      score: 65,
      weight: 0.1,
      status: 'fair',
      description: 'Coverage for unexpected expenses',
      recommendation: 'Aim to build 3-6 months of expenses in emergency savings'
    }
  ];

  // Calculate overall health score
  const overallScore = Math.round(
    healthMetrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'poor':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  // Data for radial chart
  const radialData = [
    {
      name: 'Score',
      value: overallScore,
      fill: overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'
    }
  ];

  // Data for breakdown pie chart
  const pieData = healthMetrics.map((metric, index) => ({
    name: metric.name,
    value: metric.score,
    weight: metric.weight * 100,
    fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Financial Health Score
              </CardTitle>
              <CardDescription>
                AI-powered comprehensive assessment of your financial wellbeing
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
              {getScoreBadge(overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : overallScore >= 40 ? 'fair' : 'poor')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radial Score Display */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      className="radial-bar"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Key Insights</h3>
              <div className="space-y-3">
                {healthMetrics
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(metric.status)}
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}
                        </span>
                        {getScoreBadge(metric.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="trends">Score Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthMetrics.map((metric) => (
              <Card key={metric.name} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedMetric(selectedMetric === metric.name ? null : metric.name)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      {metric.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score}
                      </span>
                      {getScoreBadge(metric.status)}
                    </div>
                  </div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Weight in overall score:</span>
                      <span className="font-medium">{(metric.weight * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={metric.score} className="h-3" />
                    {selectedMetric === metric.name && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Recommendation:</h4>
                        <p className="text-sm text-muted-foreground">{metric.recommendation}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>How each metric contributes to your overall score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="weight"
                        label={({ name, weight }) => `${name}: ${weight.toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any, name: any) => [`${parseFloat(value).toFixed(1)}%`, 'Weight']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Trends</CardTitle>
                <CardDescription>Your financial health score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Historical data will appear here as you use the app</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics
              .filter(metric => metric.score < 80)
              .map((metric) => (
                <Card key={metric.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                        <CardDescription>Score: {metric.score}/100</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{metric.recommendation}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Potential improvement:</span>
                        <span className="text-green-600 font-medium">+{Math.min(20, 100 - metric.score)} points</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Take Action
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {healthMetrics.filter(metric => metric.score < 80).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Excellent Financial Health!</h3>
                <p className="text-muted-foreground">
                  All your financial metrics are performing well. Keep up the great work!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialHealthScore;