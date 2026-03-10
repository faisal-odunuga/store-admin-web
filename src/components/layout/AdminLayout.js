import React from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { AdminGuard } from '@/components/shared/AdminGuard';

export function AdminLayout({ children }) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-background font-sans selection:bg-primary/30 selection:text-foreground'>
      {/* Dynamic Background Elements */}
      <div className='fixed inset-0 z-0 pointer-events-none overflow-hidden'>
        {/* Animated Blobs - Refined for Light Mode */}
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/8 dark:bg-primary/10 blur-[120px] rounded-[3rem] animate-pulse' />
        <div className='absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-[3rem] animate-pulse delay-700' />
        <div className='absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-500/3 dark:bg-purple-500/5 blur-[120px] rounded-[3rem] animate-pulse delay-1000' />

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />
      </div>

      {/* Sidebar - Desktop Only */}
      <div className='hidden md:flex relative z-20'>
        <Sidebar />
      </div>

      {/* Main Viewport */}
      <div className='flex-1 flex flex-col overflow-hidden relative z-10'>
        <AdminHeader />

        <main className='flex-1 overflow-y-auto w-full custom-scrollbar'>
          {/* Page Content Wrapper */}
          <div className='max-w-[1600px] mx-auto p-4 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
            <AdminGuard>{children}</AdminGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
