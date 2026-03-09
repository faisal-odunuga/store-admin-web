'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  BarChart,
  History,
  User,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Inventory Logs', href: '/inventory-logs', icon: History },
  { name: 'My Profile', href: '/profile', icon: User },
];

export function Sidebar({ onItemClick }) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className='w-64 glass-morphism border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0 z-50 overflow-hidden'>
      {/* Glow Effect */}
      <div className='absolute top-0 -left-20 w-40 h-40 bg-primary/10 blur-[80px] pointer-events-none' />

      <div className='p-8 flex items-center gap-4 relative z-10'>
        <div className='bg-primary h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group'>
          <Zap className='h-6 w-6 group-hover:scale-110 transition-transform' fill='currentColor' />
        </div>
        <div className='flex flex-col'>
          <h1 className='text-white text-xl font-black leading-none tracking-tighter uppercase'>
            DEALPORT
          </h1>
          <p className='text-slate-500 text-[10px] font-extrabold uppercase tracking-widest mt-1'>
            Control Unit
          </p>
        </div>
      </div>

      <nav className='flex-1 px-4 py-8 space-y-2 relative z-10'>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent',
              )}
            >
              <div className='flex items-center gap-3'>
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 3 : 2}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-primary' : 'group-hover:text-primary',
                  )}
                />
                <span
                  className={cn(
                    'text-[11px] font-black uppercase tracking-widest transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100',
                  )}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className='h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]' />
              )}
              {!isActive && (
                <ChevronRight
                  size={14}
                  className='opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all'
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className='p-6 border-t border-white/5 space-y-2 mt-auto relative z-10 bg-white/[0.01]'>
        <Link
          href='/settings'
          onClick={onItemClick}
          className={cn(
            'flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group',
            pathname === '/settings'
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent',
          )}
        >
          <div className='flex items-center gap-3'>
            <Settings size={18} strokeWidth={pathname === '/settings' ? 3 : 2} />
            <span className='text-[11px] font-black uppercase tracking-widest'>Settings</span>
          </div>
          {pathname === '/settings' && (
            <div className='h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]' />
          )}
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className='flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all group'
        >
          <LogOut size={18} />
          <span className='text-[11px] font-black uppercase tracking-widest'>Secure Exit</span>
        </button>
      </div>
    </aside>
  );
}
