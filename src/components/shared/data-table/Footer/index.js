'use client';

import React from 'react';
import { Pagination } from './Pagination';

export function TableFooter({ table }) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-center py-6 px-8 text-xs text-muted-foreground font-black uppercase tracking-widest space-y-6 sm:space-y-0 border-t border-border bg-secondary/10'>
      <div className='flex items-center gap-4 bg-secondary/50 p-1.5 rounded-2xl border border-border shadow-inner'>
        <span className='pl-3 text-[10px] opacity-60'>Show</span>
        <select
          className='bg-transparent rounded-xl border-none px-3 py-1.5 focus:ring-0 outline-none cursor-pointer text-foreground font-black hover:text-primary transition-colors text-sm'
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize} className='bg-background text-foreground'>
              {pageSize}
            </option>
          ))}
        </select>
        <span className='pr-3 text-[10px] opacity-60'>Per Page</span>
      </div>

      <Pagination table={table} />
    </div>
  );
}
