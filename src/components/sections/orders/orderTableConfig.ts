import { Order } from '@/types/order';
import type { LucideIcon } from 'lucide-react';
import {
  Truck,
  Clock,
  PackageCheck,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Undo2,
} from 'lucide-react';

export const orderStatusConfig = {
  labels: {
    DELIVERED: 'Delivered',
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    CANCELLED: 'Cancelled',
    SHIPPED: 'Shipped',
    REFUNDED: 'Refunded',
  } as Record<string, string>,
  icons: {
    DELIVERED: PackageCheck,
    PENDING: Clock,
    PROCESSING: Truck,
    CANCELLED: XCircle,
    SHIPPED: Truck,
    REFUNDED: Undo2,
  } as Record<string, LucideIcon>,
  config: {
    bg: {
      DELIVERED: 'bg-emerald-50',
      PENDING: 'bg-amber-50',
      PROCESSING: 'bg-blue-50',
      CANCELLED: 'bg-rose-50',
      SHIPPED: 'bg-indigo-50',
      REFUNDED: 'bg-slate-50',
    } as Record<string, string>,
    text: {
      DELIVERED: 'text-emerald-600',
      PENDING: 'text-amber-600',
      PROCESSING: 'text-blue-600',
      CANCELLED: 'text-rose-600',
      SHIPPED: 'text-indigo-600',
      REFUNDED: 'text-slate-600',
    } as Record<string, string>,
    dot: {
      DELIVERED: 'bg-emerald-500',
      PENDING: 'bg-amber-500',
      PROCESSING: 'bg-blue-500',
      CANCELLED: 'bg-rose-500',
      SHIPPED: 'bg-indigo-500',
      REFUNDED: 'bg-slate-500',
    } as Record<string, string>,
  },
};

export const paymentStatusConfig = {
  labels: {
    PAID: 'Paid',
    PENDING: 'Pending',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  } as Record<string, string>,
  icons: {
    PAID: CheckCircle2,
    PENDING: Clock,
    FAILED: AlertCircle,
    REFUNDED: Undo2,
  } as Record<string, LucideIcon>,
  config: {
    bg: {
      PAID: 'bg-emerald-50',
      PENDING: 'bg-amber-50',
      FAILED: 'bg-rose-50',
      REFUNDED: 'bg-slate-50',
    } as Record<string, string>,
    text: {
      PAID: 'text-emerald-600',
      PENDING: 'text-amber-600',
      FAILED: 'text-rose-600',
      REFUNDED: 'text-slate-600',
    } as Record<string, string>,
    dot: {
      PAID: 'bg-emerald-500',
      PENDING: 'bg-amber-500',
      FAILED: 'bg-rose-500',
      REFUNDED: 'bg-slate-500',
    } as Record<string, string>,
  },
};

export const getOrderTabs = (data: Order[]) => {
  return [
    { label: 'All Orders', value: 'all', count: data.length },
    {
      label: 'Pending',
      value: 'PENDING',
      count: data.filter((o) => o.status === 'PENDING').length,
    },
    {
      label: 'Processing',
      value: 'PROCESSING',
      count: data.filter((o) => o.status === 'PROCESSING').length,
    },
    {
      label: 'Delivered',
      value: 'DELIVERED',
      count: data.filter((o) => o.status === 'DELIVERED').length,
    },
    {
      label: 'Cancelled',
      value: 'CANCELLED',
      count: data.filter((o) => o.status === 'CANCELLED').length,
    },
  ];
};
