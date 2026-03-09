'use client';

import React from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SortableHeader({ column, title, className }) {
  if (!column.getCanSort()) {
    return <div className={cn('px-1', className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-2 h-full -ml-3', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className={cn(
              'h-8 px-3 data-[state=open]:bg-white/5 uppercase text-[10px] font-bold tracking-widest transition-all rounded-lg',
              isSorted
                ? 'text-primary bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:text-slate-300',
            )}
          >
            <span>{title}</span>
            <div className='ml-2 flex flex-col items-center'>
              {isSorted === 'desc' && <ArrowDown className='h-3 w-3' />}
              {isSorted === 'asc' && <ArrowUp className='h-3 w-3' />}
              {!isSorted && <ChevronsUpDown className='h-3 w-3 opacity-30' />}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          className='glass-morphism border-white/10 rounded-xl min-w-[120px]'
        >
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg cursor-pointer flex items-center gap-2 m-1'
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUp className='h-3.5 w-3.5' />
            <span>Ascending</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg cursor-pointer flex items-center gap-2 m-1'
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDown className='h-3.5 w-3.5' />
            <span>Descending</span>
          </DropdownMenuItem>
          {isSorted && (
            <DropdownMenuItem
              className='text-xs font-bold text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 rounded-lg cursor-pointer flex items-center gap-2 m-1'
              onClick={() => column.clearSorting()}
            >
              <X className='h-3.5 w-3.5' />
              <span>Remove</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
