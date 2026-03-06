'use client';

import { AlertCircle, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthMe } from '@/hooks/useAuthMe';

export default function Dashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();
  const { data: me } = useAuthMe();
  const isAdmin = me?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className='p-8 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Skeleton className='h-32 w-full rounded-xl' />
          <Skeleton className='h-32 w-full rounded-xl' />
          <Skeleton className='h-32 w-full rounded-xl' />
        </div>
        <Skeleton className='h-96 w-full rounded-xl' />
      </div>
    );
  }

  if (isError || !stats) {
    console.log('Error loading dashboard data:', error);
    return (
      <div className='p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
        <AlertCircle className='h-12 w-12 text-destructive' />
        <h2 className='text-xl font-bold'>Failed to load dashboard data</h2>
        <Button onClick={() => refetch()} variant='outline'>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='p-8 space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Total Revenue */}
        <div className='bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 p-5'>
          <div className='flex justify-between items-start mb-1'>
            <p className='text-xs font-semibold text-slate-800'>Total Revenue</p>
            <MoreHorizontal className='text-slate-400 h-4 w-4' />
          </div>
          <p className='text-[10px] text-slate-400 mb-3'>Accumulated</p>
          <div className='flex items-baseline gap-2'>
            <h3 className='text-2xl font-bold text-slate-900'>{formatCurrency(stats.revenue)}</h3>
            <span className='text-[10px] text-emerald-500 font-bold flex items-center'>
              Sales <TrendingUp className='h-3 w-3 ml-0.5' /> Active
            </span>
          </div>
          <div className='mt-4 flex justify-between items-center'>
            {isAdmin && stats.profit !== undefined ? (
              <p className='text-[10px] text-slate-400'>
                Total Profit{' '}
                <span className='text-slate-500 font-medium'>
                  {formatCurrency(stats.profit)}
                </span>
              </p>
            ) : (
              <span className='text-[10px] text-slate-400'>Profit visible to admin only</span>
            )}
            <Link
              href='/analytics'
              className='px-3 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50'
            >
              Details
            </Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className='bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 p-5'>
          <div className='flex justify-between items-start mb-1'>
            <p className='text-xs font-semibold text-slate-800'>Total Orders</p>
            <MoreHorizontal className='text-slate-400 h-4 w-4' />
          </div>
          <p className='text-[10px] text-slate-400 mb-3'>Global</p>
          <div className='flex items-baseline gap-2'>
            <h3 className='text-2xl font-bold text-slate-900'>{stats.orders.toLocaleString()}</h3>
            <span className='text-[10px] text-emerald-500 font-bold flex items-center'>
              Orders <TrendingUp className='h-3 w-3 ml-0.5' /> Stable
            </span>
          </div>
          <div className='mt-4 flex justify-between items-center'>
            <p className='text-[10px] text-slate-400'>
              Pending Orders{' '}
              <span className='text-slate-500 font-medium'>{stats.pendingOrders}</span>
            </p>
            <Link
              href='/orders'
              className='px-3 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50'
            >
              Details
            </Link>
          </div>
        </div>

        {/* Inventory Status */}
        <div className='bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 p-5'>
          <div className='flex justify-between items-start mb-1'>
            <p className='text-xs font-semibold text-slate-800'>Inventory Status</p>
            <MoreHorizontal className='text-slate-400 h-4 w-4' />
          </div>
          <p className='text-[10px] text-slate-400 mb-3'>Real-time</p>
          <div className='flex gap-8'>
            <div>
              <p className='text-[10px] text-slate-400 uppercase font-bold mb-1'>Active Products</p>
              <div className='flex items-baseline gap-1'>
                <span className='text-lg font-bold text-slate-900'>{stats.products}</span>
              </div>
            </div>
            <div>
              <p className='text-[10px] text-slate-400 uppercase font-bold mb-1'>Low Stock</p>
              <div className='flex items-baseline gap-1'>
                <span
                  className={`text-lg font-bold ${stats.lowStockProducts > 0 ? 'text-red-500' : 'text-slate-900'}`}
                >
                  {stats.lowStockProducts}
                </span>
              </div>
            </div>
          </div>
          <div className='mt-4 '>
            <Link
              href='/inventory-logs'
              className='w-full mt-2 py-2 text-[10px] font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors block text-center'
            >
              Manage Stock
            </Link>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Main Chart area */}
        <div className='lg:col-span-8 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 p-6'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h3 className='text-sm font-bold text-slate-800'>
                {isAdmin ? 'Revenue & Profit Over Time' : 'Revenue Over Time'}
              </h3>
            </div>
            <div className='flex gap-2'>
              <div className='flex bg-slate-50 p-0.5 rounded-lg border border-slate-100'>
                <button className='px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-slate-800 border border-slate-100'>
                  Last 30 days
                </button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-5 gap-4 mb-8'>
            <div className='text-center'>
              <p className='text-lg font-bold text-slate-900'>{stats.users}</p>
              <p className='text-[10px] text-slate-400 font-medium'>Total Customers</p>
            </div>
            <div className='text-center border-l border-slate-100'>
              <p className='text-lg font-bold text-slate-900'>{stats.products}</p>
              <p className='text-[10px] text-slate-400 font-medium'>Total Products</p>
            </div>
            <div className='text-center border-l border-slate-100'>
              <p className='text-lg font-bold text-slate-900'>
                {stats.products - stats.lowStockProducts}
              </p>
              <p className='text-[10px] text-slate-400 font-medium'>Stock Clear</p>
            </div>
            <div className='text-center border-l border-slate-100'>
              <p className='text-lg font-bold text-red-500'>{stats.lowStockProducts}</p>
              <p className='text-[10px] text-slate-400 font-medium'>Low Stock</p>
            </div>
            <div className='text-center border-l border-slate-100'>
              <p className='text-lg font-bold text-slate-900'>{formatCurrency(stats.revenue)}</p>
              <p className='text-[10px] text-slate-400 font-medium'>Revenue</p>
            </div>
          </div>

          <div className='h-56 relative group'>
            {/* Simple Dynamic SVG Chart */}
            <svg className='w-full h-full' preserveAspectRatio='none' viewBox='0 0 800 200'>
              {/* Simplified chart line for now */}
              <path
                d='M0 160 L 800 130'
                fill='none'
                stroke='#3ba376'
                strokeLinecap='round'
                strokeWidth='2.5'
              ></path>
            </svg>
            <div className='flex justify-between mt-4 text-[10px] font-semibold text-slate-400 px-2'>
              <span>Today</span>
              <span>Yesterday</span>
              <span>-2d</span>
              <span>-3d</span>
              <span>-4d</span>
              <span>-5d</span>
              <span>-6d</span>
            </div>
          </div>
        </div>

        {/* User Stats Card */}
        <div className='lg:col-span-4 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h4 className='text-[11px] font-bold text-indigo-700'>Customer Overview</h4>
            <MoreHorizontal className='text-slate-400 h-4 w-4' />
          </div>
          <h2 className='text-3xl font-extrabold text-slate-900 mb-2'>{stats.users}</h2>
          <p className='text-[10px] text-slate-400 mb-6'>Direct Users registered</p>

          <div className='space-y-4 pt-4 border-t border-slate-50'>
            <div className='flex items-center justify-between text-[11px] font-bold'>
              <span className='text-slate-800'>Recent Activity</span>
            </div>
            <p className='text-[10px] text-slate-400'>
              User synchronization is managed via Clerk webhooks.
            </p>
            <Link
              href='/users'
              className='w-full mt-2 py-2 text-[10px] font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors block text-center'
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
