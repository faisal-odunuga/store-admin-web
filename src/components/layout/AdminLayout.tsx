import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100'>
      <div className='hidden md:flex'>
        <Sidebar />
      </div>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />
        <main className='flex-1 overflow-y-auto w-full'>{children}</main>
      </div>
    </div>
  );
}
