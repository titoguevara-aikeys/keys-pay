import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface MonthlyTrendsProps {
  data: MonthlyData[];
}

export const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ data }) => {
  const enhancedData = data.map(item => ({
    ...item,
    savings: item.income - item.expenses,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
        <CardDescription>Track your financial performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enhancedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Savings']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(142.1 76.2% 36.3%)" 
                strokeWidth={3}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              ${data[data.length - 1]?.income.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Latest Income</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'hsl(142.1 76.2% 36.3%)' }}>
              ${data[data.length - 1]?.expenses.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Latest Expenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              ${(data[data.length - 1]?.income - data[data.length - 1]?.expenses).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Latest Savings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};