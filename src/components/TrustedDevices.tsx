import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, MapPin, Clock, MoreHorizontal, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSeen: string;
  location: string;
  isCurrent: boolean;
  trusted: boolean;
}

export const TrustedDevices: React.FC = () => {
  const [devices] = useState<TrustedDevice[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastSeen: '2024-01-05T10:30:00Z',
      location: 'New York, USA',
      isCurrent: true,
      trusted: true,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      lastSeen: '2024-01-05T09:15:00Z',
      location: 'New York, USA',
      isCurrent: false,
      trusted: true,
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      lastSeen: '2024-01-04T14:20:00Z',
      location: 'New York, USA',
      isCurrent: false,
      trusted: true,
    },
    {
      id: '4',
      name: 'Unknown Device',
      type: 'desktop',
      lastSeen: '2024-01-03T22:45:00Z',
      location: 'Unknown Location',
      isCurrent: false,
      trusted: false,
    },
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Laptop className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      default: return <Laptop className="h-5 w-5" />;
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Trusted Devices</h2>
          <p className="text-muted-foreground">
            Manage devices that can access your account
          </p>
        </div>
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Trust This Device
        </Button>
      </div>

      {/* Device Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{devices.filter(d => d.trusted).length}</p>
                <p className="text-sm text-muted-foreground">Trusted Devices</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{devices.filter(d => d.isCurrent).length}</p>
                <p className="text-sm text-muted-foreground">Current Session</p>
              </div>
              <Laptop className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{devices.filter(d => !d.trusted).length}</p>
                <p className="text-sm text-muted-foreground">Unverified</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices List */}
      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>
            All devices that have accessed your account recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    device.trusted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{device.name}</h4>
                      {device.isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {device.trusted ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Trusted
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Unverified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastSeen(device.lastSeen)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {device.location}
                      </div>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!device.trusted && (
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Trust Device
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      View Details
                    </DropdownMenuItem>
                    {!device.isCurrent && (
                      <DropdownMenuItem className="text-red-600">
                        Remove Device
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Device Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Only trust devices you personally own and regularly use</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Remove old or unused devices to maintain security</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>If you see an unknown device, change your password immediately</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};