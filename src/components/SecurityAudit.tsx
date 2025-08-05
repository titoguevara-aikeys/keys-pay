import React, { useState } from 'react';
import { History, AlertTriangle, Shield, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'settings_change' | 'suspicious' | 'device_new';
  description: string;
  timestamp: string;
  ip_address: string;
  location: string;
  risk_score: number;
  blocked: boolean;
}

export const SecurityAudit: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('7d');
  
  // Mock security events data
  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login from Chrome browser',
      timestamp: '2024-01-05T10:30:00Z',
      ip_address: '192.168.1.100',
      location: 'New York, USA',
      risk_score: 0,
      blocked: false,
    },
    {
      id: '2',
      type: 'transaction',
      description: 'High-value transaction initiated',
      timestamp: '2024-01-05T09:15:00Z',
      ip_address: '192.168.1.100',
      location: 'New York, USA',
      risk_score: 3,
      blocked: false,
    },
    {
      id: '3',
      type: 'suspicious',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-01-04T22:45:00Z',
      ip_address: '203.0.113.45',
      location: 'Unknown Location',
      risk_score: 8,
      blocked: true,
    },
    {
      id: '4',
      type: 'device_new',
      description: 'New device registered',
      timestamp: '2024-01-04T14:20:00Z',
      ip_address: '192.168.1.100',
      location: 'New York, USA',
      risk_score: 2,
      blocked: false,
    },
    {
      id: '5',
      type: 'settings_change',
      description: '2FA settings modified',
      timestamp: '2024-01-03T16:10:00Z',
      ip_address: '192.168.1.100',
      location: 'New York, USA',
      risk_score: 1,
      blocked: false,
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <Shield className="h-4 w-4" />;
      case 'transaction': return <History className="h-4 w-4" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4" />;
      case 'device_new': return <Shield className="h-4 w-4" />;
      case 'settings_change': return <Shield className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Security Audit Log</h2>
          <p className="text-muted-foreground">
            Monitor all security-related activities on your account
          </p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-sm text-muted-foreground">Blocked Events</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">21</p>
                <p className="text-sm text-muted-foreground">Safe Events</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Detailed log of security activities and system responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  event.type === 'suspicious' ? 'bg-red-100 text-red-600' :
                  event.type === 'transaction' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.description}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs ${getRiskColor(event.risk_score)}`}
                        variant="outline"
                      >
                        Risk: {event.risk_score}/10
                      </Badge>
                      {event.blocked && (
                        <Badge variant="destructive" className="text-xs">
                          Blocked
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(event.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    <span className="font-mono text-xs">
                      {event.ip_address}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">
              Load More Events
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};