'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const TabItem = ({ item, activeTab, setActiveTab }) => {
  const { label, value, count } = item;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'pb-4 text-sm font-bold transition-all relative group flex items-center gap-2 px-1',
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <span className='whitespace-nowrap tracking-tight'>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            'px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all',
            isActive
              ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'bg-secondary text-muted-foreground group-hover:bg-secondary/70 group-hover:text-foreground',
          )}
        >
          {count}
        </span>
      )}
      {isActive && (
        <div className='absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-in fade-in slide-in-from-bottom-1 duration-500' />
      )}
    </button>
  );
};

export default TabItem;
