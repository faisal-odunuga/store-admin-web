'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductForm } from '@/components/sections/products/ProductForm';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const { sku } = useParams();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(sku);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleUpdate = (formData) => {
    updateProduct(
      { id: product.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Product updated successfully!', {
            className: 'glass-morphism border-white/10 text-white',
          });
          router.push('/products');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update product', {
            className: 'glass-morphism border-white/10 text-white',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center gap-4'>
        <Loader2 className='h-10 w-10 text-primary animate-spin' />
        <p className='text-slate-500 font-bold uppercase tracking-widest text-xs'>
          Syncing Catalogue...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='h-[60vh] flex flex-col items-center justify-center gap-6'>
        <h2 className='text-2xl font-bold text-white'>Product not found</h2>
        <Button onClick={() => router.push('/products')}>Back to Inventory</Button>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <ProductForm initialData={product} onSubmit={handleUpdate} isLoading={isUpdating} />
    </div>
  );
}
