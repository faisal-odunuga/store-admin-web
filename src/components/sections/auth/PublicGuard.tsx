'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function PublicGuard({ children }: { children: ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
        <Loader2 className='h-8 w-8 text-indigo-600 animate-spin' />
      </div>
    );
  }

  // If we have a userId, we're about to redirect, so show loading
  if (userId) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50'>
        <Loader2 className='h-8 w-8 text-indigo-600 animate-spin' />
      </div>
    );
  }

  return <>{children}</>;
}
