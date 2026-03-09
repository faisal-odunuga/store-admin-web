'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white ring-offset-background placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
