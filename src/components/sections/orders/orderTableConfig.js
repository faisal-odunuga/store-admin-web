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
    PENDING: 'Waiting',
    PROCESSING: 'Processing',
    CANCELLED: 'Cancelled',
    SHIPPED: 'Dispatched',
    REFUNDED: 'Refunded',
  },
  icons: {
    DELIVERED: PackageCheck,
    PENDING: Clock,
    PROCESSING: Truck,
    CANCELLED: XCircle,
    SHIPPED: Truck,
    REFUNDED: Undo2,
  },
  config: {
    bg: {
      DELIVERED: 'bg-emerald-500/10',
      PENDING: 'bg-amber-500/10',
      PROCESSING: 'bg-blue-500/10',
      CANCELLED: 'bg-rose-500/10',
      SHIPPED: 'bg-indigo-500/10',
      REFUNDED: 'bg-slate-500/10',
    },
    text: {
      DELIVERED: 'text-emerald-400',
      PENDING: 'text-amber-400',
      PROCESSING: 'text-blue-400',
      CANCELLED: 'text-rose-400',
      SHIPPED: 'text-indigo-400',
      REFUNDED: 'text-slate-400',
    },
    dot: {
      DELIVERED: 'bg-emerald-400',
      PENDING: 'bg-amber-400',
      PROCESSING: 'bg-blue-400',
      CANCELLED: 'bg-rose-400',
      SHIPPED: 'bg-indigo-400',
      REFUNDED: 'bg-slate-400',
    },
  },
};

export const paymentStatusConfig = {
  labels: {
    PAID: 'Paid Fully',
    PENDING: 'Unpaid',
    FAILED: 'Payment Failed',
    REFUNDED: 'Refunded',
  },
  icons: {
    PAID: CheckCircle2,
    PENDING: Clock,
    FAILED: AlertCircle,
    REFUNDED: Undo2,
  },
  config: {
    bg: {
      PAID: 'bg-emerald-500/10',
      PENDING: 'bg-amber-500/10',
      FAILED: 'bg-rose-500/10',
      REFUNDED: 'bg-slate-500/10',
    },
    text: {
      PAID: 'text-emerald-400',
      PENDING: 'text-amber-400',
      FAILED: 'text-rose-400',
      REFUNDED: 'text-slate-400',
    },
    dot: {
      PAID: 'bg-emerald-400',
      PENDING: 'bg-amber-400',
      FAILED: 'bg-rose-400',
      REFUNDED: 'bg-slate-400',
    },
  },
};

export const getOrderTabs = (data = []) => {
  return [
    { label: 'All Shipments', value: 'all', count: data.length },
    {
      label: 'To Process',
      value: 'PENDING',
      count: data.filter((o) => o.status === 'PENDING').length,
    },
    {
      label: 'In Transit',
      value: 'SHIPPED',
      count: data.filter((o) => o.status === 'SHIPPED').length,
    },
    {
      label: 'Completed',
      value: 'DELIVERED',
      count: data.filter((o) => o.status === 'DELIVERED').length,
    },
    {
      label: 'Archived',
      value: 'CANCELLED',
      count: data.filter((o) => o.status === 'CANCELLED').length,
    },
  ];
};
