'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { ErrorState } from '@/components/shared/ErrorState';
import { useProducts } from '@/hooks/useProducts';
import { useRouter, useSearchParams } from 'next/navigation';

import { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { ProductsTable } from '@/components/sections/products/ProductsTable';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('limit', newPagination.pageSize.toString());
    router.push(`/products?${params.toString()}`);
  };

  React.useEffect(() => {
    document.title = 'Product Inventory | Antigravity Store';
  }, []);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    page,
    limit,
    // Note: status filtering is still client-side in the table,
    // but we pass it as a query key dependency if we wanted server-side.
  });

  // console.log(products);

  if (isLoading) {
    return (
      <PageContainer
        title='Product Inventory'
        description="Manage your store's inventory and product listings."
      >
        <div className='space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-16 w-full rounded-xl' />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError || !products) {
    return (
      <PageContainer title='Product Inventory'>
        <ErrorState message='Failed to load products.' onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title='Product Inventory'
      description="Manage your store's inventory and product listings."
    >
      <ProductsTable
        data={products.products}
        onRefetch={refetch}
        pageCount={products.totalPages}
        onPaginationChange={setPagination}
        paginationState={pagination}
      />
    </PageContainer>
  );
}
