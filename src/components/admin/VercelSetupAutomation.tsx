import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Settings, Play, ExternalLink } from 'lucide-react';

interface VercelSetupProps {
  onSetupComplete?: () => void;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  action?: () => Promise<void>;
}

export const VercelSetupAutomation: React.FC<VercelSetupProps> = ({ onSetupComplete }) => {
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'check-credentials',
      title: 'Check Vercel Credentials',
      description: 'Verify VERCEL_PROJECT_ID and VERCEL_TOKEN are configured',
      status: 'pending'
    },
    {
      id: 'test-api',
      title: 'Test Vercel API Connection',
      description: 'Test connection to Vercel API endpoints',
      status: 'pending'
    },
    {
      id: 'deploy-function',
      title: 'Deploy Auto-Deploy Function',
      description: 'Ensure Supabase Edge Function is deployed and working',
      status: 'pending'
    },
    {
      id: 'test-deployment',
      title: 'Test Deployment Trigger',
      description: 'Trigger a test deployment to verify everything works',
      status: 'pending'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [vercelToken, setVercelToken] = useState('');
  const [projectId, setProjectId] = useState('aikey-mena-hub');

  const updateStepStatus = (stepId: string, status: SetupStep['status']) => {
    setSetupSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const checkCredentials = async () => {
    updateStepStatus('check-credentials', 'running');
    
    try {
      const response = await fetch('/api/vercel/health');
      const data = await response.json();
      
      if (data.ok) {
        updateStepStatus('check-credentials', 'completed');
        return true;
      } else {
        updateStepStatus('check-credentials', 'failed');
        toast.error(`Credentials check failed: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Credentials check error:', error);
      updateStepStatus('check-credentials', 'failed');
      toast.error('Failed to check Vercel credentials');
      return false;
    }
  };

  const testApiConnection = async () => {
    updateStepStatus('test-api', 'running');
    
    try {
      const response = await fetch('/api/vercel/deployments');
      const data = await response.json();
      
      if (data.ok) {
        updateStepStatus('test-api', 'completed');
        toast.success(`Found ${data.total} recent deployments`);
        return true;
      } else {
        updateStepStatus('test-api', 'failed');
        toast.error(`API test failed: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('API test error:', error);
      updateStepStatus('test-api', 'failed');
      toast.error('Failed to test Vercel API connection');
      return false;
    }
  };

  const deployFunction = async () => {
    updateStepStatus('deploy-function', 'running');
    
    try {
      // Test if the edge function is working
      const response = await fetch('/api/vercel/deploy', {
        method: 'GET'
      });
      const data = await response.json();
      
      if (data.ok) {
        updateStepStatus('deploy-function', 'completed');
        toast.success('Auto-deploy function is ready');
        return true;
      } else {
        updateStepStatus('deploy-function', 'failed');
        toast.error(`Function test failed: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Function test error:', error);
      updateStepStatus('deploy-function', 'failed');
      toast.error('Failed to test auto-deploy function');
      return false;
    }
  };

  const testDeployment = async () => {
    updateStepStatus('test-deployment', 'running');
    
    try {
      const response = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          branch: 'main',
          auto: false
        })
      });
      
      const data = await response.json();
      
      if (data.ok && data.success) {
        updateStepStatus('test-deployment', 'completed');
        toast.success('Test deployment triggered successfully!');
        return true;
      } else {
        updateStepStatus('test-deployment', 'failed');
        toast.error(`Deployment test failed: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Deployment test error:', error);
      updateStepStatus('test-deployment', 'failed');
      toast.error('Failed to test deployment');
      return false;
    }
  };

  const runAutomatedSetup = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    const steps = [
      checkCredentials,
      testApiConnection,
      deployFunction,
      testDeployment
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      const success = await steps[i]();
      
      if (!success) {
        setIsRunning(false);
        toast.error(`Setup failed at step ${i + 1}`);
        return;
      }
      
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsRunning(false);
    setCurrentStep(steps.length);
    toast.success('Vercel integration setup completed successfully!');
    onSetupComplete?.();
  };

  const getStatusIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: SetupStep['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const allStepsCompleted = setupSteps.every(step => step.status === 'completed');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Vercel Integration Setup
        </CardTitle>
        <CardDescription>
          Automated setup and configuration for Vercel auto-deployment integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-id">Project ID</Label>
              <Input
                id="project-id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="aikey-mena-hub"
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vercel-token">Vercel Token Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {process.env.VERCEL_TOKEN ? 'Configured' : 'Not Set'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://vercel.com/account/tokens', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Get Token
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Setup Progress</h4>
          {setupSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                currentStep === index && isRunning ? 'bg-blue-50 border-blue-200' : 
                step.status === 'completed' ? 'bg-green-50 border-green-200' :
                step.status === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              {getStatusIcon(step.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">{step.title}</h5>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={runAutomatedSetup}
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Setup...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Automated Setup
              </>
            )}
          </Button>
          
          {allStepsCompleted && (
            <Button
              variant="outline"
              onClick={() => window.open('https://vercel.com/aikeys/aikey-mena-hub', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Project
            </Button>
          )}
        </div>

        {allStepsCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">Setup Complete!</h4>
            <p className="text-sm text-green-700">
              Your Vercel integration is now fully configured and ready to use. 
              Auto-deployments can be enabled from the deployment manager.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};