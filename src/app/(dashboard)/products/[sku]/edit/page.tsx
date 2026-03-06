'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shared/PageContainer';
import { ProductForm } from '@/components/sections/products/ProductForm';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/errors';

export default function EditProductPage() {
  const { sku } = useParams() as { sku: string };
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(sku);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  React.useEffect(() => {
    if (product) {
      document.title = `Edit: ${product.name} | Antigravity Store`;
    }
  }, [product]);

  const handleSubmit = (formData: FormData) => {
    if (!product) return;
    updateProduct(
      { id: product.id, payload: formData },
      {
        onSuccess: () => {
          toast.success('Product updated successfully!');
          router.push(`/products/${sku}`);
        },
        onError: (error: unknown) => {
          toast.error(getErrorMessage(error, 'Failed to update product'));
        },
      },
    );
  };

  if (isLoading) {
    return (
      <PageContainer title='Edit Product'>
        <div className='max-w-5xl mx-auto space-y-6'>
          <Skeleton className='h-12 w-1/4 rounded-xl' />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Skeleton className='h-[400px] md:col-span-2 rounded-2xl' />
            <Skeleton className='h-[400px] rounded-2xl' />
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
          <p className='text-slate-600 font-medium'>Failed to load product for editing</p>
          <Button onClick={() => router.push('/products')} variant='outline' className='rounded-xl'>
            Back to products
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Edit Product: ${product.name}`}
      description='Update product listing details and inventory settings.'
    >
      <div className='max-w-5xl mx-auto'>
        <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </PageContainer>
  );
}
