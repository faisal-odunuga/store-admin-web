'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import {
  Loader2,
  ChevronLeft,
  Settings,
  Package,
  ExternalLink,
  Banknote,
  Database,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProductDetailsPage() {
  const { sku } = useParams();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(sku);

  if (isLoading) {
    return (
      <div className='h-[70vh] flex flex-col items-center justify-center gap-4'>
        <Loader2 className='h-12 w-12 text-primary animate-spin' />
        <p className='text-slate-500 font-extrabold tracking-widest text-[10px] uppercase'>
          Retrieving Item Data...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='h-[70vh] flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold text-white'>Resource Not Found</h1>
        <Button onClick={() => router.push('/products')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className='space-y-10 pb-20 animate-in'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='h-11 w-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white'
            onClick={() => router.push('/products')}
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className='text-3xl font-extrabold text-white tracking-tight'>{product.name}</h1>
            <div className='flex items-center gap-3 mt-2'>
              <span className='text-[10px] font-extrabold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md tracking-widest uppercase'>
                {product.sku}
              </span>
              <span className='text-[10px] font-extrabold px-2 py-0.5 bg-white/5 text-slate-400 border border-white/5 rounded-md tracking-widest uppercase'>
                {product.category}
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            className='border-white/5 bg-white/[0.02] text-white font-bold h-11 px-6 rounded-xl hover:bg-white/5'
            onClick={() => router.push(`/products/${product.sku.toLowerCase()}/edit`)}
          >
            <Settings className='mr-2 h-4 w-4' /> Edit Info
          </Button>
          <Button className='bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20'>
            <ExternalLink className='mr-2 h-4 w-4' /> Preview Live
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {/* Main Visual & Description */}
        <div className='lg:col-span-2 space-y-10'>
          <div className='glass-card overflow-hidden'>
            <div className='aspect-[16/9] relative bg-white/[0.01]'>
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className='object-contain p-10'
                />
              )}
            </div>
            <div className='p-10 border-t border-white/5'>
              <h3 className='text-lg font-bold text-white mb-6 uppercase tracking-widest opacity-60 flex items-center gap-2'>
                <Layers size={14} className='text-primary' /> Story & Specifications
              </h3>
              <div className='prose prose-invert max-w-none'>
                <p className='text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-line'>
                  {product.description || 'No detailed description provided for this item.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Metrics Sidebar */}
        <div className='space-y-8'>
          {/* Performance Card */}
          <div className='glass-card p-8 space-y-8 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16' />

            <div className='space-y-6 relative z-10'>
              <div>
                <p className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2'>
                  Market Valuation
                </p>
                <h2 className='text-4xl font-extrabold text-white tracking-tighter tabular-nums'>
                  {formatCurrency(product.sellingPrice)}
                </h2>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-white/5 rounded-2xl border border-white/5'>
                  <p className='text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1'>
                    Stock Position
                  </p>
                  <p className='text-xl font-bold text-white'>{product.stock} Units</p>
                </div>
                <div className='p-4 bg-white/5 rounded-2xl border border-white/5'>
                  <p className='text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1'>
                    Purchase Cost
                  </p>
                  <p className='text-xl font-bold text-white tracking-tighter'>
                    {formatCurrency(product.costPrice)}
                  </p>
                </div>
              </div>

              <div className='p-5 bg-primary/5 rounded-2xl border border-primary/10'>
                <div className='flex justify-between items-center mb-3'>
                  <p className='text-[10px] font-extrabold text-primary uppercase tracking-widest'>
                    Potential Profit
                  </p>
                  <span className='text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full'>
                    +{' '}
                    {Math.round(
                      ((product.sellingPrice - product.costPrice) / product.costPrice) * 100,
                    )}
                    %
                  </span>
                </div>
                <h3 className='text-2xl font-extrabold text-white tracking-tight'>
                  {formatCurrency(product.sellingPrice - product.costPrice)}{' '}
                  <span className='text-slate-600 text-sm font-medium'>/ unit</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Registry Details */}
          <div className='glass-card p-8 space-y-6'>
            <h4 className='text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2 opacity-60'>
              <Calendar size={14} className='text-primary' /> Registry Information
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-3 border-b border-white/5'>
                <span className='text-xs text-slate-500 font-bold uppercase tracking-wider'>
                  Date Created
                </span>
                <span className='text-xs text-white font-bold'>
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className='flex justify-between items-center py-3 border-b border-white/5'>
                <span className='text-xs text-slate-500 font-bold uppercase tracking-wider'>
                  Last Modification
                </span>
                <span className='text-xs text-white font-bold'>
                  {formatDate(product.updatedAt)}
                </span>
              </div>
              <div className='flex justify-between items-center py-3'>
                <span className='text-xs text-slate-500 font-bold uppercase tracking-wider'>
                  Storage ID
                </span>
                <span className='text-[10px] font-mono text-primary font-bold'>{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
