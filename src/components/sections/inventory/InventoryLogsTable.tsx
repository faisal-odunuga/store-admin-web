'use client';

import * as React from 'react';
import { ColumnDef, createColumnHelper, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { Package, Calendar, Info } from 'lucide-react';
import { InventoryLog } from '@/lib/apiService';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import DataStatus from '@/components/shared/data-table/DataStatus';
import Image from 'next/image';

const columnHelper = createColumnHelper<InventoryLog>();

interface InventoryLogsTableProps {
  data: InventoryLog[];
  onRefetch?: () => void;
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  paginationState?: PaginationState;
}

export function InventoryLogsTable({
  data,
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
}: InventoryLogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

  const setTypeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!type || type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.set('page', '1');
    router.push(`/inventory-logs?${params.toString()}`);
  };

  const columns: ColumnDef<InventoryLog>[] = [
    columnHelper.accessor('product', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Package size={14} className='text-slate-400' /> Product
        </span>
      ),
      cell: (info) => {
        const product = info.getValue();
        if (!product) return <span className='text-slate-400'>Unknown Product</span>;
        return (
          <div className='flex items-center gap-3 py-1'>
            <div className='h-10 w-10 relative rounded-lg border border-slate-100 overflow-hidden bg-slate-50 shrink-0'>
              <Image
                src={product.imageUrl || 'https://via.placeholder.com/40'}
                alt={product.name}
                fill
                className='object-cover'
              />
            </div>
            <div className='flex flex-col min-w-0'>
              <span className='text-sm font-bold text-slate-900 truncate max-w-[180px]'>
                {product.name}
              </span>
              <span className='text-[10px] text-slate-400 font-medium font-mono uppercase'>
                {product.sku}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('type', {
      header: () => <span className='flex items-center gap-2 text-slate-400'>TYPE</span>,
      cell: (info) => {
        const type = info.getValue();
        return (
          <DataStatus
            status={type}
            labels={{
              IN: 'Restock',
              OUT: 'Sale/Removal',
              ADJUSTMENT: 'Adjustment',
            }}
            config={{
              bg: {
                IN: 'bg-emerald-50',
                OUT: 'bg-rose-50',
                ADJUSTMENT: 'bg-amber-50',
              },
              text: {
                IN: 'text-emerald-600',
                OUT: 'text-rose-600',
                ADJUSTMENT: 'text-amber-600',
              },
              dot: {
                IN: 'bg-emerald-500',
                OUT: 'bg-rose-500',
                ADJUSTMENT: 'bg-amber-500',
              },
            }}
          />
        );
      },
    }),
    columnHelper.accessor('quantity', {
      header: () => <span className='text-slate-400 text-right block'>QTY</span>,
      cell: (info) => {
        const qty = info.getValue();
        const type = info.row.original.type;
        const color =
          type === 'IN' ? 'text-emerald-600' : type === 'OUT' ? 'text-rose-600' : 'text-slate-600';
        const prefix = type === 'IN' ? '+' : type === 'OUT' ? '-' : '';

        return (
          <div className={`text-sm font-bold text-right ${color}`}>
            {prefix}
            {Math.abs(qty)}
          </div>
        );
      },
    }),
    columnHelper.accessor('note', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Info size={14} className='text-slate-400' /> Note / Reason
        </span>
      ),
      cell: (info) => (
        <span className='text-xs text-slate-500 line-clamp-1 max-w-[200px]'>
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Calendar size={14} className='text-slate-400' /> Date
        </span>
      ),
      cell: (info) => (
        <div className='flex flex-col'>
          <span className='text-sm text-slate-700 font-medium'>
            {format(new Date(info.getValue()), 'MMM dd, yyyy')}
          </span>
          <span className='text-[10px] text-slate-400 font-medium'>
            {format(new Date(info.getValue()), 'HH:mm a')}
          </span>
        </div>
      ),
    }),
  ];

  const tabs = [
    { label: 'All Activities', value: 'all', count: data.length },
    { label: 'Restocks', value: 'IN', count: data.filter((l) => l.type === 'IN').length },
    { label: 'Sales/Out', value: 'OUT', count: data.filter((l) => l.type === 'OUT').length },
    {
      label: 'Adjustments',
      value: 'ADJUSTMENT',
      count: data.filter((l) => l.type === 'ADJUSTMENT').length,
    },
  ];

  return (
    <div className='w-full'>
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder='Search logs by product, note...'
        tabs={tabs}
        activeTab={currentType}
        onTabChange={(val) => setTypeFilter(val || 'all')}
        onRefetch={onRefetch}
        manualPagination={!!onPaginationChange}
        pageCount={pageCount}
        onPaginationChange={onPaginationChange}
        paginationState={paginationState}
      />
    </div>
  );
}
