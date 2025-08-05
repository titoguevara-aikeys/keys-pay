import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SendAppLink: React.FC = () => {
  const [email, setEmail] = useState('tito.guevara@aikeys.ai');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const sendAppLink = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    
    try {
      const appUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke('send-app-link', {
        body: { 
          email: email.trim(),
          appUrl 
        }
      });

      if (error) {
        throw error;
      }

      setSent(true);
      toast({
        title: 'App link sent!',
        description: `Security testing link sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error sending app link:', error);
      toast({
        title: 'Failed to send link',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <Check className="h-12 w-12 text-green-600 mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Email Sent Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox at {email} for the security testing link
            </p>
          </div>
          <Button 
            onClick={() => setSent(false)} 
            variant="outline"
            size="sm"
          >
            Send Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Security Testing Link
        </CardTitle>
        <CardDescription>
          Send the app link to test advanced security features from another device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        
        <Button 
          onClick={sendAppLink} 
          disabled={sending || !email}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? 'Sending...' : 'Send Security Testing Link'}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          The email will include the app URL and instructions for testing all security features
        </div>
      </CardContent>
    </Card>
  );
};