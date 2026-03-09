'use client';

import React from 'react';
import {
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Zap,
  Layers,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const revenueData = stats?.revenueData || [];
  const topSellingProducts = stats?.topSellingProducts || [];
  const recentTransactions = stats?.recentTransactions || [];
  const lowStockList = stats?.lowStockProductsList || [];
  const revenueLoading = statsLoading;

  const statCards = [
    {
      label: 'Gross Volume',
      value: formatCurrency(stats?.revenue || 0),
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      trend: '+12.5%',
      isPositive: true,
    },
    {
      label: 'Active Clients',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: '+2.4%',
      isPositive: true,
    },
    {
      label: 'Fulfillment',
      value: stats?.orders || 0,
      icon: ShoppingBag,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      trend: '+8.1%',
      isPositive: true,
    },
    {
      label: 'Inventory Alerts',
      value: stats?.lowStockProducts || 0,
      icon: Layers,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      trend: 'Critical',
      isPositive: false,
    },
  ];

  return (
    <div className='space-y-12 pb-10 animate-in'>
      {/* Welcome Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black text-white tracking-tighter uppercase'>
            Control Center
          </h1>
          <p className='text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2'>
            <Activity size={12} className='text-primary animate-pulse' /> Live System Performance •{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className='flex items-center gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl'>
          <button className='px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20'>
            Overview
          </button>
          <button className='px-4 py-2 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors'>
            Reports
          </button>
          <button className='px-4 py-2 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors'>
            Audits
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {statCards.map((stat, idx) => (
          <Card
            key={idx}
            className='glass-card border-none p-8 group relative overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-default shadow-2xl'
          >
            <div className='absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-primary/10' />

            <div className='flex items-start justify-between mb-8 relative z-10'>
              <div className={cn('p-4 rounded-2xl border border-white/5 shadow-inner', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border',
                  stat.isPositive
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    : 'text-rose-400 bg-rose-400/10 border-rose-400/20',
                )}
              >
                {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>

            <div className='relative z-10'>
              <p className='text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-2'>
                {stat.label}
              </p>
              <h3 className='text-3xl font-black text-white tracking-tighter tabular-nums'>
                {stat.value}
              </h3>
            </div>

            {/* Decorative Sparkle */}
            <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Zap size={14} className='text-primary/40 animate-pulse' />
            </div>
          </Card>
        ))}
      </div>

      {/* Intelligence Hub */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {/* Main Chart Card */}
        <Card className='lg:col-span-2 glass-card border-none p-10 relative overflow-hidden group'>
          <div className='absolute -left-20 -bottom-20 w-80 h-80 bg-primary/5 blur-[80px] rounded-full pointer-events-none' />

          <div className='relative z-10 space-y-10'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6'>
              <div className='space-y-1'>
                <h3 className='text-xl font-black text-white tracking-tight uppercase'>
                  Revenue Trajectory
                </h3>
                <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
                  Financial frequency per meridian period
                </p>
              </div>
              <div className='flex items-center gap-4 bg-white/[0.03] border border-white/5 p-2 rounded-xl'>
                <div className='flex items-center gap-2 px-3'>
                  <div className='h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]' />
                  <span className='text-[9px] font-black text-white uppercase tracking-tighter'>
                    Gross
                  </span>
                </div>
                <div className='flex items-center gap-2 px-3 opacity-30'>
                  <div className='h-2 w-2 rounded-full bg-slate-500' />
                  <span className='text-[9px] font-black text-white uppercase tracking-tighter'>
                    Target
                  </span>
                </div>
              </div>
            </div>

            <div className='h-72 w-full flex items-end justify-between gap-2.5 sm:gap-4'>
              {revenueLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className='flex-1 h-full flex items-end'>
                    <div className='w-full bg-white/5 animate-pulse rounded-t-xl h-1/2' />
                  </div>
                ))
              ) : revenueData?.length > 0 ? (
                revenueData.map((item, i) => {
                  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);
                  const height = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={i} className='flex-1 flex flex-col items-center gap-4 group/bar'>
                      <div className='relative w-full overflow-visible h-full flex items-end'>
                        <div
                          className='w-full rounded-t-xl bg-gradient-to-t from-primary/20 via-primary/60 to-primary shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-1000 group-hover/bar:brightness-125 group-hover/bar:shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />
                        <div className='absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-primary text-white text-[9px] font-black px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20'>
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                      <span className='text-[8px] sm:text-[9px] font-black text-slate-600 group-hover/bar:text-white transition-colors tracking-tighter uppercase'>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className='w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest'>
                  Insufficient Transaction Data
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Intelligence Panel */}
        <div className='space-y-10'>
          {/* System Pulse */}
          <Card className='glass-card border-none p-8 space-y-8 bg-primary/5 border border-primary/10 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16' />
            <div className='relative z-10'>
              <h4 className='text-xs font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2'>
                <Zap size={14} className='text-primary' /> Top Selling Products
              </h4>
              <div className='space-y-6'>
                {topSellingProducts.length > 0 ? (
                  topSellingProducts.map((item, idx) => {
                    // Calculate a rough percentage based on max sold for visual bar
                    const maxSold = Math.max(...topSellingProducts.map((p) => p.totalSold), 1);
                    const percentage = (item.totalSold / maxSold) * 100;
                    const colors = [
                      'text-emerald-400',
                      'text-primary',
                      'text-amber-400',
                      'text-rose-400',
                      'text-indigo-400',
                    ];
                    const color = colors[idx % colors.length];

                    return (
                      <div key={idx} className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]'>
                            {item.name}
                          </span>
                          <span className={cn('text-xs font-black', color)}>
                            {item.totalSold} Sold
                          </span>
                        </div>
                        <div className='h-1.5 w-full bg-white/5 rounded-full overflow-hidden'>
                          <div
                            className={cn('h-full bg-current transition-all duration-1000', color)}
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-4'>
                    No Sales Data
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions / Status */}
          <Card className='glass-card border-none p-8 bg-white/[0.01]'>
            <div className='flex items-center gap-4 mb-8'>
              <div className='h-10 w-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center'>
                <Layers size={18} className='text-slate-400' />
              </div>
              <div>
                <h4 className='text-sm font-black text-white uppercase tracking-tight'>
                  Recent Transactions
                </h4>
                <p className='text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none'>
                  Latest Order Activities
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((order, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl'
                  >
                    <div className='space-y-1'>
                      <p className='text-[10px] font-bold text-white tracking-tight leading-none'>
                        {order.user?.name || 'Guest'}
                      </p>
                      <p className='text-[9px] font-mono text-primary font-bold'>
                        #{order.orderNumber}
                      </p>
                    </div>
                    <div className='flex flex-col items-end gap-1'>
                      <span className='text-[10px] font-black text-emerald-400'>
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className='text-[8px] font-extrabold text-slate-600 uppercase'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-4'>
                  No Recent Orders
                </div>
              )}
            </div>
          </Card>

          {/* Low Stock Alerts */}
          <Card className='glass-card border-none p-8 bg-white/[0.01]'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center'>
                <Layers size={18} className='text-rose-400' />
              </div>
              <div>
                <h4 className='text-sm font-black text-rose-400 uppercase tracking-tight'>
                  Critical Stock
                </h4>
                <p className='text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none'>
                  Requires Restocking
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              {lowStockList.length > 0 ? (
                lowStockList.map((item, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl'
                  >
                    <div className='space-y-1 flex-1 min-w-0 pr-4'>
                      <p className='text-[10px] font-bold text-white tracking-tight leading-none truncate'>
                        {item.name}
                      </p>
                      <p className='text-[9px] font-mono text-slate-500 font-bold'>
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className='flex flex-col items-end gap-1'>
                      <span className='text-[10px] font-black text-rose-400'>
                        {item.stock} Left
                      </span>
                      <span className='text-[8px] font-extrabold text-slate-600 uppercase'>
                        Alert at {item.lowStockAlert}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-4'>
                  Inventory Healthy
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
