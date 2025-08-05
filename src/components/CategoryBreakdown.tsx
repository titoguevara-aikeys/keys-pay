import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  name: string;
  amount: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  categories: Category[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
];

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  const pieData = categories.map((category, index) => ({
    ...category,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Visual breakdown of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']}
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
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Detailed breakdown of spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${category.amount}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};