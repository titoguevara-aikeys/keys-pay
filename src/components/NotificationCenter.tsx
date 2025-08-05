import React, { useState } from 'react';
import { Bell, Check, X, AlertTriangle, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'limit' | 'family';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'transaction',
      title: 'Transaction Alert',
      message: 'You spent $45.67 at Grocery Store',
      timestamp: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'limit',
      title: 'Spending Limit Warning',
      message: 'You\'ve reached 80% of your monthly limit',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'family',
      title: 'Family Activity',
      message: 'John made a $15 purchase at Coffee Shop',
      timestamp: '3 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <DollarSign className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'limit': return <AlertTriangle className="h-4 w-4" />;
      case 'family': return <CreditCard className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className="border-0 rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'transaction' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'limit' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'family' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};