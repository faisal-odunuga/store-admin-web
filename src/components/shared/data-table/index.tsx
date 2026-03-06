'use client';
import React from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { EmptyState } from '../EmptyState';

import TableTabs, { ITabItem } from './Tabs';
import TableHeader from './TableHeader';
import { TableFooter } from './Footer';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  tabs?: ITabItem[];
  activeTab?: string | null;
  onTabChange?: (value: string | null) => void;
  onRefetch?: () => void;
  rightElement?: React.ReactNode;
  pageCount?: number;
  manualPagination?: boolean;
  onPaginationChange?: OnChangeFn<PaginationState>;
  paginationState?: PaginationState;
}

export function DataTable<TData, TValue>({
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
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  // eslint-disable-next-line react-hooks/incompatible-library
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
    <div className='w-full space-y-4'>
      {/* Top Bar */}
      <div className='flex items-center justify-between pb-2'>
        <div className='flex items-center gap-3'>
          <div className='relative group'>
            <Button
              variant='outline'
              size='sm'
              className='h-9 rounded-lg border-slate-200 flex gap-2 font-bold text-slate-600 hover:bg-slate-50'
            >
              <Filter className='h-4 w-4' /> All
            </Button>
          </div>
          <div className='relative max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='h-9 w-[280px] pl-9 bg-white border-slate-200 rounded-lg text-sm focus-visible:ring-indigo-500'
            />
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {onRefetch && (
            <Button
              variant='outline'
              size='sm'
              className='h-9 px-4 rounded-lg border-slate-200 font-bold text-xs flex gap-2 hover:bg-slate-50 transition-all'
              onClick={() => {
                onRefetch();
                toast.info('Refetching data...');
              }}
            >
              <RefreshCw
                size={14}
                className='group-hover:rotate-180 transition-transform duration-500'
              />{' '}
              Refetch
            </Button>
          )}
          {rightElement}
        </div>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <TableTabs
          tabs={tabs}
          activeTab={activeTab ?? 'all'}
          setActiveTab={(val) => onTabChange?.(val === 'all' ? null : val)}
        />
      )}

      <div className='bg-white shadow-md border border-slate-200 rounded-lg overflow-hidden'>
        <Table>
          <TableHeader table={table} />
          <TableBody className='divide-y divide-slate-100'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-slate-50/50 transition-colors border-0'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-4 py-2.5'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-72 text-center'>
                  <div className='flex items-center justify-center h-full'>
                    <EmptyState
                      icon={AlertCircle}
                      title='No results found'
                      description="Try adjusting your filters or search terms to find what you're looking for."
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableFooter table={table} />
    </div>
  );
}
