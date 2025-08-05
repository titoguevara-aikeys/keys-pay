import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  User, 
  Plus, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { SendAppLink } from '@/components/SendAppLink';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Index = () => {
  const { user, signOut } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  // Mock data for demonstration
  const accounts = [
    { id: 1, name: 'Main Account', balance: 2456.78, type: 'checking' },
    { id: 2, name: 'Savings', balance: 8920.45, type: 'savings' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Coffee Shop', amount: -4.50, date: '2024-01-05', type: 'debit' },
    { id: 2, description: 'Salary Deposit', amount: 3500.00, date: '2024-01-01', type: 'credit' },
    { id: 3, description: 'Grocery Store', amount: -67.32, date: '2023-12-30', type: 'debit' },
    { id: 4, description: 'Transfer from Savings', amount: 200.00, date: '2023-12-28', type: 'credit' },
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Navigation */}
      <Navigation />
      
      {/* User Info Header */}
      <header className="bg-background/50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <p className="text-sm text-muted-foreground">Welcome back, {user?.email?.split('@')[0]}</p>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Total Balance</CardTitle>
                <CardDescription>Across all your accounts</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-6">
              {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-16 flex-col gap-2">
                <Send className="h-5 w-5" />
                Send Money
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <ArrowDownLeft className="h-5 w-5" />
                Request
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Plus className="h-5 w-5" />
                Add Money
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => window.location.href = '/cards'}
              >
                <CreditCard className="h-5 w-5" />
                Cards
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Accounts */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="accounts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="accounts" className="space-y-4">
                {accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{account.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{account.type} account</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {showBalance ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            View Details <ArrowUpRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full h-16 border-dashed">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Account
                </Button>
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <ArrowDownLeft className="h-4 w-4" /> : 
                              <ArrowUpRight className="h-4 w-4" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Transactions
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Virtual Cards</CardTitle>
                <CardDescription>Manage your digital payment cards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Main Card</span>
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">•••• •••• •••• 1234</p>
                  <p className="text-lg font-semibold">$2,456.78</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/cards'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Cards
                </Button>
              </CardContent>
            </Card>

            {/* Send App Link */}
            <SendAppLink />

            {/* Family Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Controls</CardTitle>
                <CardDescription>Manage family member access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">You (Parent)</p>
                      <p className="text-xs text-muted-foreground">Full Access</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/family'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Family
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;