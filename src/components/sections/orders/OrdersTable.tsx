'use client';

import React from 'react';
import { createColumnHelper, ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import {
  Package,
  User as UserIcon,
  Calendar,
  CreditCard,
  Truck,
  Eye,
  Trash2,
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import DataName from '@/components/shared/data-table/DataName';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/order';
import { DataActions } from '@/components/shared/data-table/DataActions';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import {
  orderStatusConfig,
  getOrderTabs,
  paymentStatusConfig,
} from '@/components/sections/orders/orderTableConfig';

const columnHelper = createColumnHelper<Order>();

interface OrdersTableProps {
  data: Order[];
  onRefetch?: () => void;
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  paginationState?: PaginationState;
}

export function OrdersTable({
  data,
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
}: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const setStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/orders?${params.toString()}`);
  };

  const statusFilter = currentStatus;

  const columns: ColumnDef<Order>[] = [
    columnHelper.accessor('orderNumber', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <Package size={14} /> ID
        </span>
      ),
      cell: (info) => <span className='font-bold text-slate-600'>#{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.user?.name || row.userId, {
      id: 'customer',
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <UserIcon size={14} /> Customer
        </span>
      ),
      cell: (info) => <DataName name={info.getValue()} />,
    }),
    columnHelper.accessor('totalAmount', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <CreditCard size={14} /> Amount
        </span>
      ),
      cell: (info) => (
        <span className='font-bold text-slate-900'>{formatCurrency(Number(info.getValue()))}</span>
      ),
    }),
    columnHelper.accessor('paymentStatus', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <Wallet size={14} /> Payment
        </span>
      ),
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <DataStatus
            status={status}
            labels={paymentStatusConfig.labels}
            config={paymentStatusConfig.config}
            icon={paymentStatusConfig.icons[status]}
          />
        );
      },
    }),
    columnHelper.accessor('status', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <Truck size={14} /> Status
        </span>
      ),
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <DataStatus
            status={status}
            labels={orderStatusConfig.labels}
            config={orderStatusConfig.config}
            icon={orderStatusConfig.icons[status]}
          />
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <Calendar size={14} /> Date
        </span>
      ),
      cell: (info) => (
        <span className='text-slate-500 font-medium'>
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <DataActions>
          <DropdownMenuItem
            onClick={() => router.push(`/orders/${row.original.orderNumber.toLowerCase()}`)}
          >
            <Eye className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Package size={14} className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Order Items
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-rose-600'>
            <Trash2 className='mr-2 h-3.5 w-3.5' />
            Archive
          </DropdownMenuItem>
        </DataActions>
      ),
    }),
  ];

  // Filtering is now handled server-side via URL params
  const tableData = data;

  const tabs = getOrderTabs(data);

  return (
    <DataTable
      columns={columns}
      data={tableData}
      searchPlaceholder='Search orders (#id, customer, status)...'
      tabs={tabs}
      activeTab={statusFilter ?? 'all'}
      onTabChange={(val) => setStatusFilter(val || 'all')}
      onRefetch={onRefetch}
      manualPagination={!!onPaginationChange}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      paginationState={paginationState}
    />
  );
}
