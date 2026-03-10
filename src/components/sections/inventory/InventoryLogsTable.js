'use client';

import * as React from 'react';
import { Info, ArrowUpRight, ArrowDownLeft, Activity, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import DataStatus from '@/components/shared/data-table/DataStatus';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { exportToCSV } from '@/lib/exportUtils';

const LOG_HEADERS = ['Product', 'SKU', 'Type', 'Quantity', 'Note', 'Date'];

const toLogRow = (log) => [
  log.product?.name || 'Deleted Product',
  log.product?.sku || '—',
  log.type,
  String(log.quantity),
  log.note || 'Internal update',
  format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss'),
];

export function InventoryLogsTable({
  data = [],
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

  const setTypeFilter = (type) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!type || type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.set('page', '1');
    router.push(`/inventory-logs?${params.toString()}`);
  };

  const columns = [
    {
      accessorKey: 'product',
      header: 'Product Item',
      cell: ({ row }) => {
        const product = row.original.product;
        if (!product)
          return <span className='text-muted-foreground font-bold italic'>Deleted Product</span>;
        return (
          <div className='flex items-center gap-4 py-1 group'>
            <div className='h-12 w-12 relative rounded-2xl border border-border overflow-hidden bg-secondary shrink-0 shadow-lg group-hover:scale-105 transition-transform'>
              <Image
                src={product.imageUrl || 'https://via.placeholder.com/40'}
                alt={product.name}
                fill
                className='object-cover'
              />
            </div>
            <div className='flex flex-col min-w-0'>
              <span
                className='text-sm font-black text-primary truncate max-w-[200px] tracking-tight hover:text-primary/80 transition-colors cursor-pointer'
                onClick={() => router.push(`/products/${product.sku.toLowerCase()}`)}
              >
                {product.name}
              </span>
              <span className='text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest mt-0.5'>
                {product.sku}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Operation',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <DataStatus
            status={type}
            labels={{
              IN: 'Inbound',
              OUT: 'Outbound',
              ADJUSTMENT: 'Correction',
            }}
            config={{
              bg: {
                IN: 'bg-emerald-500/10',
                OUT: 'bg-rose-500/10',
                ADJUSTMENT: 'bg-amber-500/10',
              },
              text: {
                IN: 'text-emerald-400',
                OUT: 'text-rose-400',
                ADJUSTMENT: 'text-amber-400',
              },
              dot: {
                IN: 'bg-emerald-400',
                OUT: 'bg-rose-400',
                ADJUSTMENT: 'bg-amber-400',
              },
            }}
          />
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Impact',
      cell: ({ row }) => {
        const qty = row.original.quantity;
        const type = row.original.type;
        const color =
          type === 'IN' ? 'text-emerald-400' : type === 'OUT' ? 'text-rose-400' : 'text-amber-400';
        const Icon = type === 'IN' ? ArrowUpRight : type === 'OUT' ? ArrowDownLeft : Activity;

        return (
          <div className={cn('flex items-center gap-2 font-extrabold tabular-nums', color)}>
            <Icon size={14} strokeWidth={3} />
            <span className='text-sm'>
              {type === 'IN' ? '+' : type === 'OUT' ? '-' : ''}
              {Math.abs(qty)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Reasoning',
      cell: ({ row }) => (
        <div className='flex items-center gap-2 max-w-[220px]'>
          <Info size={12} className='text-primary opacity-60 shrink-0' />
          <span className='text-xs text-muted-foreground font-medium truncate italic'>
            {row.original.note || 'Internal update'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs text-foreground font-bold'>
            {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
          </span>
          <span className='text-[10px] text-muted-foreground font-extrabold uppercase tracking-tighter'>
            {format(new Date(row.original.createdAt), 'HH:mm:ss')}
          </span>
        </div>
      ),
    },
  ];

  const tabs = [
    { label: 'All Lifecycle', value: 'all', count: data.length },
    { label: 'Stock In', value: 'IN', count: data.filter((l) => l.type === 'IN').length },
    { label: 'Stock Out', value: 'OUT', count: data.filter((l) => l.type === 'OUT').length },
    {
      label: 'Man. Sync',
      value: 'ADJUSTMENT',
      count: data.filter((l) => l.type === 'ADJUSTMENT').length,
    },
  ];

  const handleExportCSV = () => {
    exportToCSV('inventory-logs', LOG_HEADERS, data.map(toLogRow));
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder='Trace logs by product, SKU or reasoning...'
      tabs={tabs}
      activeTab={currentType}
      onTabChange={(val) => setTypeFilter(val || 'all')}
      onRefetch={onRefetch}
      manualPagination={!!onPaginationChange}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      paginationState={paginationState}
      rightElement={
        <Button
          variant='outline'
          size='sm'
          onClick={handleExportCSV}
          className='h-11 px-4 rounded-xl border-border bg-secondary font-bold text-xs gap-2 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all'
        >
          <Download className='h-4 w-4' /> Export CSV
        </Button>
      }
    />
  );
}
