'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';

import { OrdersTable } from '@/components/sections/orders/OrdersTable';
import { ErrorState } from '@/components/shared/ErrorState';
import { useOrders } from '@/hooks/useOrders';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const status = searchParams.get('status') || 'all';

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('limit', newPagination.pageSize.toString());
    router.push(`/orders?${params.toString()}`);
  };

  React.useEffect(() => {
    document.title = 'Orders Overview | Antigravity Store';
  }, []);

  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useOrders({
    page,
    limit,
    // status is handled by useOrders if supported by backend
    status: status === 'all' ? undefined : status,
  });

  if (isLoading) {
    return (
      <PageContainer
        title='Orders Overview'
        description='Manage and track your customer orders in real-time.'
      >
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !ordersData) {
    return (
      <PageContainer title='Orders Overview'>
        <ErrorState message='Failed to load orders data.' onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  const orders = ordersData.orders;

  return (
    <PageContainer
      title='Orders Overview'
      description='Manage and track your customer orders in real-time.'
    >
      <OrdersTable
        data={orders}
        onRefetch={refetch}
        pageCount={ordersData.totalPages}
        onPaginationChange={setPagination}
        paginationState={pagination}
      />
    </PageContainer>
  );
}
