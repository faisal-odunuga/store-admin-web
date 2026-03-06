import { PageContainer } from '@/components/shared/PageContainer';
import { BarChart3, TrendingUp, Users, Banknote } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <PageContainer
      title='Analytics Overview'
      description='View store performance and sales metrics.'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <p className='text-sm font-semibold text-slate-500 uppercase tracking-wider'>
              Total Revenue
            </p>
            <div className='bg-primary/10 p-2 rounded-lg text-primary'>
              <Banknote className='h-5 w-5' />
            </div>
          </div>
          <p className='text-3xl font-black text-slate-900 dark:text-white'>₦45,231.89</p>
          <p className='text-emerald-600 text-sm font-bold mt-2 flex items-center gap-1'>
            <TrendingUp className='h-4 w-4' /> +20.1%
          </p>
        </div>
        <div className='bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <p className='text-sm font-semibold text-slate-500 uppercase tracking-wider'>
              Active Users
            </p>
            <div className='bg-blue-500/10 p-2 rounded-lg text-blue-500'>
              <Users className='h-5 w-5' />
            </div>
          </div>
          <p className='text-3xl font-black text-slate-900 dark:text-white'>+2350</p>
          <p className='text-emerald-600 text-sm font-bold mt-2 flex items-center gap-1'>
            <TrendingUp className='h-4 w-4' /> +180.1%
          </p>
        </div>
      </div>

      <div className='bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]'>
        <BarChart3 className='h-16 w-16 text-slate-300 dark:text-slate-700 mb-4' />
        <h3 className='text-xl font-bold text-slate-700 dark:text-slate-300'>
          Detailed Charts Coming Soon
        </h3>
        <p className='text-slate-500 text-sm mt-2'>More analytics modules are in development.</p>
      </div>
    </PageContainer>
  );
}
