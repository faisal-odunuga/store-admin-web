'use client';

import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Mail, Shield, Calendar, MapPin, Phone, Camera, LogOut, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className='max-w-4xl mx-auto space-y-10 pb-20 animate-in'>
      <div className='relative h-48 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-indigo-500/10 to-transparent border border-white/5'>
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-10' />
      </div>

      <div className='-mt-24 px-10 relative z-10'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8'>
          <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>
            <div className='h-32 w-32 rounded-[2.5rem] border-4 border-[#050b1a] bg-white/5 overflow-hidden shadow-2xl relative group'>
              {user?.imageUrl ? (
                <Image src={user.imageUrl} alt={user.fullName} fill className='object-cover' />
              ) : (
                <div className='h-full w-full flex items-center justify-center text-4xl font-black text-primary'>
                  {user?.firstName?.charAt(0)}
                </div>
              )}
              <button className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm'>
                <Camera size={24} className='text-white' />
              </button>
            </div>
            <div className='text-center md:text-left pb-2'>
              <h1 className='text-3xl font-black text-foreground tracking-tighter mb-1'>
                {user?.fullName}
              </h1>
              <div className='flex items-center justify-center md:justify-start gap-4'>
                <span className='text-[10px] font-black px-2.5 py-1 bg-primary/20 text-primary border border-primary/20 rounded-lg tracking-widest uppercase'>
                  Super Admin
                </span>
                <span className='text-xs text-muted-foreground font-bold flex items-center gap-1.5'>
                  <MapPin size={12} /> Lagos, Nigeria
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button className='bg-secondary hover:bg-secondary/80 text-foreground font-bold h-12 px-6 rounded-2xl border border-border transition-all'>
              <Edit3 size={18} className='mr-2' /> Edit Profile
            </Button>
            <SignOutButton>
              <Button
                variant='destructive'
                className='bg-rose-500 hover:bg-rose-600 text-primary-foreground font-bold h-12 px-6 rounded-2xl shadow-lg shadow-rose-500/20 transition-all'
              >
                <LogOut size={18} className='mr-2' /> Exit Securely
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-2'>
        <Card className='md:col-span-2 glass-card border-none p-10 space-y-10'>
          <div className='space-y-8'>
            <h3 className='text-sm font-black text-foreground uppercase tracking-[0.2em] opacity-50 flex items-center gap-3'>
              <div className='h-1 w-8 bg-primary rounded-full' /> Account Credentials
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                  Official Email
                </p>
                <div className='flex items-center gap-3 text-foreground font-bold tracking-tight'>
                  <Mail size={16} className='text-primary opacity-60' />
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                  Phone Signature
                </p>
                <div className='flex items-center gap-3 text-foreground font-bold tracking-tight'>
                  <Phone size={16} className='text-primary opacity-60' />
                  +234 812 345 6789
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                  Auth Provider
                </p>
                <div className='flex items-center gap-3 text-foreground font-bold tracking-tight'>
                  <Shield size={16} className='text-emerald-400 opacity-60' />
                  Clerk Enterprise
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                  Registry Date
                </p>
                <div className='flex items-center gap-3 text-foreground font-bold tracking-tight'>
                  <Calendar size={16} className='text-indigo-400 opacity-60' />
                  {user?.createdAt ? formatDate(user.createdAt) : '—'}
                </div>
              </div>
            </div>
          </div>

          <div className='p-8 bg-primary/5 rounded-[2rem] border border-primary/20 relative overflow-hidden'>
            <div className='flex items-start gap-6 relative z-10'>
              <div className='p-4 bg-primary/20 rounded-2xl'>
                <Shield size={24} className='text-primary' />
              </div>
              <div>
                <h4 className='text-foreground font-black text-lg mb-1 tracking-tight'>
                  Security Clearance
                </h4>
                <p className='text-muted-foreground text-xs font-medium leading-relaxed max-w-[340px]'>
                  Your account is protected by multi-factor authentication and has root access to
                  administrative modules.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className='glass-card border-none p-8 space-y-8'>
          <h3 className='text-sm font-black text-foreground uppercase tracking-widest opacity-50 text-center'>
            Activity Pulse
          </h3>

          <div className='space-y-6'>
            {[
              { label: 'Total Managed', value: '1,280 Orders', color: 'text-primary' },
              { label: 'System Uptime', value: '100%', color: 'text-emerald-400' },
              { label: 'Support Tokens', value: '24 Solved', color: 'text-indigo-400' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className='text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'
              >
                <p className='text-[9px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] mb-2'>
                  {stat.label}
                </p>
                <h4 className={cn('text-xl font-black tracking-tight', stat.color)}>
                  {stat.value}
                </h4>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
