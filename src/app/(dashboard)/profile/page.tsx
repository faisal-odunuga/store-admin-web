'use client';

import { UserProfile, useUser } from '@clerk/nextjs';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/apiService';
import React from 'react';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const { user } = useUser();
  const [isCompleting, setIsCompleting] = React.useState(false);
  const { data: me } = useAuthMe();
  const setupComplete = me?.setupComplete !== false;
  const queryClient = useQueryClient();

  const handleCompleteSetup = async () => {
    setIsCompleting(true);
    try {
      await authService.completeSetup();
      await user?.reload();
      await queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <PageContainer
      title='User Profile'
      description='Manage your account settings, security, and personal information.'
    >
      {!setupComplete && (
        <div className='mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex items-center justify-between gap-4'>
          <span>
            Update your password, then click “Complete Setup” to unlock the admin panel.
          </span>
          <Button onClick={handleCompleteSetup} disabled={isCompleting}>
            {isCompleting ? 'Updating...' : 'Complete Setup'}
          </Button>
        </div>
      )}
      <div className=''>
        <UserProfile
          routing='hash'
          appearance={{
            elements: {
              rootBox: 'w-full shadow-none pb-12',
              card: 'w-full shadow-none border bg-card text-card-foreground mx-auto',
              navbar: 'hidden md:flex border-r',
              headerTitle: 'text-2xl font-bold',
              headerSubtitle: 'text-muted-foreground',
              profileSectionTitleText: 'text-lg font-semibold',
              userPreviewMainIdentifier: 'font-medium',
              userPreviewSecondaryIdentifier: 'text-muted-foreground',
            },
            layout: {
              shimmer: true,
            },
          }}
        />
      </div>
    </PageContainer>
  );
}
