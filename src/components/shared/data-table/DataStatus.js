'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const DataStatus = ({ status, labels, config, icon: Icon }) => {
  const label = labels?.[status] || status;

  // Default glassmorphic colors if none provided
  const bgColor = config?.bg?.[status] || 'bg-white/5';
  const textColor = config?.text?.[status] || 'text-slate-400';
  const dotColor = config?.dot?.[status] || 'bg-slate-500';

  return (
    <div
      className={cn(
        'flex items-center justify-center w-fit h-7 px-3 gap-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5 whitespace-nowrap transition-all shadow-sm',
        bgColor,
        textColor,
      )}
    >
      {Icon ? (
        <Icon size={12} className='opacity-80' />
      ) : (
        <div className={cn('w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]', dotColor)} />
      )}
      {label}
    </div>
  );
};

export default DataStatus;
