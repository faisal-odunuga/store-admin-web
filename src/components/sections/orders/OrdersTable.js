'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { getOrderTabs } from '@/components/sections/orders/orderTableConfig';
import { getOrdersColumns } from './OrdersColumns';
import { exportToCSV, printContent, generateTableHTML } from '@/lib/exportUtils';
import { formatCurrency, formatDate } from '@/lib/utils';

const ORDER_HEADERS = [
  'Order #',
  'Customer',
  'Email',
  'Total',
  'Payment Status',
  'Order Status',
  'Date',
];

const toOrderRow = (o) => [
  o.orderNumber,
  o.user?.name || 'Guest',
  o.user?.email || '—',
  formatCurrency(o.totalAmount),
  o.paymentStatus,
  o.status,
  formatDate(o.createdAt),
];

export function OrdersTable({
  data = [],
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
  isLoading = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.set('page', '1');
    router.push(`/orders?${params.toString()}`);
  };

  const columns = React.useMemo(() => getOrdersColumns({ router }), [router]);
  const tabs = React.useMemo(() => getOrderTabs(data), [data]);

  const handleExportCSV = () => {
    exportToCSV('orders', ORDER_HEADERS, data.map(toOrderRow));
  };

  const handleExportPDF = () => {
    printContent(
      generateTableHTML('Orders Report', ORDER_HEADERS, data.map(toOrderRow)),
      'Orders Report',
    );
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder='Trace orders by reference, client or status...'
      tabs={tabs}
      activeTab={currentStatus}
      onTabChange={(val) => setStatusFilter(val || 'all')}
      onRefetch={onRefetch}
      manualPagination={!!onPaginationChange}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      paginationState={paginationState}
      isLoading={isLoading}
      rightElement={
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExportCSV}
            className='h-11 px-4 rounded-xl border-border bg-secondary font-bold text-xs gap-2 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all'
          >
            <Download className='h-4 w-4' /> CSV
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExportPDF}
            className='h-11 px-4 rounded-xl border-border bg-secondary font-bold text-xs gap-2 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all'
          >
            <FileText className='h-4 w-4' /> PDF
          </Button>
        </div>
      }
    />
  );
}
