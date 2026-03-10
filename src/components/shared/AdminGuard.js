'use client';

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import LoadingState from './LoadingState';
import { useAuth } from '@/hooks/useAuth';

export function AdminGuard({ children }) {
  const { me, isLoading, isError, error, signOut, isClerkLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Only act if we have definitive data and are not loading
    if (!isLoading && me) {
      if (me.role?.toUpperCase() === 'CUSTOMER') {
        toast.error('Access Denied', {
          description: 'Your account does not have administrative privileges.',
          className: 'glass-morphism border-rose-500/20 text-white',
          duration: 5000,
        });

        signOut({ redirectUrl: '/sign-in' });
      }
    }

    // Correctly check for 401/403 status in Axios error object
    const status = error?.response?.status || error?.status;
    if (isError && (status === 401 || status === 403)) {
      toast.error('Session Expired', {
        description: 'Please sign in again to continue.',
        className: 'glass-morphism border-rose-500/20 text-white',
      });
      signOut({ redirectUrl: '/sign-in' });
    }

    // Safety redirect if Clerk says user is gone and we're not loading
    if (!isLoading && isClerkLoaded && !isSignedIn) {
      window.location.href = '/sign-in';
    }
  }, [me, isLoading, isError, error, signOut, isClerkLoaded, isSignedIn]);

  if (isLoading) {
    return <LoadingState message='Verifying Clearance...' />;
  }

  // If we have an error but it's not a fatal auth error, we might still want to show the UI
  // or a specific error state. For now, if we have 'me' and it's not a customer, we're good.
  if (me && me.role?.toUpperCase() !== 'CUSTOMER') {
    return <>{children}</>;
  }

  // If not a customer but we don't have 'me' yet (and not loading), something is wrong
  if (!me && !isLoading && !isError) {
    return <LoadingState message='Recovering Session...' />;
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <p className='text-rose-400 font-bold'>Authentication synchronisation failed.</p>
        <p className='text-xs text-white/40'>Check your internet connection or try again.</p>
        <Button
          variant='outline'
          onClick={() => window.location.reload()}
          className='border-white/10 bg-white/5 text-white hover:bg-white/10'
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return <LoadingState message='Authentication in progress...' />;
}
