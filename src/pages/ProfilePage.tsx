import React from 'react';
import { KeysPaySidebar } from '@/components/KeysPaySidebar';
import { ProfileSettings } from '@/components/ProfileSettings';

// Mock user data
const mockUser = {
  id: '1',
  email: 'john.doe@company.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: '',
  role: 'Business Owner',
  organization: {
    id: '1',
    name: 'Acme Trading LLC',
    type: 'llc',
    kybStatus: 'verified' as const
  }
};

const ProfilePage = () => {
  return (
    <div className="p-8">
      <ProfileSettings user={mockUser} />
    </div>
  );
};

export default ProfilePage;