import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface KeysPayAuthProps {
  onAuthSuccess?: () => void;
}

export const KeysPayAuth: React.FC<KeysPayAuthProps> = ({ onAuthSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [authError, setAuthError] = useState<string>('');
  const navigate = useNavigate();
  
  // Use direct Supabase client instead of context to avoid provider dependency issues
  const signInDirect = async (email: string, password: string) => {
    console.log('🔄 Direct SignIn attempt for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('❌ Direct SignIn error:', error);
    } else {
      console.log('✅ Direct SignIn successful');
    }
    return { error };
  };

  const signUpDirect = async (email: string, password: string) => {
    console.log('🔄 Direct SignUp attempt for:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      console.error('❌ Direct SignUp error:', error);
    } else {
      console.log('✅ Direct SignUp successful');
    }
    return { error };
  };

  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: 'individual' as 'individual' | 'business',
    countryCode: 'AE'
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const { error } = await signInDirect(signInForm.email, signInForm.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('Please confirm your email address before signing in.');
        } else {
          setAuthError(error.message);
        }
      } else {
        toast.success('Successfully signed in!');
        onAuthSuccess?.();
        navigate('/dashboard');
      }
    } catch (error) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUpDirect(signUpForm.email, signUpForm.password);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setAuthError('This email is already registered. Please sign in instead.');
        } else {
          setAuthError(error.message);
        }
      } else {
        // Create organization and update profile after successful signup
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Profile is now automatically created by trigger, so just update it
            await supabase
              .from('profiles')
              .update({
                first_name: signUpForm.firstName,
                last_name: signUpForm.lastName,
                phone: '',
                business_role: 'Owner',
                registration_platform: 'keys-pay'
              })
              .eq('user_id', user.id);

            // Create organization
            const { data: org } = await supabase
              .from('organizations')
              .insert({
                name: signUpForm.organizationName,
                type: signUpForm.organizationType,
                country_code: signUpForm.countryCode
              })
              .select()
              .single();

            // Create default account for the user
            await supabase
              .from('accounts')
              .insert({
                user_id: user.id,
                account_number: `KP-${user.id.substring(0, 8).toUpperCase()}`,
                account_type: 'checking',
                balance: 0,
                currency: 'AED',
                status: 'active'
              });
          }
        }, 1000);

        toast.success('Account created successfully! Please check your email for verification.');
        setActiveTab('signin');
      }
    } catch (error) {
      setAuthError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Keys Pay</span>
          </div>
          <h2 className="text-2xl font-semibold text-blue-400 mb-2">Keys Pay</h2>
          <p className="text-slate-400 text-sm">
            GCC Financial Aggregator • Crypto • Cards • Banking
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="grid grid-cols-2 gap-0 mb-6 bg-slate-800 rounded-lg p-1">
          <Button
            variant="ghost"
            className={`rounded-md transition-all ${
              activeTab === 'signin' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            onClick={() => {
              setActiveTab('signin');
              setAuthError('');
            }}
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            className={`rounded-md transition-all ${
              activeTab === 'signup' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            onClick={() => {
              setActiveTab('signup');
              setAuthError('');
            }}
          >
            Sign Up
          </Button>
        </div>

        {/* Auth Forms */}
        <div className="space-y-6">
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="tito.guevara@gmail.com"
                  className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="signin-password" className="text-white text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {authError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  {authError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    value={signUpForm.firstName}
                    onChange={(e) => setSignUpForm({...signUpForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    value={signUpForm.lastName}
                    onChange={(e) => setSignUpForm({...signUpForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@company.com"
                  className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="organizationName" className="text-white text-sm font-medium">
                  Organization Name
                </Label>
                <Input
                  id="organizationName"
                  placeholder="Your Company Ltd"
                  className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  value={signUpForm.organizationName}
                  onChange={(e) => setSignUpForm({...signUpForm, organizationName: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-white text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  className="mt-2 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  value={signUpForm.confirmPassword}
                  onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  {authError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-xs text-slate-400 text-center space-y-1">
                <p>By creating an account, you agree to our Terms of Service</p>
                <p>and Privacy Policy. Subject to KYC verification.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};