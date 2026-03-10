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
      <div className='h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 border border-border shadow-sm'>
        <Icon className='h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors' />
      </div>
      <h3 className='text-lg font-bold text-foreground mb-2 leading-tight tracking-tight'>
        {title}
      </h3>
      <p className='text-sm text-muted-foreground max-w-[280px] leading-relaxed mb-8 font-medium'>
        {description}
      </p>
      {action && (
        <div className='animate-in slide-in-from-bottom-2 duration-700 delay-200'>{action}</div>
      )}
    </div>
  );
}
