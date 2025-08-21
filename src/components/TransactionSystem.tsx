/*
 * AIKEYS FINANCIAL PLATFORM - FINANCIAL TRANSACTION SYSTEM
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * Comprehensive Financial Transaction Management
 */

import React, { useState } from 'react';
import { 
  Send, ArrowUpRight, ArrowDownLeft, CreditCard, Clock, Filter, 
  Search, Download, Calendar, TrendingUp, PieChart, DollarSign,
  Receipt, Zap, Repeat, Settings, Eye, EyeOff, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/MockAuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { TransferDialog } from './TransferDialog';
import { BillPaymentDialog } from './BillPaymentDialog';
import { QuickTransferDialog } from './QuickTransferDialog';

interface TransactionSystemProps {
  className?: string;
}

export const TransactionSystem: React.FC<TransactionSystemProps> = ({ className }) => {
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions();
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showBillPaymentDialog, setShowBillPaymentDialog] = useState(false);
  const [showQuickTransferDialog, setShowQuickTransferDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('30days');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBalances, setShowBalances] = useState(true);

  // Filter transactions based on selected filters
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesAccount = selectedAccount === 'all' || transaction.account_id === selectedAccount;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering
    const now = new Date();
    const transactionDate = new Date(transaction.created_at);
    let matchesDate = true;
    
    switch (dateFilter) {
      case '7days':
        matchesDate = transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        matchesDate = transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        matchesDate = transactionDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }
    
    return matchesAccount && matchesCategory && matchesSearch && matchesDate;
  }) || [];

  // Calculate spending analytics
  const totalIncome = filteredTransactions
    .filter(t => t.transaction_type === 'credit' || t.amount > 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.transaction_type === 'debit' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Category breakdown
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Other';
    const amount = Math.abs(transaction.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

  const getTransactionIcon = (transaction: any) => {
    if (transaction.transaction_type === 'credit' || transaction.amount > 0) {
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const getTransactionColor = (transaction: any) => {
    if (transaction.transaction_type === 'credit' || transaction.amount > 0) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Transactions</h1>
          <p className="text-muted-foreground">
            Manage your money with smart transactions and analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            size="sm"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button onClick={() => setShowQuickTransferDialog(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Quick Transfer
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {showBalances ? `$${totalBalance.toLocaleString()}` : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {accounts?.length || 0} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Income (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {showBalances ? `$${totalIncome.toLocaleString()}` : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredTransactions.filter(t => t.amount > 0).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-red-600" />
              Expenses (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {showBalances ? `$${totalExpenses.toLocaleString()}` : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredTransactions.filter(t => t.amount < 0).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-600" />
              Net Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {showBalances ? formatAmount(totalIncome - totalExpenses) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setShowTransferDialog(true)}
              className="h-20 flex-col gap-2"
            >
              <Send className="h-5 w-5" />
              Send Money
            </Button>
            
            <Button 
              onClick={() => setShowBillPaymentDialog(true)}
              variant="outline" 
              className="h-20 flex-col gap-2"
            >
              <Receipt className="h-5 w-5" />
              Pay Bills
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Repeat className="h-5 w-5" />
              Recurring
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ArrowDownLeft className="h-5 w-5" />
              Request Money
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Transaction Interface */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_number} ({account.account_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Transaction List */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                              {getTransactionIcon(transaction)}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                                {transaction.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {transaction.category}
                                  </Badge>
                                )}
                                {transaction.recipient && (
                                  <span>• {transaction.recipient}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${getTransactionColor(transaction)}`}>
                              {formatAmount(transaction.amount)}
                            </div>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryData)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([category, amount]) => {
                      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span className="font-medium">
                              {showBalances ? `$${amount.toLocaleString()}` : '••••'}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-xs text-muted-foreground text-right">
                            {percentage.toFixed(1)}% of total spending
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Average Income</div>
                      <div className="text-2xl font-bold text-green-700">
                        {showBalances ? `$${(totalIncome / 4).toLocaleString()}` : '••••••'}
                      </div>
                      <div className="text-xs text-green-600">per week</div>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-red-600 font-medium">Average Spending</div>
                      <div className="text-2xl font-bold text-red-700">
                        {showBalances ? `$${(totalExpenses / 4).toLocaleString()}` : '••••••'}
                      </div>
                      <div className="text-xs text-red-600">per week</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Savings Rate</div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0} 
                        className="flex-1 h-3"
                      />
                      <span className="text-sm font-medium">
                        {totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled transactions</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule a Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <TransferDialog 
        open={showTransferDialog} 
        onClose={() => setShowTransferDialog(false)} 
      />
      
      <BillPaymentDialog 
        open={showBillPaymentDialog} 
        onClose={() => setShowBillPaymentDialog(false)} 
      />
      
      <QuickTransferDialog 
        open={showQuickTransferDialog} 
        onClose={() => setShowQuickTransferDialog(false)} 
      />
    </div>
  );
};