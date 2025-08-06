import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Flag, 
  Check, 
  X, 
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const AdminTransactionMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock transaction data
  const transactions = [
    {
      id: 'TX001234',
      from: 'john.doe@example.com',
      to: 'jane.smith@example.com',
      amount: 250.00,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      timestamp: '2024-01-20 14:30:22',
      flagged: false,
      riskScore: 15
    },
    {
      id: 'TX001235',
      from: 'mike.johnson@example.com',
      to: 'External Bank',
      amount: 5000.00,
      currency: 'USD',
      type: 'withdrawal',
      status: 'flagged',
      timestamp: '2024-01-20 14:25:18',
      flagged: true,
      riskScore: 85
    },
    {
      id: 'TX001236',
      from: 'sarah.wilson@example.com',
      to: 'Merchant ABC',
      amount: 89.99,
      currency: 'USD',
      type: 'payment',
      status: 'completed',
      timestamp: '2024-01-20 14:20:45',
      flagged: false,
      riskScore: 10
    },
    {
      id: 'TX001237',
      from: 'External Deposit',
      to: 'alex.brown@example.com',
      amount: 10000.00,
      currency: 'USD',
      type: 'deposit',
      status: 'pending',
      timestamp: '2024-01-20 14:15:32',
      flagged: true,
      riskScore: 75
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume (24h)</p>
                <p className="text-2xl font-bold">$2,847,293</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions (24h)</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Monitor */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Monitor</CardTitle>
          <CardDescription>Real-time transaction monitoring and fraud detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('flagged')}>
                    Flagged Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('high-risk')}>
                    High Risk
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('large-amounts')}>
                    Large Amounts (&gt;$1000)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Export Report</Button>
              <Button>Real-time View</Button>
            </div>
          </div>

          {/* Transactions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className={transaction.flagged ? 'bg-red-50 border-red-200' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {transaction.id}
                      </code>
                      {transaction.flagged && (
                        <Flag className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{transaction.from}</p>
                      <p className="text-muted-foreground">→ {transaction.to}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-mono">
                      ${transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{transaction.riskScore}</span>
                      {getRiskBadge(transaction.riskScore)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {transaction.timestamp}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {transaction.status === 'pending' && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {!transaction.flagged ? (
                          <DropdownMenuItem className="text-yellow-600">
                            <Flag className="h-4 w-4 mr-2" />
                            Flag Transaction
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Clear Flag
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};