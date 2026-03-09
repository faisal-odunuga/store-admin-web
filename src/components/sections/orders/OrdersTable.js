'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { getOrderTabs } from '@/components/sections/orders/orderTableConfig';
import { getOrdersColumns } from './OrdersColumns';

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
    />
  );
}
