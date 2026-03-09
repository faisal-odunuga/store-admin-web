'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Decrypting Secure Data...' }) {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-700'>
      <div className='relative'>
        {/* Central Pulse Ring */}
        <div className='absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse scale-150' />

        {/* Rotating Outer Ring */}
        <div className='h-24 w-24 rounded-full border-t-2 border-r-2 border-primary/20 animate-spin transition-all duration-1000' />

        {/* Inner Loader */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader2 className='h-10 w-10 text-primary animate-spin' strokeWidth={1.5} />
        </div>
      </div>

      <div className='text-center space-y-2 relative z-10'>
        <h3 className='text-white font-black text-lg tracking-tighter uppercase tabular-nums'>
          Processing
        </h3>
        <p className='text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.4em] translate-x-[0.2em]'>
          {message}
        </p>
      </div>

      {/* Decorative Orbs */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-20'>
        <div className='absolute top-0 right-0 w-2 h-2 rounded-full bg-primary animate-ping' />
        <div className='absolute bottom-10 left-0 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-700' />
      </div>
    </div>
  );
}
