import { ChevronRight } from 'lucide-react';

const DataTimeline = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
  return (
    <div className='flex gap-2 items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight'>
      <span className='bg-slate-100 h-6 px-2.5 rounded-full flex items-center'>{startDate}</span>
      <ChevronRight className='w-3.5 h-3.5 text-slate-300' />
      <span className='bg-slate-100 h-6 px-2.5 rounded-full flex items-center text-indigo-600'>
        {endDate}
      </span>
    </div>
  );
};

export default DataTimeline;
