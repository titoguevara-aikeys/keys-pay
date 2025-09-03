/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY OPTIMIZATION GUIDE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * SECURITY CONFIGURATION GUIDE COMPONENT
 * Provides step-by-step security optimization instructions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Clock, ExternalLink, Shield } from 'lucide-react';

export const SecurityOptimizationGuide: React.FC = () => {
  const optimizations = [
    {
      category: "Configuration Fine-Tuning",
      priority: 1,
      timeEstimate: "15 minutes",
      status: "action_required",
      items: [
        {
          title: "Adjust OTP Expiry Settings",
          description: "Reduce OTP expiry to 10 minutes maximum for enhanced security",
          action: "Access Supabase Auth dashboard → Authentication → Settings",
          link: "https://supabase.com/dashboard/project/emolyyvmvvfjyxbguhyn/auth/settings",
          completed: false
        },
        {
          title: "Review API Rate Limits",
          description: "Verify current API rate limits are appropriate for production load",
          action: "Enhanced rate limiting has been implemented with progressive penalties",
          completed: true
        }
      ]
    },
    {
      category: "Monitoring Enhancement",
      priority: 2,
      timeEstimate: "30 minutes",
      status: "completed",
      items: [
        {
          title: "Security Event Alerting",
          description: "Real-time security event monitoring and alerting system",
          action: "Security monitoring component added with real-time alerts",
          completed: true
        },
        {
          title: "Performance & Security Logging",
          description: "Enhanced logging with security event tracking",
          action: "Security event logging system implemented",
          completed: true
        }
      ]
    },
    {
      category: "Additional Hardening",
      priority: 3,
      timeEstimate: "45 minutes",
      status: "completed",
      items: [
        {
          title: "Content Security Policy Enhancement",
          description: "Production-ready CSP with nonce-based script execution",
          action: "Enhanced CSP headers implemented with environment-specific settings",
          completed: true
        },
        {
          title: "API Security Headers",
          description: "Request ID tracking and additional security headers",
          action: "Request ID tracking and enhanced security headers implemented",
          completed: true
        }
      ]
    },
    {
      category: "Database Security",
      priority: 4,
      timeEstimate: "Ongoing",
      status: "completed",
      items: [
        {
          title: "Enhanced OTP Rate Limiting",
          description: "Database-level OTP security with configurable limits",
          action: "OTP security settings table and enhanced rate limiting function created",
          completed: true
        },
        {
          title: "RLS Policy Compliance",
          description: "All tables protected with Row Level Security",
          action: "RLS enabled on all new security tables with proper policies",
          completed: true
        }
      ]
    }
  ];

  const getStatusBadge = (status: string, priority: number) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "action_required":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Action Required</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const completedCount = optimizations.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.completed).length, 0);
  const totalCount = optimizations.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Optimization Progress
          </CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} optimizations completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round((completedCount / totalCount) * 100)}% complete
          </p>
        </CardContent>
      </Card>

      {optimizations.map((category, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Priority {category.priority}: {category.category}
                </CardTitle>
                <CardDescription>
                  Estimated time: {category.timeEstimate}
                </CardDescription>
              </div>
              {getStatusBadge(category.status, category.priority)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.items.map((item, itemIdx) => (
              <div key={itemIdx} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      Action: {item.action}
                    </p>
                  </div>
                </div>
                
                {item.link && !item.completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.link, '_blank')}
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Configuration
                  </Button>
                )}
                
                {itemIdx < category.items.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Manual Action Required:</strong> Please adjust the OTP expiry setting in your Supabase Auth dashboard. 
          This is the only remaining optimization that requires manual configuration.
        </AlertDescription>
      </Alert>
    </div>
  );
};