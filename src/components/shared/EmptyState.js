'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-500',
        className,
      )}
    >
      <div className='h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
        <Icon className='h-8 w-8 text-slate-500 group-hover:text-primary transition-colors' />
      </div>
      <h3 className='text-lg font-bold text-white mb-2 leading-tight tracking-tight'>{title}</h3>
      <p className='text-sm text-slate-500 max-w-[280px] leading-relaxed mb-8 font-medium'>
        {description}
      </p>
      {action && (
        <div className='animate-in slide-in-from-bottom-2 duration-700 delay-200'>{action}</div>
      )}
    </div>
  );
}
