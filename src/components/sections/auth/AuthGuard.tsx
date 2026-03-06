'use client';

import { useAuth } from '@clerk/nextjs';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Loader2, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: me, isLoading: isAuthMeLoading } = useAuthMe(isLoaded && !!userId);

  useEffect(() => {
    if (isLoaded && !userId) {
      // Redirect to sign-in, but save the current path to redirect back later if needed
      const searchParams = new URLSearchParams({
        redirect_url: pathname,
      });
      router.push(`/sign-in?${searchParams.toString()}`);
    }
  }, [isLoaded, userId, router, pathname]);

  if (!isLoaded || !userId || isAuthMeLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='h-12 w-12 rounded-full border-4 border-slate-100' />
            <Loader2 className='h-12 w-12 text-indigo-600 animate-spin absolute top-0' />
          </div>
          <p className='text-sm font-medium text-slate-500 animate-pulse'>
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContent pathname={pathname} setupComplete={me?.setupComplete}>
      {children}
    </AuthContent>
  );
}

function AuthContent({
  children,
  pathname,
  setupComplete,
}: {
  children: ReactNode;
  pathname: string;
  setupComplete?: boolean;
}) {
  const resolvedSetupComplete = setupComplete !== false;
  const isProfilePage = pathname === '/profile';

  if (!resolvedSetupComplete && !isProfilePage) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6'>
          <div className='h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto'>
            <ShieldAlert className='h-8 w-8 text-amber-500' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-slate-900'>Account Setup Required</h2>
            <p className='text-slate-500 text-sm'>
              As a new administrator, you must update your temporary password to secure your account
              before proceeding.
            </p>
          </div>

          <Link
            href='/profile'
            className='flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all'
          >
            Go to Profile Settings <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
