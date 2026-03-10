'use client';

import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductsTable } from '@/components/sections/products/ProductsTable';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') || undefined;

  const { data, isLoading, refetch } = useProducts({
    page,
    status,
    limit: 10,
  });
  const handlePaginationChange = (updater) => {
    const newState =
      typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: 10 }) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newState.pageIndex + 1).toString());
    router.push(`/products?${params.toString()}`);
  };

  const paginationState = {
    pageIndex: page - 1,
    pageSize: 10,
  };

  return (
    <div className='space-y-8 pb-10'>
      <div className='animate-in'>
        <h1 className='text-3xl font-extrabold text-foreground tracking-tight mb-2 uppercase'>
          Product Inventory
        </h1>
        <p className='text-muted-foreground font-medium'>
          Manage your catalogue, track stock levels and update pricing.
        </p>
      </div>

      <div className='animate-in' style={{ animationDelay: '0.1s' }}>
        <ProductsTable
          data={data?.products || []}
          isLoading={isLoading}
          onRefetch={refetch}
          pageCount={data?.totalPages || 1}
          onPaginationChange={handlePaginationChange}
          paginationState={paginationState}
        />
      </div>
    </div>
  );
}
