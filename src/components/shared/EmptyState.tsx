'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-500'>
      <div className='h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 ring-1 ring-slate-100 shadow-sm'>
        <Icon className='h-8 w-8 text-slate-400' />
      </div>
      <h3 className='text-sm font-bold text-slate-900 mb-1'>{title}</h3>
      <p className='text-[11px] text-slate-400 max-w-[200px] leading-relaxed mb-6 font-medium'>
        {description}
      </p>
      {action && (
        <div className='animate-in slide-in-from-bottom-2 duration-700 delay-200'>{action}</div>
      )}
    </div>
  );
}
