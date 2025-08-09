import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  AlertTriangle,
  CheckCircle,
  Settings,
  CreditCard,
  ShoppingCart,
  Utensils,
  Gamepad2,
  Book,
  Shirt
} from 'lucide-react';

export const SpendingControls = () => {
  const [selectedChild, setSelectedChild] = useState('1');

  // Mock data - replace with actual data hooks
  const children = [
    { id: '1', name: 'Emma', age: 12 },
    { id: '2', name: 'Jake', age: 10 },
    { id: '3', name: 'Sophie', age: 8 }
  ];

  const spendingControls = {
    '1': {
      childId: '1',
      childName: 'Emma',
      categories: {
        food: { dailyLimit: 10, weeklyLimit: 50, monthlyLimit: 200, isAllowed: true },
        entertainment: { dailyLimit: 5, weeklyLimit: 25, monthlyLimit: 100, isAllowed: true },
        clothing: { dailyLimit: 0, weeklyLimit: 30, monthlyLimit: 120, isAllowed: true },
        education: { dailyLimit: 15, weeklyLimit: 100, monthlyLimit: 400, isAllowed: true },
        gaming: { dailyLimit: 2, weeklyLimit: 10, monthlyLimit: 40, isAllowed: false },
        general: { dailyLimit: 20, weeklyLimit: 100, monthlyLimit: 400, isAllowed: true }
      },
      timeRestrictions: {
        schoolHours: true, // 8am-3pm on weekdays
        bedTime: true, // after 9pm
        weekendOnly: false
      },
      locationRestrictions: {
        schoolArea: false,
        homeArea: false,
        restrictedStores: ['Casino', 'Adult Store']
      },
      overallLimits: {
        dailyTotal: 50,
        weeklyTotal: 200,
        monthlyTotal: 800
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="h-4 w-4" />;
      case 'entertainment':
        return <Gamepad2 className="h-4 w-4" />;
      case 'clothing':
        return <Shirt className="h-4 w-4" />;
      case 'education':
        return <Book className="h-4 w-4" />;
      case 'gaming':
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getCurrentControls = () => {
    return spendingControls[selectedChild as keyof typeof spendingControls] || spendingControls['1'];
  };

  const controls = getCurrentControls();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spending Controls</h2>
          <p className="text-muted-foreground">Set limits and restrictions for safe spending</p>
        </div>
        <div className="flex items-center space-x-4">
          <Label htmlFor="child-select">Child:</Label>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="time">Time Rules</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
          <TabsTrigger value="overall">Overall Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Category Spending Limits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(controls.categories).map(([category, limits]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(category)}
                      <div>
                        <h4 className="font-medium capitalize">{category}</h4>
                        <p className="text-sm text-muted-foreground">
                          Set spending limits for {category} purchases
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={limits.isAllowed} />
                      <Badge variant={limits.isAllowed ? "default" : "secondary"}>
                        {limits.isAllowed ? "Allowed" : "Blocked"}
                      </Badge>
                    </div>
                  </div>
                  
                  {limits.isAllowed && (
                    <div className="grid grid-cols-3 gap-4 ml-7">
                      <div className="space-y-2">
                        <Label>Daily Limit</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={limits.dailyLimit}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Weekly Limit</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={limits.weeklyLimit}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Limit</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={limits.monthlyLimit}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time-Based Restrictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Block During School Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Prevent spending Monday-Friday 8:00 AM - 3:00 PM
                  </p>
                </div>
                <Switch checked={controls.timeRestrictions.schoolHours} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Block After Bedtime</h4>
                  <p className="text-sm text-muted-foreground">
                    Prevent spending after 9:00 PM on school nights
                  </p>
                </div>
                <Switch checked={controls.timeRestrictions.bedTime} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekends Only</h4>
                  <p className="text-sm text-muted-foreground">
                    Only allow spending on weekends
                  </p>
                </div>
                <Switch checked={controls.timeRestrictions.weekendOnly} />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Custom Time Rules</h4>
                    <p className="text-sm text-blue-600">
                      Set specific hours when spending is allowed or blocked
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configure Custom Hours
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location-Based Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Block at School</h4>
                  <p className="text-sm text-muted-foreground">
                    Prevent spending when at school location
                  </p>
                </div>
                <Switch checked={controls.locationRestrictions.schoolArea} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Home Area Only</h4>
                  <p className="text-sm text-muted-foreground">
                    Only allow spending within 1 mile of home
                  </p>
                </div>
                <Switch checked={controls.locationRestrictions.homeArea} />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Restricted Merchants</h4>
                  <p className="text-sm text-muted-foreground">
                    Block spending at specific store types or locations
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {controls.locationRestrictions.restrictedStores.map((store, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                      <span>{store}</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        ×
                      </Button>
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    + Add Restriction
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Safe Zones</h4>
                    <p className="text-sm text-yellow-600">
                      Set up approved locations where spending is always allowed
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Manage Safe Zones
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Overall Spending Limits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Daily Total Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={controls.overallLimits.dailyTotal}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum spend per day across all categories
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Weekly Total Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={controls.overallLimits.weeklyTotal}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum spend per week across all categories
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Monthly Total Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={controls.overallLimits.monthlyTotal}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum spend per month across all categories
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Emergency Override</h4>
                      <p className="text-sm text-green-600 mb-2">
                        Allow parents to temporarily bypass all limits
                      </p>
                      <Button variant="outline" size="sm">
                        Enable Emergency Mode
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Violation Alerts</h4>
                      <p className="text-sm text-orange-600 mb-2">
                        Get notified when limits are reached or exceeded
                      </p>
                      <Button variant="outline" size="sm">
                        Configure Alerts
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};