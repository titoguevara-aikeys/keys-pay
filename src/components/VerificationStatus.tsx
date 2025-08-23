import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';

const VerificationStatus = () => {
  const { data: profile, isLoading } = useProfile();
  
  if (isLoading || !profile) return null;
  
  // For demo purposes, consider user verified if they have email and phone
  // In real implementation, this would check actual KYC status
  const isVerified = profile.email && profile.phone;
  
  if (!isVerified) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-medium">
          Verified
        </Badge>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">
          ID: {profile.id?.slice(-8)?.toUpperCase() || 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default VerificationStatus;