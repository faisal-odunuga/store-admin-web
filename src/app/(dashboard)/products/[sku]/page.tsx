'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Edit2,
  Trash2,
  Layers,
  Tag,
  Database,
  Banknote,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { useProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProductDetailPage() {
  const { sku } = useParams() as { sku: string };
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(sku);
  const { mutate: deleteProduct } = useDeleteProduct();

  React.useEffect(() => {
    if (product) {
      document.title = `${product.name} | Antigravity Store`;
    }
  }, [product]);

  const handleDelete = () => {
    if (!product) return;
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.success('Product deleted successfully');
        router.push('/products');
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, 'Failed to delete product'));
      },
    });
  };

  if (isLoading) {
    return (
      <PageContainer title='Product Details'>
        <div className='max-w-6xl mx-auto space-y-8'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-10 w-24 rounded-xl' />
            <Skeleton className='h-10 w-full rounded-xl' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Skeleton className='aspect-square rounded-2xl md:col-span-1' />
            <div className='md:col-span-2 space-y-4'>
              <Skeleton className='h-8 w-1/2 rounded-xl' />
              <Skeleton className='h-32 w-full rounded-xl' />
              <div className='grid grid-cols-2 gap-4'>
                <Skeleton className='h-24 w-full rounded-xl' />
                <Skeleton className='h-24 w-full rounded-xl' />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !product) {
    return (
      <PageContainer title='Error'>
        <div className='flex flex-col items-center justify-center h-96 gap-4'>
          <AlertCircle size={48} className='text-rose-500' />
          <p className='text-slate-600 font-medium'>Failed to load product details</p>
          <Button onClick={() => router.push('/products')} variant='outline' className='rounded-xl'>
            Back to products
          </Button>
        </div>
      </PageContainer>
    );
  }

  const stockStatus =
    product.stock === 0
      ? { label: 'Out of Stock', color: 'bg-rose-100 text-rose-700' }
      : product.stock <= product.lowStockAlert
        ? { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' }
        : { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' };

  return (
    <PageContainer
      title={product.name}
      description={`Manage and view detailed information for SKU: ${product.sku}`}
    >
      <div className='max-w-6xl mx-auto space-y-8 pb-12'>
        {/* Actions Bar */}
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            onClick={() => router.push('/products')}
            className='rounded-xl h-10 px-4 font-bold text-slate-500 hover:text-indigo-600 group'
          >
            <ArrowLeft size={18} className='mr-2 group-hover:-translate-x-1 transition-transform' />
            Back to Inventory
          </Button>
          <div className='flex items-center gap-3'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='outline'
                  className='rounded-xl h-10 px-4 font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                >
                  <Trash2 size={16} className='mr-2' /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='rounded-2xl border-slate-200 shadow-2xl'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{' '}
                    <strong>{product.name}</strong> from your inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='rounded-xl font-bold'>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='rounded-xl bg-rose-600 hover:bg-rose-700 font-bold'
                  >
                    Delete Product
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={() => router.push(`/products/${sku}/edit`)}
              className='rounded-xl h-10 px-6 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100'
            >
              <Edit2 size={16} className='mr-2' /> Edit Product
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Visuals & Info */}
          <div className='lg:col-span-2 space-y-8'>
            <Card className='border-slate-200 shadow-sm rounded-3xl overflow-hidden'>
              <div className='grid grid-cols-1 md:grid-cols-5'>
                <div className='md:col-span-2 relative aspect-square bg-slate-50 border-r border-slate-100'>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex items-center justify-center h-full text-slate-300'>
                      <Package size={64} />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-4 left-4 ${stockStatus.color} border-0 rounded-lg px-3 py-1 font-bold shadow-sm`}
                  >
                    {stockStatus.label}
                  </Badge>
                </div>
                <CardContent className='md:col-span-3 p-8 space-y-6'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className='rounded-md font-bold text-indigo-600 border-indigo-100 bg-indigo-50/50'
                      >
                        {product.category}
                      </Badge>
                      <span className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>
                        • SKU: {product.sku}
                      </span>
                    </div>
                    <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
                      {product.name}
                    </h1>
                    <p className='text-slate-500 text-sm leading-relaxed'>
                      {product.description || 'No description provided for this product.'}
                    </p>
                  </div>

                  <div className='grid grid-cols-2 gap-8'>
                    <div className='space-y-1'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>
                        Price
                      </p>
                      <p className='text-2xl font-black text-indigo-600 tracking-tight'>
                        {formatCurrency(product.sellingPrice)}
                      </p>
                      {product.discountPrice && (
                        <p className='text-xs text-slate-400 line-through'>
                          {formatCurrency(product.discountPrice)}
                        </p>
                      )}
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>
                        Availability
                      </p>
                      <p className='text-2xl font-black text-slate-900 tracking-tight'>
                        {product.stock} Units
                      </p>
                      <p className='text-[10px] font-bold text-slate-400'>
                        Alert level: {product.lowStockAlert}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='border-slate-200 shadow-sm rounded-2xl'>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                    <Banknote size={16} className='text-emerald-500' /> Financial Overview
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Cost Price</span>
                      <span className='font-bold text-slate-900'>
                        {formatCurrency(product.costPrice)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Selling Price</span>
                      <span className='font-bold text-slate-900'>
                        {formatCurrency(product.sellingPrice)}
                      </span>
                    </div>
                    <div className='pt-2 border-t border-slate-100 flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Potential Profit</span>
                      <span className='font-black text-emerald-600'>
                        +{formatCurrency(product.sellingPrice - product.costPrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-slate-200 shadow-sm rounded-2xl'>
                <CardContent className='p-6 space-y-4'>
                  <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                    <Clock size={16} className='text-indigo-500' /> System Info
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Created On</span>
                      <span className='font-medium text-slate-700'>
                        {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Last Updated</span>
                      <span className='font-medium text-slate-700'>
                        {format(new Date(product.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-slate-500'>Visibility</span>
                      <Badge
                        variant='secondary'
                        className={
                          product.isActive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }
                      >
                        {product.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className='space-y-6'>
            <Card className='border-slate-200 shadow-sm rounded-2xl bg-slate-900 text-white overflow-hidden relative'>
              <div className='relative z-10 p-6 space-y-4'>
                <div className='h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center'>
                  <ShieldCheck size={20} className='text-indigo-400' />
                </div>
                <h3 className='font-bold text-lg'>Inventory Sync</h3>
                <p className='text-slate-400 text-xs leading-relaxed'>
                  This product is currently synced with your global warehouse management system.
                </p>
                <div className='pt-2'>
                  <Button
                    variant='outline'
                    className='w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-10'
                  >
                    View Logs <ExternalLink size={14} className='ml-2' />
                  </Button>
                </div>
              </div>
              <div className='absolute -right-8 -bottom-8 h-32 w-32 bg-indigo-500/20 rounded-full blur-3xl' />
            </Card>

            <Card className='border-slate-200 shadow-sm rounded-2xl'>
              <CardContent className='p-6 space-y-4'>
                <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
                  Properties
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <div className='h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400'>
                      <Tag size={16} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-slate-400 uppercase'>Category</p>
                      <p className='text-sm font-bold text-slate-700'>{product.category}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400'>
                      <Layers size={16} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-slate-400 uppercase'>Barcode</p>
                      <p className='text-sm font-bold text-slate-700'>{product.barcode || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400'>
                      <Database size={16} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-slate-400 uppercase'>Weight (kg)</p>
                      <p className='text-sm font-bold text-slate-700'>{product.weight || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
