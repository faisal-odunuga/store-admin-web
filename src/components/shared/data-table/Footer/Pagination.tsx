import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className='flex items-center space-x-2'>
      <button
        className='p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all disabled:opacity-50'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        className='p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all disabled:opacity-50'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft size={16} />
      </button>

      <span className='flex items-center gap-2'>
        <input
          type='number'
          min={1}
          max={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className='w-12 h-8 rounded-lg border border-slate-200 text-center font-bold focus:ring-1 focus:ring-indigo-500 outline-none'
        />
        <span className='text-slate-400 font-bold'>of {table.getPageCount()}</span>
      </span>

      <button
        className='p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all disabled:opacity-50'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight size={16} />
      </button>

      <button
        className='p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all disabled:opacity-50'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}
