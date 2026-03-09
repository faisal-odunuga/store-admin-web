'use client';

import React from 'react';
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Database,
  Palette,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <div className='max-w-5xl mx-auto space-y-12 pb-20 animate-in'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-3xl font-black text-white tracking-tighter mb-2 flex items-center gap-3 uppercase'>
            <Settings className='text-primary' /> System Configuration
          </h1>
          <p className='text-slate-400 font-medium'>
            Calibrate your administrative environment and platform preferences.
          </p>
        </div>
        <Button className='bg-primary hover:bg-primary/90 text-white font-black h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95'>
          Sync All Changes
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
        {/* Navigation Sidebar */}
        <div className='lg:col-span-1 space-y-2'>
          {[
            { label: 'Interface', icon: Palette, active: true },
            { label: 'Connectivity', icon: Globe },
            { label: 'Notifications', icon: Bell },
            { label: 'Compliance', icon: Shield },
            { label: 'Engine Logs', icon: Database },
            { label: 'Security', icon: Lock },
          ].map((item, idx) => (
            <button
              key={idx}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-2xl transition-all group',
                item.active
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent',
              )}
            >
              <div className='flex items-center gap-3'>
                <item.icon size={18} strokeWidth={item.active ? 3 : 2} />
                <span className='text-xs font-black uppercase tracking-widest'>{item.label}</span>
              </div>
              {item.active && (
                <div className='h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]' />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className='lg:col-span-3 space-y-10'>
          {/* Visual System */}
          <Card className='glass-card border-none p-10 space-y-10'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-primary/10 rounded-2xl'>
                <Sparkles size={24} className='text-primary' />
              </div>
              <div>
                <h3 className='text-xl font-black text-white tracking-tight uppercase'>
                  Atmosphere & Design
                </h3>
                <p className='text-xs text-slate-500 font-bold uppercase tracking-wider'>
                  Customize the visual behavior of your dashboard
                </p>
              </div>
            </div>

            <div className='space-y-8'>
              <div className='flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all group'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-black text-white uppercase tracking-tight'>
                    Glassmorphism Engine
                  </h4>
                  <p className='text-[10px] font-bold text-slate-600 uppercase tracking-tighter'>
                    Enabled advanced backdrop-blur and transparency
                  </p>
                </div>
                <Switch defaultChecked className='data-[state=checked]:bg-primary' />
              </div>

              <div className='flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all group'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-black text-white uppercase tracking-tight'>
                    Dynamic Gradients
                  </h4>
                  <p className='text-[10px] font-bold text-slate-600 uppercase tracking-tighter'>
                    Activate background blobs and fluid animations
                  </p>
                </div>
                <Switch defaultChecked className='data-[state=checked]:bg-primary' />
              </div>

              <div className='flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all group'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-black text-white uppercase tracking-tight'>
                    Reduced Motion
                  </h4>
                  <p className='text-[10px] font-bold text-slate-600 uppercase tracking-tighter'>
                    Minimize animations for performance and accessibility
                  </p>
                </div>
                <Switch className='data-[state=checked]:bg-primary' />
              </div>
            </div>
          </Card>

          {/* Performance Engine */}
          <Card className='glass-card border-none p-10 space-y-10 bg-indigo-500/5 border border-indigo-500/10'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-indigo-500/20 rounded-2xl'>
                <Zap size={24} className='text-indigo-400' />
              </div>
              <div>
                <h3 className='text-xl font-black text-white tracking-tight uppercase'>
                  Data & Sync
                </h3>
                <p className='text-xs text-slate-500 font-bold uppercase tracking-wider'>
                  Control how your data behaves and updates
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
              <div className='space-y-3'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1'>
                  Sync Interval (ms)
                </Label>
                <Input
                  type='number'
                  defaultValue={5000}
                  className='bg-white/5 border-white/5 h-12 rounded-xl text-white font-bold focus:ring-primary/20'
                />
              </div>
              <div className='space-y-3'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1'>
                  Max Persistence Volume
                </Label>
                <Input
                  defaultValue='2.5 GB'
                  className='bg-white/5 border-white/5 h-12 rounded-xl text-white font-bold focus:ring-primary/20'
                />
              </div>
            </div>

            <div className='p-6 bg-primary/10 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <Database className='text-primary shrink-0' />
                <p className='text-xs font-bold text-primary leading-relaxed uppercase tracking-tighter'>
                  Cache database optimization is required for better dashboard performance.
                </p>
              </div>
              <Button size='sm' className='bg-primary text-white font-black rounded-lg px-6'>
                OPTIMIZE NOW
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
