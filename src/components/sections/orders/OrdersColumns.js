import * as React from 'react';
import { format } from 'date-fns';
import { CreditCard, Truck, Trash2, Hash, ArrowUpRight } from 'lucide-react';
import DataName from '@/components/shared/data-table/DataName';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { formatCurrency } from '@/lib/utils';
import { DataActions } from '@/components/shared/data-table/DataActions';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  orderStatusConfig,
  paymentStatusConfig,
} from '@/components/sections/orders/orderTableConfig';

export const getOrdersColumns = ({ router }) => [
  {
    accessorKey: 'orderNumber',
    header: 'Order Ref',
    cell: ({ row }) => (
      <div
        className='flex items-center gap-2 group cursor-pointer'
        onClick={() => router.push(`/orders/${row.original.orderNumber.toLowerCase()}`)}
      >
        <div className='p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-primary/30 transition-colors'>
          <Hash size={14} className='text-slate-500 group-hover:text-primary' />
        </div>
        <span className='font-bold text-white tracking-widest text-xs uppercase'>
          {row.original.orderNumber}
        </span>
      </div>
    ),
  },
  {
    id: 'customer',
    header: 'Client Details',
    cell: ({ row }) => {
      const customerName = row.original.user?.name || row.original.userId || 'Guest Client';
      return (
        <div className='flex flex-col gap-1'>
          <DataName name={customerName} />
          <span className='text-[10px] text-slate-500 font-extrabold uppercase tracking-tighter opacity-70'>
            Registered User
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Transaction',
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-extrabold text-white tracking-tight text-sm'>
          {formatCurrency(row.original.totalAmount)}
        </span>
        <span className='text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none flex items-center gap-1'>
          <CreditCard size={10} /> {row.original.items?.length || 0} Products
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Pay Status',
    cell: ({ row }) => (
      <DataStatus
        status={row.original.paymentStatus}
        labels={paymentStatusConfig.labels}
        config={paymentStatusConfig.config}
        icon={paymentStatusConfig.icons[row.original.paymentStatus]}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Logistics',
    cell: ({ row }) => (
      <div className='hidden sm:block'>
        <DataStatus
          status={row.original.status}
          labels={orderStatusConfig.labels}
          config={orderStatusConfig.config}
          icon={orderStatusConfig.icons[row.original.status]}
        />
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Placement',
    cell: ({ row }) => (
      <div className='hidden md:flex items-center gap-2'>
        <div className='h-1.5 w-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(59,130,246,0.5)]' />
        <span className='text-slate-400 font-bold text-xs tabular-nums uppercase'>
          {format(new Date(row.original.createdAt), 'MMM dd, HH:mm')}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <DataActions>
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'
            onClick={() => router.push(`/orders/${row.original.orderNumber.toLowerCase()}`)}
          >
            <ArrowUpRight className='h-3.5 w-3.5' />
            <span>View Full Receipt</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'>
            <Truck className='h-3.5 w-3.5' />
            <span>Update Logistics</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='bg-white/5' />
          <DropdownMenuItem className='text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 rounded-lg m-1 cursor-pointer gap-2'>
            <Trash2 className='h-3.5 w-3.5' />
            <span>Archive Record</span>
          </DropdownMenuItem>
        </DataActions>
      </div>
    ),
  },
];
