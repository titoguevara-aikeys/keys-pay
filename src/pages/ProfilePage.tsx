import React from 'react';
import { ProfileSettings } from '@/components/ProfileSettings';
import { useKeysPayProfile } from '@/hooks/useKeysPayProfile';

const ProfilePage = () => {
  const { data: profile, isLoading } = useKeysPayProfile();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  // Transform profile data to match component interface
  const transformedUser = {
    id: profile.user_id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: '',
    role: profile.business_role || 'Business Owner',
    organization: profile.organization ? {
      id: profile.organization.id,
      name: profile.organization.name,
      type: profile.organization.type,
      kybStatus: profile.organization.kyb_status as 'pending' | 'verified' | 'rejected'
    } : {
      id: '',
      name: 'Personal Organization',
      type: 'individual',
      kybStatus: 'pending' as const
    }
  };

  return (
    <div className="p-8">
      <ProfileSettings user={transformedUser} />
    </div>
  );
};

export default ProfilePage;