import * as React from 'react';
import Image from 'next/image';
import { PackagePlus, Eye, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { DataActions } from '@/components/shared/data-table/DataActions';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const getProductsColumns = ({ router, setSelectedProduct }) => [
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className='flex items-center gap-4 group min-w-[200px]'>
          <div className='h-12 w-12 rounded-2xl bg-white/5 border border-white/5 shrink-0 overflow-hidden shadow-lg transition-transform group-hover:scale-105'>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className='h-full w-full object-cover'
                width={48}
                height={48}
              />
            )}
          </div>
          <div className='flex flex-col min-w-0'>
            <span
              onClick={() => router.push(`/products/${product.sku.toLowerCase()}`)}
              className='text-sm font-bold text-white hover:text-primary transition-colors cursor-pointer truncate tracking-tight'
            >
              {product.name}
            </span>
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest'>
                {product.sku}
              </span>
              {product.barcode && (
                <span className='text-[9px] text-primary/60 font-mono tracking-tighter'>
                  | {product.barcode}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className='hidden md:block'>
        <span className='text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5'>
          {row.original.category || 'Uncategorized'}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'sellingPrice',
    header: 'Price',
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        {row.original.discountPrice ? (
          <>
            <div className='text-sm font-extrabold text-emerald-400 tracking-tight tabular-nums'>
              {formatCurrency(row.original.discountPrice)}
            </div>
            <div className='text-[10px] font-bold text-slate-500 line-through tracking-tight tabular-nums'>
              {formatCurrency(row.original.sellingPrice)}
            </div>
          </>
        ) : (
          <div className='text-sm font-extrabold text-white tracking-tight tabular-nums'>
            {formatCurrency(row.original.sellingPrice)}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Inventory',
    cell: ({ row }) => {
      const stock = row.original.stock;
      const lowStock = row.original.lowStockAlert;
      const isLow = stock <= lowStock;
      return (
        <div className='hidden sm:flex flex-col gap-1 min-w-[100px]'>
          <span
            className={cn(
              'text-sm font-extrabold tabular-nums tracking-tight',
              isLow ? 'text-rose-400' : 'text-white',
            )}
          >
            {stock} Units
          </span>
          <span
            className={cn(
              'text-[9px] font-black uppercase tracking-widest',
              isLow ? 'text-rose-500/60' : 'text-slate-500',
            )}
          >
            {isLow ? 'Action Required' : 'Optimal Level'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const stock = row.original.stock;
      const lowStock = row.original.lowStockAlert;
      let statusValue = 'IN_STOCK';
      if (stock === 0) statusValue = 'OUT_OF_STOCK';
      else if (stock <= lowStock) statusValue = 'LOW_STOCK';

      return (
        <DataStatus
          status={statusValue}
          labels={{
            IN_STOCK: 'Active',
            LOW_STOCK: 'Alert',
            OUT_OF_STOCK: 'Depleted',
          }}
          config={{
            bg: {
              IN_STOCK: 'bg-emerald-500/10',
              LOW_STOCK: 'bg-amber-500/10',
              OUT_OF_STOCK: 'bg-rose-500/10',
            },
            text: {
              IN_STOCK: 'text-emerald-400',
              LOW_STOCK: 'text-amber-400',
              OUT_OF_STOCK: 'text-rose-400',
            },
            dot: {
              IN_STOCK: 'bg-emerald-400',
              LOW_STOCK: 'bg-amber-400',
              OUT_OF_STOCK: 'bg-rose-400',
            },
          }}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex items-center gap-1 justify-end'>
        <Button
          variant='ghost'
          size='sm'
          className='h-9 w-9 p-0 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl'
          onClick={() => setSelectedProduct(row.original)}
          title='Adjust Stock'
        >
          <PackagePlus size={18} />
        </Button>
        <DataActions>
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'
            onClick={() => router.push(`/products/${row.original.sku.toLowerCase()}`)}
          >
            <Eye className='h-3.5 w-3.5' />
            <span>Full Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'
            onClick={() => router.push(`/products/${row.original.sku.toLowerCase()}/edit`)}
          >
            <Edit2 className='h-3.5 w-3.5' />
            <span>Edit Info</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='bg-white/5' />
          <DropdownMenuItem className='text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 rounded-lg m-1 cursor-pointer gap-2'>
            <Trash2 className='h-3.5 w-3.5' />
            <span>Remove Product</span>
          </DropdownMenuItem>
        </DataActions>
      </div>
    ),
  },
];
