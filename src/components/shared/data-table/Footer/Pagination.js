'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({ table }) {
  return (
    <div className='flex items-center space-x-2'>
      <button
        className='p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        className='p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft size={16} />
      </button>

      <div className='flex items-center gap-3 px-2'>
        <input
          type='number'
          min={1}
          max={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className='w-14 h-9 rounded-xl bg-white/5 border border-white/5 text-center font-bold text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all'
        />
        <span className='text-slate-500 font-bold text-xs uppercase tracking-wider'>
          of {table.getPageCount()}
        </span>
      </div>

      <button
        className='p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight size={16} />
      </button>

      <button
        className='p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}
