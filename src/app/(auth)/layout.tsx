'use client';

import { ReactNode } from 'react';
import { PublicGuard } from '@/components/sections/auth/PublicGuard';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicGuard>
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </PublicGuard>
  );
}
