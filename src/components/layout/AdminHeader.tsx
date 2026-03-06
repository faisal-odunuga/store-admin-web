'use client';

import { Search, Bell, Menu, LogOut, BadgeCheck, Settings } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAuthMe } from '@/hooks/useAuthMe';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function AdminHeader() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: me } = useAuthMe();
  const roleLabel = (() => {
    const role = me?.role?.toUpperCase();
    if (role === 'ADMIN') return 'Admin';
    if (role === 'MANAGER') return 'Manager';
    if (role === 'CUSTOMER') return 'Customer';
    return 'Admin';
  })();

  return (
    <header className='h-16 bg-white dark:bg-slate-900 border-b border-primary/10 flex items-center justify-between px-4 md:px-8 shrink-0'>
      <div className='flex items-center gap-4 flex-1'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0 w-64'>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className='max-w-md w-full relative group hidden sm:block'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary' />
          <Input
            className='w-full bg-background-light dark:bg-background-dark border-none rounded-lg pl-10 pr-4 focus-visible:ring-primary/20 text-sm'
            placeholder='Search...'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='relative text-slate-600 dark:text-slate-400'
            >
              <Bell className='h-5 w-5' />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900'></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-80'>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='max-h-[300px] overflow-y-auto p-4 text-center text-sm text-slate-500'>
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='h-8 w-px bg-primary/10 mx-2 hidden sm:block'></div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-3 p-1 h-auto hover:bg-transparent'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-semibold leading-none'>
                  {user?.fullName || 'Admin User'}
                </p>
                <p className='text-xs text-slate-500 mt-1 capitalize'>
                  {roleLabel}
                </p>
              </div>
              <Avatar className='h-10 w-10 border-2 border-primary/20'>
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin'} />
                <AvatarFallback className='bg-primary/20'>
                  {user?.firstName?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 rounded-lg' align='end' sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-2 py-2 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-sm'>
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin'} />
                  <AvatarFallback className='rounded-sm'>
                    {user?.firstName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user?.fullName || 'Admin User'}</span>
                  <span className='truncate text-xs text-slate-500'>
                    {user?.primaryEmailAddress?.emailAddress || 'admin@dealport.com'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href='/profile'>
                <DropdownMenuItem className='cursor-pointer'>
                  <BadgeCheck className='mr-2 h-4 w-4' />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link href='/settings'>
                <DropdownMenuItem className='cursor-pointer'>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
              onClick={() => signOut({ redirectUrl: '/sign-in' })}
            >
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
