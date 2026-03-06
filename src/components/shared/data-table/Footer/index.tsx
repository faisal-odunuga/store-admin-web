import { Table } from '@tanstack/react-table';
import { Pagination } from './Pagination';

export function TableFooter<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-center py-4 px-4 text-xs text-slate-700 font-medium space-y-4 sm:space-y-0'>
      <div className='flex items-center gap-3'>
        <span className='text-slate-500'>Items per page</span>
        <select
          className='border border-slate-200 rounded-lg bg-white shadow-sm p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer'
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <Pagination table={table} />
    </div>
  );
}
