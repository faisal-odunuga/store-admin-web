'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Package,
  Banknote,
  Database,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  sku: z.string().min(3, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  costPrice: z.coerce.number().min(0, 'Cost price must be positive'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be positive'),
  discountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  lowStockAlert: z.coerce.number().min(0, 'Alert level cannot be negative'),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const toInputValue = (value: unknown) =>
    typeof value === 'number' || typeof value === 'string' ? value : '';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          sku: initialData.sku,
          category: initialData.category || '',
          costPrice: initialData.costPrice,
          sellingPrice: initialData.sellingPrice,
          discountPrice: initialData.discountPrice,
          stock: initialData.stock,
          lowStockAlert: initialData.lowStockAlert,
          isActive: initialData.isActive,
        }
      : {
          name: '',
          description: '',
          sku: '',
          category: '',
          costPrice: 0,
          sellingPrice: 0,
          stock: 0,
          lowStockAlert: 5,
          isActive: true,
        },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (values: ProductFormValues) => {
    const parsed = productSchema.parse(values) as ProductFormOutput;
    const formData = new FormData();
    Object.entries(parsed).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Info */}
          <div className='lg:col-span-2 space-y-6'>
            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <Package size={16} className='text-indigo-600' /> General Information
                </h3>
              </div>
              <CardContent className='p-6 space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Dell XPS 15 Laptop'
                          {...field}
                          className='rounded-xl border-slate-200 h-11 focus:ring-indigo-500'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Tell us more about this product...'
                          className='rounded-xl border-slate-200 min-h-[120px] focus:ring-indigo-500'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='sku'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                          SKU
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='PROD-001'
                            {...field}
                            className='rounded-xl border-slate-200 h-11'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='rounded-xl border-slate-200 h-11'>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='rounded-xl border-slate-200'>
                            <SelectItem value='Electronics'>Electronics</SelectItem>
                            <SelectItem value='Fashion'>Fashion</SelectItem>
                            <SelectItem value='Groceries'>Groceries</SelectItem>
                            <SelectItem value='Computers'>Computers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <Banknote size={16} className='text-indigo-600' /> Pricing
                </h3>
              </div>
              <CardContent className='p-6 grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='costPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Cost Price
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                            ₦
                          </span>
                          <Input
                            type='number'
                            className='pl-8 rounded-xl border-slate-200 h-11'
                            {...field}
                            value={toInputValue(field.value)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sellingPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Selling Price
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                            ₦
                          </span>
                          <Input
                            type='number'
                            className='pl-8 rounded-xl border-slate-200 h-11'
                            {...field}
                            value={toInputValue(field.value)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <Database size={16} className='text-indigo-600' /> Inventory
                </h3>
              </div>
              <CardContent className='p-6 grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='stock'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Current Stock
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          className='rounded-xl border-slate-200 h-11'
                          {...field}
                          value={toInputValue(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lowStockAlert'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-bold text-slate-700 uppercase'>
                        Low Stock Alert
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          className='rounded-xl border-slate-200 h-11'
                          {...field}
                          value={toInputValue(field.value)}
                        />
                      </FormControl>
                      <FormDescription className='text-[10px]'>
                        You&apos;ll be notified when stock falls below this level.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className='space-y-6'>
            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <ImageIcon size={16} className='text-indigo-600' /> Product Image
                </h3>
              </div>
              <CardContent className='p-6'>
                <div
                  className='relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden'
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt='Preview' fill className='object-cover' />
                      <div className='absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <p className='text-white text-xs font-bold'>Change Image</p>
                      </div>
                    </>
                  ) : (
                    <div className='text-center p-6'>
                      <div className='h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400'>
                        <ImageIcon size={24} />
                      </div>
                      <p className='text-xs font-bold text-slate-600 mb-1'>Click to upload</p>
                      <p className='text-[10px] text-slate-400'>PNG, JPG or WebP (max. 2MB)</p>
                    </div>
                  )}
                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </div>
                {imageFile && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full mt-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 rounded-lg font-bold'
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(initialData?.imageUrl || null);
                    }}
                  >
                    <Trash2 size={14} className='mr-2' /> Reset Image
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className='bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden'>
              <div className='relative z-10'>
                <h4 className='font-bold text-lg mb-2'>Ready to publish?</h4>
                <p className='text-indigo-100 text-sm mb-6'>
                  Make sure all information is accurate before saving.
                </p>
                <div className='space-y-3'>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-12 rounded-xl shadow-sm'
                  >
                    {isLoading ? (
                      <Loader2 size={18} className='animate-spin mr-2' />
                    ) : initialData ? (
                      'Update Product'
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    className='w-full text-indigo-100 hover:text-white hover:bg-white/10 font-bold'
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className='absolute -right-4 -bottom-4 h-24 w-24 bg-white/10 rounded-full blur-2xl' />
              <div className='absolute -left-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl' />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
