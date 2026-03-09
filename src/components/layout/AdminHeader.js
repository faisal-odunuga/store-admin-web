'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  BadgeCheck,
  Settings,
  ShieldCheck,
  User as UserIcon,
  Zap,
  Command,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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
import { cn } from '@/lib/utils';

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const { clerkUser: user, signOut, me, isAdmin } = useAuth();

  const roleLabel = me?.role?.toUpperCase() || (isAdmin ? 'ADMIN' : 'OPERATOR');

  return (
    <header className='h-20 glass-morphism border-b border-white/5 flex items-center justify-between px-6 md:px-10 shrink-0 relative z-40'>
      <div className='flex items-center gap-6 flex-1'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden text-white bg-white/5 rounded-xl'
            >
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0 w-64 border-r border-white/5 bg-[#050b1a]'>
            <Sidebar onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className='max-w-md w-full relative group hidden sm:block'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors'>
            <Search size={16} />
          </div>
          <Input
            className='w-full bg-white/[0.03] border-white/5 rounded-2xl pl-12 pr-4 h-12 focus-visible:ring-primary/20 text-sm font-bold text-white placeholder:text-slate-600 transition-all group-focus-within:bg-white/[0.05]'
            placeholder='Trace records across the grid...'
          />
          <div className='absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-lg border border-white/5'>
            <Command size={10} className='text-slate-500' />
            <span className='text-[9px] font-black text-slate-500'>K</span>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-6'>
        {/* Global Stats/Status Indicator */}
        <div className='hidden xl:flex items-center gap-6 px-6 border-r border-white/5'>
          <div className='flex flex-col items-end'>
            <span className='text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1'>
              Engine Status
            </span>
            <span className='flex items-center gap-2 text-[10px] font-black text-emerald-400'>
              <div className='h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse' /> NOMINAL
            </span>
          </div>
          <div className='flex flex-col items-end'>
            <span className='text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1'>
              Active Ops
            </span>
            <span className='text-[10px] font-black text-white'>14.2k/s</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='relative h-12 w-12 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all'
            >
              <Bell className='h-5 w-5' />
              <span className='absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]'></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-80 glass-morphism border-white/10 text-white rounded-3xl p-4'
          >
            <DropdownMenuLabel className='text-xs font-black uppercase tracking-widest opacity-60 mb-2'>
              Signal Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-white/5' />
            <div className='max-h-[300px] overflow-y-auto py-8 text-center'>
              <Zap size={24} className='mx-auto text-primary/20 mb-3' />
              <p className='text-xs font-bold text-slate-500 uppercase tracking-widest'>
                No active signals
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-4 p-1.5 h-auto hover:bg-white/5 transition-all rounded-2xl group border border-transparent'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-black text-white tracking-tight leading-none'>
                  {user?.fullName || 'Admin Operator'}
                </p>
                <div className='flex items-center justify-end gap-1.5 mt-1.5'>
                  <span
                    className={cn(
                      'text-[8px] font-black px-1.5 py-0.5 rounded-md tracking-tighter uppercase',
                      roleLabel === 'ADMIN'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                        : 'bg-primary/20 text-primary border border-primary/20',
                    )}
                  >
                    {roleLabel}
                  </span>
                  <ShieldCheck
                    size={10}
                    className='text-slate-600 group-hover:text-primary transition-colors'
                  />
                </div>
              </div>
              <div className='relative'>
                <Avatar className='h-12 w-12 border-2 border-white/10 group-hover:border-primary/50 transition-all rounded-2xl shadow-xl'>
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || 'Admin'}
                    className='object-cover'
                  />
                  <AvatarFallback className='bg-primary/20 text-primary font-black'>
                    {user?.firstName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-[#050b1a] rounded-full' />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-64 glass-morphism border-white/10 text-white rounded-3xl p-2'
            align='end'
            sideOffset={8}
          >
            <DropdownMenuLabel className='p-4 font-normal'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-10 w-10 rounded-xl border border-white/5'>
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin'} />
                  <AvatarFallback className='rounded-xl bg-primary/20 text-primary'>
                    {user?.firstName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-black tracking-tight'>
                    {user?.fullName || 'Operator'}
                  </span>
                  <span className='truncate text-[10px] text-slate-500 font-bold uppercase tracking-widest'>
                    {user?.primaryEmailAddress?.emailAddress || 'system@dealport.io'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className='bg-white/5' />
            <DropdownMenuGroup className='p-2 space-y-1'>
              <Link href='/profile'>
                <DropdownMenuItem className='cursor-pointer rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 focus:text-white focus:bg-white/5 gap-3 h-11'>
                  <BadgeCheck className='h-4 w-4' />
                  Profile Data
                </DropdownMenuItem>
              </Link>
              <Link href='/settings'>
                <DropdownMenuItem className='cursor-pointer rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 focus:text-white focus:bg-white/5 gap-3 h-11'>
                  <Settings className='h-4 w-4' />
                  System Prefs
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='bg-white/5' />
            <DropdownMenuItem
              className='cursor-pointer text-rose-400 font-black text-xs uppercase tracking-widest focus:text-rose-300 focus:bg-rose-500/10 rounded-xl m-2 gap-3 h-11'
              onClick={() => signOut({ redirectUrl: '/sign-in' })}
            >
              <LogOut className='h-4 w-4' />
              Exit Securely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
