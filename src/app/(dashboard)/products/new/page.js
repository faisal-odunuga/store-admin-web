'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/sections/products/ProductForm';
import { useCreateProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleCreate = (formData) => {
    createProduct(formData, {
      onSuccess: (newProduct) => {
        toast.success(`Product "${newProduct.name}" created successfully!`, {
          className: 'glass-morphism border-white/10 text-white',
        });
        router.push('/products');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create product', {
          className: 'glass-morphism border-white/10 text-white',
        });
      },
    });
  };

  return (
    <div className='max-w-5xl mx-auto'>
      <ProductForm onSubmit={handleCreate} isLoading={isPending} />
    </div>
  );
}
