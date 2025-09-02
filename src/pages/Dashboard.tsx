import React, { useState, useEffect } from 'react';
import { useKeysPayAuth } from '@/contexts/KeysPayAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  ArrowUpDown, 
  Activity, 
  Eye, 
  EyeOff,
  Plus,
  Send,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  user: {
    id: string;
    email: string;
    profile: any;
  };
  organizations: any[];
  balances: Array<{
    account_id: string;
    account_name: string;
    currency: string;
    balance: number;
    account_type: string;
    organization_id: string;
  }>;
  recentActivity: any[];
  region: string;
  features: {
    crypto: boolean;
    cards: boolean;
    uae_transfers: boolean;
    demo_mode: boolean;
  };
}

const Dashboard = () => {
  const { user, session } = useKeysPayAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, session]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTotalBalance = () => {
    if (!userData?.balances) return { AED: 0, USD: 0 };
    
    return userData.balances.reduce((acc, balance) => {
      acc[balance.currency] = (acc[balance.currency] || 0) + balance.balance;
      return acc;
    }, {} as Record<string, number>);
  };

  const getBalanceChangeIcon = (type: string) => {
    return type === 'asset' ? ArrowUpRight : ArrowDownRight;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 bg-muted animate-pulse rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-destructive">Error loading dashboard</div>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalances = getTotalBalance();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{userData?.user.profile?.first_name ? `, ${userData.user.profile.first_name}` : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {userData?.features.demo_mode && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Demo Mode
            </Badge>
          )}
          <Badge variant="secondary">{userData?.region}</Badge>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AED Balance</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? formatCurrency(totalBalances.AED || 0, 'AED') : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Primary account balance
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USD Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? formatCurrency(totalBalances.USD || 0, 'USD') : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Multi-currency account
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Virtual & Physical cards
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.organizations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Business accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your crypto, cards, and transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/crypto')}
              className="h-auto p-6 flex-col space-y-2"
              variant="outline"
              disabled={!userData?.features.crypto}
            >
              <TrendingUp className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Buy Crypto</div>
                <div className="text-sm text-muted-foreground">Via Guardarian</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/cards')}
              className="h-auto p-6 flex-col space-y-2"
              variant="outline"
              disabled={!userData?.features.cards}
            >
              <CreditCard className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Issue Card</div>
                <div className="text-sm text-muted-foreground">Virtual/Physical</div>
                {userData?.features.cards && (
                  <Badge variant="secondary" className="mt-1">Beta</Badge>
                )}
              </div>
            </Button>

            <Button
              onClick={() => navigate('/transfers')}
              className="h-auto p-6 flex-col space-y-2"
              variant="outline"
              disabled={!userData?.features.uae_transfers}
            >
              <ArrowUpDown className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">UAE Transfer</div>
                <div className="text-sm text-muted-foreground">Via Wio Bank</div>
                {userData?.features.uae_transfers && (
                  <Badge variant="secondary" className="mt-1">UAE</Badge>
                )}
              </div>
            </Button>

            <Button
              onClick={() => navigate('/activity')}
              className="h-auto p-6 flex-col space-y-2"
              variant="outline"
            >
              <Activity className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">View Activity</div>
                <div className="text-sm text-muted-foreground">Transaction history</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Balances Detail */}
      {userData?.balances && userData.balances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription>
              Detailed view of all your accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.balances.map((balance) => {
                const ChangeIcon = getBalanceChangeIcon(balance.account_type);
                return (
                  <div key={balance.account_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <ChangeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{balance.account_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {balance.account_type} • {balance.currency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {showBalances ? formatCurrency(balance.balance, balance.currency) : '••••••'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userData?.recentActivity && userData.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {userData.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-muted rounded-full">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.description || 'Transaction'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {activity.debit_amount && `+${formatCurrency(activity.debit_amount, activity.currency)}`}
                      {activity.credit_amount && `-${formatCurrency(activity.credit_amount, activity.currency)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>No recent activity</div>
              <div className="text-sm">Your transactions will appear here</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;