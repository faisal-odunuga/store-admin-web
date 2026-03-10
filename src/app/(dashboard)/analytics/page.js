'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboard';

export default function AnalyticsPage() {
  useDashboardStats();

  return (
    <div className='space-y-10 pb-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in'>
        <div>
          <h1 className='text-3xl font-extrabold text-foreground tracking-tight mb-2 uppercase'>
            Business Analytics
          </h1>
          <p className='text-muted-foreground font-medium'>
            In-depth performance metrics, growth trends, and consumer behavior.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            className='bg-secondary/50 border-border text-foreground font-bold h-11 px-6 rounded-xl hover:bg-secondary'
          >
            <Calendar className='mr-2 h-4 w-4 text-primary' /> Last 30 Days
          </Button>
          <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20'>
            <Filter className='mr-2 h-4 w-4' /> Advanced Filter
          </Button>
        </div>
      </div>

      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in'
        style={{ animationDelay: '0.1s' }}
      >
        {[
          {
            label: 'Growth Rate',
            value: '+12.5%',
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Conversion',
            value: '3.2%',
            icon: BarChart3,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Retention',
            value: '88%',
            icon: Users,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Avg Order',
            value: '₦42.5k',
            icon: ShoppingBag,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className='glass-card border-none p-6 group hover:scale-[1.02] transition-all cursor-default'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className={cn('p-3 rounded-2xl border border-white/5', item.bg)}>
                <item.icon className={cn('h-6 w-6', item.color)} />
              </div>
              <div className='flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full'>
                <ArrowUpRight size={10} /> 4.1%
              </div>
            </div>
            <p className='text-[10px] uppercase tracking-widest font-extrabold text-muted-foreground mb-1'>
              {item.label}
            </p>
            <h3 className='text-2xl font-black text-foreground tracking-tight'>{item.value}</h3>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <Card className='lg:col-span-2 glass-card border-none p-10 overflow-hidden relative'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32' />
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-10'>
              <div>
                <h3 className='text-xl font-bold text-foreground mb-1'>Revenue Projection</h3>
                <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest'>
                  Forecast based on current trends
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1.5'>
                  <div className='h-2 w-2 rounded-full bg-primary' />
                  <span className='text-[10px] text-slate-400 font-bold uppercase'>Actual</span>
                </div>
                <div className='flex items-center gap-1.5 ml-4'>
                  <div className='h-2 w-2 rounded-full bg-white/20' />
                  <span className='text-[10px] text-slate-400 font-bold uppercase'>Predicted</span>
                </div>
              </div>
            </div>
            <div className='h-80 w-full flex items-end justify-between gap-4'>
              {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((val, i) => (
                <div key={i} className='flex-1 flex flex-col items-center gap-3 group'>
                  <div
                    className='w-full rounded-t-xl bg-gradient-to-t from-primary/40 to-primary shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-700 hover:brightness-125'
                    style={{ height: `${val}%` }}
                  />
                  <span className='text-[9px] font-extrabold text-slate-600 group-hover:text-primary transition-colors'>
                    M{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className='glass-card border-none p-10 bg-primary/5 border border-primary/20 relative overflow-hidden'>
          <div className='absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full' />
          <div className='relative z-10 space-y-8'>
            <h3 className='text-xl font-bold text-foreground mb-6'>Performance Insights</h3>

            {[
              { label: 'Customer Satisfaction', value: 94, color: 'bg-emerald-400' },
              { label: 'Delivery Efficiency', value: 82, color: 'bg-primary' },
              { label: 'Inventory Turnover', value: 68, color: 'bg-amber-400' },
              { label: 'Marketing ROI', value: 75, color: 'bg-indigo-400' },
            ].map((insight, idx) => (
              <div key={idx} className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] font-extrabold text-foreground uppercase tracking-widest opacity-70'>
                    {insight.label}
                  </span>
                  <span className='text-xs font-black text-foreground'>{insight.value}%</span>
                </div>
                <div className='h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]'>
                  <div
                    className={cn(
                      'h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-1000',
                      insight.color,
                    )}
                    style={{ width: `${insight.value}%` }}
                  />
                </div>
              </div>
            ))}

            <Button className='w-full mt-4 bg-foreground text-background hover:bg-foreground/90 font-black h-12 rounded-xl shadow-xl shadow-black/20'>
              Download Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
