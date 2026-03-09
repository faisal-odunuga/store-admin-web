'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { EmptyState } from '../EmptyState';

import TableTabs from './Tabs';
import TableHeader from './TableHeader';
import { TableFooter } from './Footer';

export function DataTable({
  columns,
  data,
  searchPlaceholder = 'Search...',
  tabs,
  activeTab,
  onTabChange,
  onRefetch,
  rightElement,
  pageCount,
  manualPagination,
  onPaginationChange,
  paginationState,
  isLoading = false,
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      globalFilter,
      ...(paginationState && { pagination: paginationState }),
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    pageCount,
    onPaginationChange,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className='w-full space-y-6 animate-in'>
      {/* Top Bar */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
        <div className='flex flex-col sm:flex-row sm:items-start lg:items-center gap-4 flex-1 w-full'>
          <div className='relative w-full sm:w-[320px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-11 w-full pl-10 bg-white/[0.03] border-white/5 rounded-xl text-sm focus-visible:ring-primary/20 focus:bg-white/[0.05] transition-all'
            />
          </div>

          {tabs && tabs.length > 0 && (
            <div className='w-full sm:w-auto overflow-x-auto no-scrollbar'>
              <TableTabs
                tabs={tabs}
                activeTab={activeTab ?? 'all'}
                setActiveTab={(val) => onTabChange?.(val === 'all' ? null : val)}
              />
            </div>
          )}
        </div>

        <div className='flex items-center gap-2 sm:gap-3 justify-start sm:justify-end w-full lg:w-auto overflow-x-auto no-scrollbar'>
          {onRefetch && (
            <Button
              variant='outline'
              size='sm'
              className='h-11 px-4 rounded-xl border-white/5 bg-white/[0.03] font-bold text-xs flex gap-2 hover:bg-white/5 text-slate-400 hover:text-white transition-all group'
              onClick={() => {
                onRefetch();
                toast.info('Refetching data...', {
                  className: 'glass-morphism border-white/10 text-white',
                  duration: 2000,
                });
              }}
            >
              <RefreshCw
                size={14}
                className='group-hover:rotate-180 transition-transform duration-700'
              />
              Refetch
            </Button>
          )}
          {rightElement && <div className='shrink-0'>{rightElement}</div>}
        </div>
      </div>

      {/* Table Container */}
      <div className='glass-card overflow-hidden shadow-2xl shadow-black/20'>
        <Table>
          <TableHeader table={table} />
          <TableBody className='divide-y divide-white/5'>
            {isLoading || (!data && !table.getRowModel().rows?.length) ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className='hover:bg-transparent border-none'>
                  {columns.map((_, j) => (
                    <TableCell key={j} className='px-6 py-8'>
                      <div className='h-4 bg-white/5 rounded-full animate-pulse w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-white/[0.02] transition-colors border-none group'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-6 py-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length} className='h-96 text-center border-none'>
                  <div className='flex items-center justify-center h-full'>
                    <EmptyState
                      icon={AlertCircle}
                      title='No results found'
                      description="We couldn't find matches for your search. Try different keywords or check your filters."
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TableFooter table={table} />
      </div>
    </div>
  );
}
