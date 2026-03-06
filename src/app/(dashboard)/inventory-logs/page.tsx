'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { ErrorState } from '@/components/shared/ErrorState';
import { useInventoryLogs } from '@/hooks/useInventoryLogs';
import { InventoryLogsTable } from '@/components/sections/inventory/InventoryLogsTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';

export default function InventoryLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const type = searchParams.get('type') || 'all';

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('limit', newPagination.pageSize.toString());
    router.push(`/inventory-logs?${params.toString()}`);
  };

  React.useEffect(() => {
    document.title = 'Inventory Logs | Antigravity Store';
  }, []);

  const {
    data: logsData,
    isLoading,
    isError,
    refetch,
  } = useInventoryLogs({
    page,
    limit,
    type: type === 'all' ? undefined : type,
  });

  if (isLoading) {
    return (
      <PageContainer
        title='Inventory Logs'
        description='Monitor every stock movement and adjustment across your entire inventory.'
      >
        <div className='space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-16 w-full rounded-xl' />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError || !logsData) {
    return (
      <PageContainer title='Inventory Logs'>
        <ErrorState message='Failed to load inventory logs.' onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title='Inventory Logs'
      description='Monitor every stock movement and adjustment across your entire inventory.'
    >
      <InventoryLogsTable
        data={logsData.logs}
        onRefetch={refetch}
        pageCount={logsData.totalPages}
        onPaginationChange={setPagination}
        paginationState={pagination}
      />
    </PageContainer>
  );
}
