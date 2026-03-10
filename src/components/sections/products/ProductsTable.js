'use client';

import * as React from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';
import { getProductsColumns } from './ProductsColumns';
import { exportToCSV, printContent, generateTableHTML } from '@/lib/exportUtils';
import { formatCurrency } from '@/lib/utils';

const getStockStatus = (product) => {
  if (product.stock === 0) return 'Out of Stock';
  if (product.stock <= product.lowStockAlert) return 'Low Stock';
  return 'In Stock';
};

const PRODUCT_HEADERS = [
  'Name',
  'SKU',
  'Barcode',
  'Category',
  'Selling Price',
  'Discount Price',
  'Stock',
  'Status',
];

const toProductRow = (p) => [
  p.name,
  p.sku,
  p.barcode || '—',
  p.category || 'Uncategorized',
  formatCurrency(p.sellingPrice),
  p.discountPrice ? formatCurrency(p.discountPrice) : '—',
  String(p.stock),
  getStockStatus(p),
];

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

  const handleExportCSV = () => {
    const rows = filteredData.map(toProductRow);
    exportToCSV('products', PRODUCT_HEADERS, rows);
  };

  const handleExportPDF = () => {
    const rows = filteredData.map(toProductRow);
    printContent(
      generateTableHTML('Product Inventory Report', PRODUCT_HEADERS, rows),
      'Products Report',
    );
  };

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
            <Button
              onClick={() => router.push('/products/new')}
              className='bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl flex gap-3 shadow-lg shadow-primary/20 transition-all'
            >
              <Plus className='h-5 w-5' />
              <span className='hidden sm:inline'>Add Product</span>
            </Button>
          </div>
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
