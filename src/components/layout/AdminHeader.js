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
  Zap,
  Command,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();

  const roleLabel = me?.role?.toUpperCase() || (isAdmin ? 'ADMIN' : 'OPERATOR');

  return (
    <header className='h-20 glass-morphism border-b border-border flex items-center justify-between px-6 md:px-10 shrink-0 relative z-40'>
      <div className='flex items-center gap-6 flex-1'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden text-foreground bg-secondary/50 rounded-xl'
            >
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0 w-64 border-r border-border bg-background'>
            <Sidebar onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className='max-w-md w-full relative group hidden sm:block'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors'>
            <Search size={16} />
          </div>
          <Input
            className='w-full bg-secondary border-border rounded-2xl pl-12 pr-4 h-12 focus-visible:ring-primary/20 text-sm font-bold text-foreground placeholder:text-muted-foreground transition-all group-focus-within:bg-secondary/80'
            placeholder='Trace records across the grid...'
          />
          <div className='absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-2 py-0.5 bg-background border border-border rounded-lg'>
            <Command size={10} className='text-muted-foreground' />
            <span className='text-[9px] font-black text-muted-foreground'>K</span>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-6'>
        {/* Toggle Theme */}
        <Button
          variant='ghost'
          size='icon'
          className='h-12 w-12 bg-secondary/50 border border-border rounded-2xl text-slate-500 hover:text-primary transition-all'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500' />
          <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>

        {/* Global Stats/Status Indicator */}
        <div className='hidden xl:flex items-center gap-6 px-6 border-r border-border'>
          <div className='flex flex-col items-end'>
            <span className='text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1'>
              Engine Status
            </span>
            <span className='flex items-center gap-2 text-[10px] font-black text-emerald-500'>
              <div className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' /> NOMINAL
            </span>
          </div>
          <div className='flex flex-col items-end'>
            <span className='text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1'>
              Active Ops
            </span>
            <span className='text-[10px] font-black text-foreground'>14.2k/s</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='relative h-12 w-12 bg-secondary/50 border border-border rounded-2xl text-slate-500 hover:text-primary hover:bg-secondary/80 transition-all'
            >
              <Bell className='h-5 w-5' />
              <span className='absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]'></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-80 glass-morphism border-border text-foreground rounded-3xl p-4'
          >
            <DropdownMenuLabel className='text-xs font-black uppercase tracking-widest opacity-60 mb-2'>
              Signal Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-border' />
            <div className='max-h-[300px] overflow-y-auto py-8 text-center'>
              <Zap size={24} className='mx-auto text-primary/20 mb-3' />
              <p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>
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
              className='flex items-center gap-4 p-1.5 h-auto hover:bg-secondary/50 transition-all rounded-2xl group border border-transparent'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-black text-foreground tracking-tight leading-none'>
                  {user?.fullName || 'Admin Operator'}
                </p>
                <div className='flex items-center justify-end gap-1.5 mt-1.5'>
                  <span
                    className={cn(
                      'text-[8px] font-black px-1.5 py-0.5 rounded-md tracking-tighter uppercase',
                      roleLabel === 'ADMIN'
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        : 'bg-primary/10 text-primary border border-primary/20',
                    )}
                  >
                    {roleLabel}
                  </span>
                  <ShieldCheck
                    size={10}
                    className='text-muted-foreground group-hover:text-primary transition-colors'
                  />
                </div>
              </div>
              <div className='relative'>
                <Avatar className='h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-all rounded-2xl shadow-xl'>
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || 'Admin'}
                    className='object-cover'
                  />
                  <AvatarFallback className='bg-primary/20 text-primary font-black'>
                    {user?.firstName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-background rounded-full' />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-64 glass-morphism border-border text-foreground rounded-3xl p-2'
            align='end'
            sideOffset={8}
          >
            <DropdownMenuLabel className='p-4 font-normal'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-10 w-10 rounded-xl border border-border'>
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin'} />
                  <AvatarFallback className='rounded-xl bg-primary/20 text-primary'>
                    {user?.firstName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-black tracking-tight'>
                    {user?.fullName || 'Operator'}
                  </span>
                  <span className='truncate text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                    {user?.primaryEmailAddress?.emailAddress || 'system@dealport.io'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className='bg-border' />
            <DropdownMenuGroup className='p-2 space-y-1'>
              <Link href='/profile'>
                <DropdownMenuItem className='cursor-pointer rounded-xl font-bold text-xs uppercase tracking-widest text-muted-foreground focus:text-foreground focus:bg-secondary/50 gap-3 h-11'>
                  <BadgeCheck className='h-4 w-4' />
                  Profile Data
                </DropdownMenuItem>
              </Link>
              <Link href='/settings'>
                <DropdownMenuItem className='cursor-pointer rounded-xl font-bold text-xs uppercase tracking-widest text-muted-foreground focus:text-foreground focus:bg-secondary/50 gap-3 h-11'>
                  <Settings className='h-4 w-4' />
                  System Prefs
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='bg-border' />
            <DropdownMenuItem
              className='cursor-pointer text-rose-500 font-extrabold text-xs uppercase tracking-widest focus:text-rose-600 focus:bg-rose-500/10 rounded-xl m-2 gap-3 h-11'
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
