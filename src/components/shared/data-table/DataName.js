'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const DataName = ({ name, className }) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-3 py-1 cursor-pointer group w-full max-w-[280px]',
        className,
      )}
    >
      <h4 className='font-bold text-sm text-white hover:text-primary transition-colors truncate tracking-tight'>
        {name}
      </h4>
      <ExternalLink
        size={12}
        className='text-slate-500 opacity-0 group-hover:opacity-100 transition-all'
      />
    </div>
  );
};

export default DataName;
