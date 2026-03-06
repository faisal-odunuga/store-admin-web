'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { ProductForm } from '@/components/sections/products/ProductForm';
import { useCreateProduct } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (formData: FormData) => {
    createProduct(formData, {
      onSuccess: () => {
        toast.success('Product created successfully!');
        router.push('/products');
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, 'Failed to create product'));
      },
    });
  };

  return (
    <PageContainer
      title='Add New Product'
      description='Create a new product listing in your store inventory.'
    >
      <div className='max-w-5xl mx-auto'>
        <ProductForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </PageContainer>
  );
}
