'use client';

import React from 'react';
import { Pagination } from './Pagination';
import { cn } from '@/lib/utils';

export function TableFooter({ table }) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-center py-6 px-6 text-xs text-slate-400 font-bold space-y-6 sm:space-y-0 border-t border-white/5'>
      <div className='flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5'>
        <span className='pl-3 text-[10px] uppercase tracking-widest opacity-60'>Show</span>
        <select
          className='bg-white/5 rounded-xl border-none p-2 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer text-white font-bold'
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize} className='bg-[#050b1a]'>
              {pageSize}
            </option>
          ))}
        </select>
        <span className='pr-3 text-[10px] uppercase tracking-widest opacity-60'>Per Page</span>
      </div>

      <Pagination table={table} />
    </div>
  );
}
