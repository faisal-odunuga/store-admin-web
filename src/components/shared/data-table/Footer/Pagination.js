'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Pagination({ table }) {
  return (
    <div className='flex items-center space-x-2'>
      <button
        className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border shadow-sm active:scale-95'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border shadow-sm active:scale-95'
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
          className='w-16 h-10 rounded-xl bg-secondary/50 border border-border text-center font-black text-foreground focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner text-sm'
        />
        <span className='text-muted-foreground font-black text-[10px] uppercase tracking-widest opacity-60'>
          of {table.getPageCount()}
        </span>
      </div>

      <button
        className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border shadow-sm active:scale-95'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight size={16} />
      </button>

      <button
        className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-border shadow-sm active:scale-95'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}
