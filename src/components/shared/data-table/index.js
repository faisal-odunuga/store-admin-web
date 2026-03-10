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
      <div className='flex flex-col gap-4'>
        {/* Row 1: Search + Tabs */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <div className='relative w-full sm:w-[320px] shrink-0 group'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-12 w-full pl-11 bg-secondary/50 border-border rounded-xl text-sm font-bold text-foreground focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/50 shadow-sm'
            />
          </div>

          {tabs && tabs.length > 0 && (
            <div className='min-w-0 overflow-x-auto no-scrollbar'>
              <TableTabs
                tabs={tabs}
                activeTab={activeTab ?? 'all'}
                setActiveTab={(val) => onTabChange?.(val === 'all' ? null : val)}
              />
            </div>
          )}
        </div>

        {/* Row 2: Action buttons */}
        {(onRefetch || rightElement) && (
          <div className='flex items-center gap-2 flex-wrap'>
            {onRefetch && (
              <Button
                variant='outline'
                size='sm'
                className='h-12 px-5 rounded-xl border-border bg-secondary/50 font-black text-[10px] uppercase tracking-widest flex gap-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all group shadow-sm active:scale-95'
                onClick={() => {
                  onRefetch();
                  toast.info('Refetching data...', {
                    className: 'bg-secondary text-foreground border-border font-bold',
                    duration: 2000,
                  });
                }}
              >
                <RefreshCw
                  size={14}
                  className='group-hover:rotate-180 transition-transform duration-700 text-primary'
                />
                Refetch
              </Button>
            )}
            {rightElement && <div className='flex items-center'>{rightElement}</div>}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className='glass-card overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20 font-medium'>
        <Table>
          <TableHeader table={table} />
          <TableBody className='divide-y divide-border'>
            {isLoading || (!data && !table.getRowModel().rows?.length) ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className='hover:bg-transparent border-none'>
                  {columns.map((_, j) => (
                    <TableCell key={j} className='px-6 py-8'>
                      <div className='h-4 bg-secondary rounded-full animate-pulse w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-secondary/30 transition-colors border-none group'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-6 py-4 text-foreground font-medium'>
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
