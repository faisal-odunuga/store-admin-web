'use client';

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
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Customers', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Inventory Logs', href: '/inventory-logs', icon: History },
  { name: 'My Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className='w-64 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col shrink-0'>
      <div className='p-6 flex items-center gap-3'>
        <div className='bg-primary h-10 w-10 rounded-lg flex items-center justify-center text-white'>
          <Package className='h-6 w-6' />
        </div>
        <div className='flex flex-col'>
          <h1 className='text-primary text-xl font-bold leading-none tracking-tight'>DEALPORT</h1>
          <p className='text-slate-500 dark:text-slate-400 text-xs font-medium'>Admin Panel</p>
        </div>
      </div>

      <nav className='flex-1 px-4 py-4 space-y-1'>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary font-medium',
              )}
            >
              <item.icon className='h-5 w-5' />
              <span className='text-sm'>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-primary/10 space-y-1 mt-auto'>
        <Link
          href='/settings'
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors',
            pathname === '/settings'
              ? 'bg-primary text-white font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary font-medium',
          )}
        >
          <Settings className='h-5 w-5' />
          <span className='text-sm'>Settings</span>
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className='flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
        >
          <LogOut className='h-5 w-5' />
          <span className='text-sm font-medium'>Logout</span>
        </button>
      </div>
    </aside>
  );
}
