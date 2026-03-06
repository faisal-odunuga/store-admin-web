'use client';

import * as React from 'react';
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import {
  Package,
  Layers,
  Calendar,
  Banknote,
  PackagePlus,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { useAdjustStock } from '@/hooks/useInventory';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/data-table';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { DataActions } from '@/components/shared/data-table/DataActions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getErrorMessage } from '@/lib/errors';

const columnHelper = createColumnHelper<Product>();

interface ProductsTableProps {
  data: Product[];
  onRefetch?: () => void;
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  paginationState?: PaginationState;
}

export function ProductsTable({
  data,
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
}: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [adjustmentQty, setAdjustmentQty] = React.useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = React.useState<string>('Regular restock');
  const { mutate: adjustStock, isPending } = useAdjustStock();

  const setStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/products?${params.toString()}`);
  };

  const statusFilter = currentStatus;

  const handleAdjustStock = () => {
    if (!selectedProduct) return;
    if (adjustmentQty < 0 && Math.abs(adjustmentQty) > selectedProduct.stock) {
      toast.error('Stock adjustment would result in negative inventory.');
      return;
    }
    adjustStock(
      {
        id: selectedProduct.id,
        quantity: Math.abs(adjustmentQty),
        type: adjustmentQty > 0 ? 'IN' : 'OUT',
        note: adjustmentReason,
      },
      {
        onSuccess: () => {
          toast.success('Stock adjusted successfully');
          setSelectedProduct(null);
          setAdjustmentQty(0);
          onRefetch?.();
        },
        onError: (error: unknown) => {
          toast.error(getErrorMessage(error, 'Failed to adjust stock'));
        },
      },
    );
  };

  const columns: ColumnDef<Product, unknown>[] = [
    columnHelper.accessor('name', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Package size={14} className='text-slate-400' /> Product Name
        </span>
      ),
      cell: (info) => {
        const product = info.row.original;
        return (
          <div className='flex items-center gap-3'>
            <div className='h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0 overflow-hidden shadow-sm'>
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className='h-full w-full object-cover'
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className='flex flex-col min-w-0'>
              <span
                onClick={() => router.push(`/products/${product.sku.toLowerCase()}`)}
                className='text-sm font-bold text-indigo-600 hover:underline cursor-pointer truncate'
              >
                {product.name}
              </span>
              <span className='text-[10px] text-slate-400 font-medium'>{product.sku}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('category', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Layers size={14} className='text-slate-400' /> Category
        </span>
      ),
      cell: (info) => (
        <span className='text-xs font-medium text-slate-600'>
          {info.getValue() || 'Uncategorized'}
        </span>
      ),
    }),
    columnHelper.accessor('stock', {
      header: () => <span className='flex items-center gap-2 text-slate-400'>STATUS</span>,
      id: 'status',
      cell: (info) => {
        const stock = info.getValue() as number;
        const lowStock = info.row.original.lowStockAlert;
        let statusValue = 'IN_STOCK';
        if (stock === 0) statusValue = 'OUT_OF_STOCK';
        else if (stock <= lowStock) statusValue = 'LOW_STOCK';

        return (
          <DataStatus
            status={statusValue}
            labels={{
              IN_STOCK: 'In Stock',
              LOW_STOCK: 'Low Stock',
              OUT_OF_STOCK: 'Out of Stock',
            }}
            config={{
              bg: {
                IN_STOCK: 'bg-emerald-50',
                LOW_STOCK: 'bg-amber-50',
                OUT_OF_STOCK: 'bg-rose-50',
              },
              text: {
                IN_STOCK: 'text-emerald-600',
                LOW_STOCK: 'text-amber-600',
                OUT_OF_STOCK: 'text-rose-600',
              },
              dot: {
                IN_STOCK: 'bg-emerald-500',
                LOW_STOCK: 'bg-amber-500',
                OUT_OF_STOCK: 'bg-rose-500',
              },
            }}
          />
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: () => (
        <span className='flex items-center gap-2 text-slate-400'>
          <Calendar size={14} /> LAST UPDATE
        </span>
      ),
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className='text-xs text-slate-400'>N/A</span>;
        try {
          return (
            <span className='text-xs text-slate-500 font-medium'>
              {format(new Date(val), 'MMM dd, yyyy')}
            </span>
          );
        } catch {
          return <span className='text-xs text-slate-400'>Invalid Date</span>;
        }
      },
    }),
    columnHelper.accessor('stock', {
      header: () => <span className='flex items-center gap-2 text-slate-400'>STOCK</span>,
      cell: (info) => (
        <div className='bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md w-fit'>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('sellingPrice', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Banknote size={14} className='text-slate-400' /> Price
        </span>
      ),
      cell: (info) => (
        <div className='text-sm font-bold text-slate-900'>{formatCurrency(info.getValue())}</div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-slate-400 hover:text-indigo-600'
            onClick={() => setSelectedProduct(row.original)}
          >
            <PackagePlus size={16} />
          </Button>
          <DataActions>
            <DropdownMenuItem
              onClick={() => router.push(`/products/${row.original.sku.toLowerCase()}`)}
            >
              <Eye className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/products/${row.original.sku.toLowerCase()}/edit`)}
            >
              <Edit2 className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-rose-600'>
              <Trash2 className='mr-2 h-3.5 w-3.5' />
              Delete
            </DropdownMenuItem>
          </DataActions>
        </div>
      ),
    }),
  ];

  // Remove local statusFilter state as it's now driven by URL

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
      if (product.stock === 0) {
        outOfStock += 1;
      } else if (product.stock <= product.lowStockAlert) {
        lowStock += 1;
      } else {
        inStock += 1;
      }
    });

    return {
      total: data.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [data]);

  const tabs = React.useMemo(
    () => [
      { label: 'All Items', value: 'all', count: counts.total },
      { label: 'In Stock', value: 'IN_STOCK', count: counts.inStock },
      { label: 'Low Stock', value: 'LOW_STOCK', count: counts.lowStock },
      { label: 'Out of Stock', value: 'OUT_OF_STOCK', count: counts.outOfStock },
    ],
    [counts],
  );

  return (
    <div className='w-full'>
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder='Search products by name, sku...'
        tabs={tabs}
        activeTab={statusFilter ?? 'all'}
        onTabChange={(val) => setStatusFilter(val || 'all')}
        onRefetch={onRefetch}
        manualPagination={!!onPaginationChange}
        pageCount={pageCount}
        onPaginationChange={onPaginationChange}
        paginationState={paginationState}
        rightElement={
          <Button
            onClick={() => router.push('/products/new')}
            className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-4 rounded-lg flex gap-2 text-xs'
          >
            <Plus className='h-4 w-4' /> New product
          </Button>
        }
      />

      {/* Stock Adjustment Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className='sm:max-w-md rounded-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <PackagePlus className='h-5 w-5 text-emerald-600' />
              Adjust Stock: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-3 bg-slate-50 rounded-xl border border-slate-100 text-center'>
                <p className='text-[10px] text-slate-400 font-bold uppercase mb-1'>Current Stock</p>
                <p className='text-xl font-bold text-slate-900'>{selectedProduct?.stock}</p>
              </div>
              <div className='p-3 bg-primary/5 rounded-xl border border-primary/10 text-center'>
                <p className='text-[10px] text-primary font-bold uppercase mb-1'>New Balance</p>
                <p className='text-xl font-bold text-primary'>
                  {(selectedProduct?.stock || 0) + adjustmentQty}
                </p>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='qty' className='text-xs font-bold text-slate-700'>
                Adjustment Quantity (use - to decrease)
              </Label>
              <Input
                id='qty'
                type='number'
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                className='rounded-xl border-primary/10 h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='reason' className='text-xs font-bold text-slate-700'>
                Reason / Note
              </Label>
              <Input
                id='reason'
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder='e.g. Restock from supplier'
                className='rounded-xl border-primary/10 h-11'
              />
            </div>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              variant='ghost'
              onClick={() => setSelectedProduct(null)}
              className='rounded-xl font-bold'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustStock}
              disabled={isPending || adjustmentQty === 0}
              className='rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11'
            >
              {isPending ? (
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
              ) : (
                <PackagePlus className='h-4 w-4 mr-2' />
              )}
              Save Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { format } from 'date-fns';
