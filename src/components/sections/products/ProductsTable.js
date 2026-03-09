'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';
import { getProductsColumns } from './ProductsColumns';

export function ProductsTable({
  data,
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
  isLoading = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const columns = React.useMemo(() => getProductsColumns({ router, setSelectedProduct }), [router]);

  const statusFilter = currentStatus;

  const filteredData = React.useMemo(() => {
    if (!statusFilter || statusFilter === 'all') return data;
    return data.filter((p) => {
      if (statusFilter === 'IN_STOCK') return p.stock > p.lowStockAlert;
      if (statusFilter === 'LOW_STOCK') return p.stock > 0 && p.stock <= p.lowStockAlert;
      if (statusFilter === 'OUT_OF_STOCK') return p.stock === 0;
      return true;
    });
  }, [data, statusFilter]);

  const counts = React.useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    data.forEach((product) => {
      if (product.stock === 0) outOfStock += 1;
      else if (product.stock <= product.lowStockAlert) lowStock += 1;
      else inStock += 1;
    });

    return { total: data.length, inStock, lowStock, outOfStock };
  }, [data]);

  const tabs = React.useMemo(
    () => [
      { label: 'All Catalogue', value: 'all', count: counts.total },
      { label: 'Sufficient', value: 'IN_STOCK', count: counts.inStock },
      { label: 'Low Alert', value: 'LOW_STOCK', count: counts.lowStock },
      { label: 'Depleted', value: 'OUT_OF_STOCK', count: counts.outOfStock },
    ],
    [counts],
  );

  return (
    <div className='w-full space-y-4'>
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder='Search inventory by name, code...'
        tabs={tabs}
        activeTab={statusFilter ?? 'all'}
        onTabChange={(val) => setStatusFilter(val || 'all')}
        onRefetch={onRefetch}
        manualPagination={!!onPaginationChange}
        pageCount={pageCount}
        onPaginationChange={onPaginationChange}
        paginationState={paginationState}
        isLoading={isLoading}
        rightElement={
          <Button
            onClick={() => router.push('/products/new')}
            className='bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl flex gap-3 shadow-lg shadow-primary/20 transition-all'
          >
            <Plus className='h-5 w-5' />
            <span className='hidden sm:inline'>Add Product</span>
          </Button>
        }
      />

      <StockAdjustmentDialog
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRefetch={onRefetch}
      />
    </div>
  );
}
