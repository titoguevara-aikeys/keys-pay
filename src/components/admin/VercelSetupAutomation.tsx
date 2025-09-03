import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Settings, Play, ExternalLink, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      title: 'Auto-Detect Vercel Project',
      description: 'Automatically discover and configure Vercel credentials',
      status: 'pending'
    },
    {
      id: 'test-api',
      title: 'Verify API Access',
      description: 'Test connection and deployment permissions',
      status: 'pending'
    },
    {
      id: 'deploy-function',
      title: 'Enable Auto-Deploy',
      description: 'Configure automated deployment system',
      status: 'pending'
    },
    {
      id: 'test-deployment',
      title: 'Trigger First Deployment',
      description: 'Execute initial deployment to verify setup',
      status: 'pending'
    },
    {
      id: 'auto-enable',
      title: 'Enable Continuous Deployment',
      description: 'Activate automatic deployment monitoring',
      status: 'pending'
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [detectedProject, setDetectedProject] = useState<any>(null);
  const [deploymentUrl, setDeploymentUrl] = useState('');

  // Auto-start setup on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRunning && setupSteps.every(step => step.status === 'pending')) {
        runAutomatedSetup();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateStepStatus = (stepId: string, status: SetupStep['status']) => {
    setSetupSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const checkCredentials = async () => {
    updateStepStatus('check-credentials', 'running');
    
    try {
      const { data, error } = await supabase.functions.invoke('vercel-health');
      
      if (error) {
        console.error('Vercel health check error:', error);
        updateStepStatus('check-credentials', 'failed');
        toast.error('Failed to check Vercel credentials');
        return false;
      }
      
      if (data?.ok) {
        updateStepStatus('check-credentials', 'completed');
        if (data.autoDetectedProject) {
          setDetectedProject(data.autoDetectedProject);
          setProjectId(data.autoDetectedProject.id);
          toast.success(`Auto-detected project: ${data.autoDetectedProject.name}`);
        } else if (data.projectId) {
          setProjectId(data.projectId);
          toast.success(`Verified project: ${data.projectName || data.projectId}`);
        }
        return true;
      } else {
        updateStepStatus('check-credentials', 'failed');
        toast.error(`Setup failed: ${data?.error || 'Unknown error'}`);
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
      const { data, error } = await supabase.functions.invoke('vercel-deployments');
      
      if (error) {
        console.error('Vercel deployments error:', error);
        updateStepStatus('test-api', 'failed');
        toast.error('Failed to test Vercel API connection');
        return false;
      }
      
      if (data?.ok) {
        updateStepStatus('test-api', 'completed');
        toast.success(`Verified deployment access - ${data.total} deployments found`);
        return true;
      } else {
        updateStepStatus('test-api', 'failed');
        toast.error(`API access failed: ${data?.error || 'Unknown error'}`);
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
      const { data, error } = await supabase.functions.invoke('vercel-deploy', { method: 'GET' });
      
      if (error) {
        console.error('Auto-deploy function error:', error);
        updateStepStatus('deploy-function', 'failed');
        toast.error('Failed to verify auto-deploy function');
        return false;
      }
      
      if (data?.ok) {
        updateStepStatus('deploy-function', 'completed');
        toast.success('Auto-deploy system ready');
        return true;
      } else {
        updateStepStatus('deploy-function', 'failed');
        toast.error(`Auto-deploy setup failed: ${data?.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Function test error:', error);
      updateStepStatus('deploy-function', 'failed');
      toast.error('Failed to configure auto-deploy function');
      return false;
    }
  };

  const testDeployment = async () => {
    updateStepStatus('test-deployment', 'running');
    
    try {
      const { data, error } = await supabase.functions.invoke('vercel-deploy', {
        body: {
          branch: 'main',
          auto: false
        }
      });
      
      if (error) {
        console.error('Deployment error:', error);
        updateStepStatus('test-deployment', 'failed');
        toast.error('Failed to trigger deployment');
        return false;
      }
      
      if (data?.ok && data?.success) {
        updateStepStatus('test-deployment', 'completed');
        if (data.deploymentUrl) {
          setDeploymentUrl(data.deploymentUrl);
        }
        toast.success('Initial deployment triggered successfully!');
        return true;
      } else {
        updateStepStatus('test-deployment', 'failed');
        toast.error(`Deployment failed: ${data?.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Deployment test error:', error);
      updateStepStatus('test-deployment', 'failed');
      toast.error('Failed to trigger deployment');
      return false;
    }
  };

  const enableAutoDeployment = async () => {
    updateStepStatus('auto-enable', 'running');
    
    try {
      const { data, error } = await supabase.functions.invoke('vercel-deploy', {
        body: {
          branch: 'main',
          auto: true
        }
      });
      
      if (error) {
        console.error('Auto-deployment enable error:', error);
        updateStepStatus('auto-enable', 'failed');
        toast.error('Failed to enable auto-deployment');
        return false;
      }
      
      if (data?.ok) {
        updateStepStatus('auto-enable', 'completed');
        toast.success('Continuous deployment activated!');
        return true;
      } else {
        updateStepStatus('auto-enable', 'failed');
        toast.error(`Auto-deployment failed: ${data?.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Auto-deployment error:', error);
      updateStepStatus('auto-enable', 'failed');
      toast.error('Failed to enable continuous deployment');
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
      testDeployment,
      enableAutoDeployment
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      const success = await steps[i]();
      
      if (!success) {
        setIsRunning(false);
        toast.error(`Automated setup failed at step ${i + 1}`);
        return;
      }
      
      // Delay between steps for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setIsRunning(false);
    setCurrentStep(steps.length);
    toast.success('🚀 Vercel integration fully automated and ready!');
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
          <Zap className="h-5 w-5" />
          Fully Automated Vercel Setup
        </CardTitle>
        <CardDescription>
          Automatic detection, configuration, and deployment - zero manual intervention required
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-Detection Status */}
        <div className="space-y-4">
          {detectedProject && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">Auto-Detected Project</h4>
              <p className="text-sm text-green-700">
                <strong>{detectedProject.name}</strong> - {detectedProject.id}
              </p>
            </div>
          )}
          
          {projectId && !detectedProject && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Configured Project</h4>
              <p className="text-sm text-blue-700">Project ID: {projectId}</p>
            </div>
          )}

          {deploymentUrl && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800 mb-2">Live Deployment</h4>
              <a 
                href={`https://${deploymentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-700 hover:underline flex items-center gap-1"
              >
                {deploymentUrl} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
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
          {!isRunning && !allStepsCompleted && (
            <Button
              onClick={runAutomatedSetup}
              disabled={isRunning}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Full Automation
            </Button>
          )}
          
          {isRunning && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Automating setup...</span>
              </div>
            </div>
          )}
          
          {allStepsCompleted && (
            <>
              <Button
                variant="outline"
                onClick={() => window.open(`https://vercel.com/dashboard`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Vercel Dashboard
              </Button>
              {deploymentUrl && (
                <Button
                  onClick={() => window.open(`https://${deploymentUrl}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Site
                </Button>
              )}
            </>
          )}
        </div>

        {allStepsCompleted && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Fully Automated Setup Complete!
            </h4>
            <p className="text-sm text-green-700 mb-2">
              🚀 Your Vercel integration is now <strong>fully automated</strong> with:
            </p>
            <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
              <li>Auto-detected project configuration</li>
              <li>Verified deployment permissions</li>
              <li>Active continuous deployment monitoring</li>
              <li>Zero-touch deployment pipeline</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};