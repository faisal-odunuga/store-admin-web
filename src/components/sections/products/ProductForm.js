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
  CheckCircle2,
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
import { CardContent } from '@/components/ui/card';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  sku: z.string().min(3, 'SKU is required'),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  costPrice: z.coerce.number().min(0, 'Cost price must be positive'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be positive'),
  discountPrice: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  lowStockAlert: z.coerce.number().min(0, 'Alert level cannot be negative'),
  isActive: z.boolean().default(true),
});

export function ProductForm({ initialData, onSubmit, isLoading }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);

  const toInputValue = (value) =>
    typeof value === 'number' || typeof value === 'string' ? value : '';

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          sku: initialData.sku,
          barcode: initialData.barcode || '',
          category: initialData.category || '',
          costPrice: initialData.costPrice,
          sellingPrice: initialData.sellingPrice,
          discountPrice: initialData.discountPrice || '',
          weight: initialData.weight || '',
          stock: initialData.stock,
          lowStockAlert: initialData.lowStockAlert,
          isActive: initialData.isActive,
        }
      : {
          name: '',
          description: '',
          sku: '',
          barcode: '',
          category: '',
          costPrice: 0,
          sellingPrice: 0,
          discountPrice: '',
          weight: '',
          stock: 0,
          lowStockAlert: 5,
          isActive: true,
        },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (values) => {
    const parsed = productSchema.parse(values);
    const formData = new FormData();
    Object.entries(parsed).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
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
      <form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-10 pb-10 animate-in'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6'>
          <div>
            <h2 className='text-3xl font-black text-foreground tracking-tight flex items-center gap-3 uppercase'>
              {initialData ? 'Edit Product' : 'Create New Product'}
              {initialData && (
                <span className='text-[10px] font-extrabold px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 tracking-widest uppercase ml-2'>
                  {initialData.sku}
                </span>
              )}
            </h2>
            <p className='text-muted-foreground font-medium mt-1'>
              Fill in the details below to {initialData ? 'update' : 'publish'} your product.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground hover:bg-secondary rounded-xl font-bold px-6 h-11'
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95'
            >
              {isLoading ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {initialData ? 'Update Product' : 'Publish Product'}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* Main Content Area */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Basic Information */}
            <div className='glass-card border-none overflow-hidden rounded-3xl'>
              <div className='px-8 py-5 border-b border-border bg-secondary/30 flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Package size={18} className='text-primary' />
                </div>
                <h3 className='text-lg font-black text-foreground tracking-tight uppercase'>
                  Basic Information
                </h3>
              </div>
              <CardContent className='p-8 space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Ultra Gaming Laptop Pro'
                          {...field}
                          className='bg-secondary/50 border-border rounded-xl h-12 focus:ring-primary/20 transition-all text-foreground font-bold placeholder:text-muted-foreground/50'
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-rose-400' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Provide a detailed description of the product highlights and specs...'
                          className='bg-secondary/50 border-border rounded-xl min-h-[160px] focus:ring-primary/20 transition-all text-foreground font-medium placeholder:text-muted-foreground/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-rose-400' />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='sku'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest'>
                          SKU ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='SKU-8820-X'
                            {...field}
                            className='bg-secondary/50 border-border rounded-xl h-12 text-foreground font-bold placeholder:text-muted-foreground/50'
                          />
                        </FormControl>
                        <FormMessage className='text-xs text-rose-400' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='barcode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest'>
                          Universal Barcode
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. 192837482910'
                            {...field}
                            className='bg-secondary/50 border-border rounded-xl h-12 text-foreground font-bold placeholder:text-muted-foreground/50'
                          />
                        </FormControl>
                        <FormMessage className='text-xs text-rose-400' />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='bg-secondary/50 border-border rounded-xl h-12 text-foreground font-bold'>
                              <SelectValue placeholder='Select category type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='glass-card border-none rounded-xl text-foreground font-bold shadow-2xl'>
                            <SelectItem
                              value='Electronics'
                              className='focus:bg-secondary focus:text-foreground'
                            >
                              Electronics
                            </SelectItem>
                            <SelectItem
                              value='Fashion'
                              className='focus:bg-secondary focus:text-foreground'
                            >
                              Fashion
                            </SelectItem>
                            <SelectItem
                              value='Home & Office'
                              className='focus:bg-secondary focus:text-foreground'
                            >
                              Home & Office
                            </SelectItem>
                            <SelectItem
                              value='Computers'
                              className='focus:bg-secondary focus:text-foreground'
                            >
                              Computers & Tech
                            </SelectItem>
                            <SelectItem
                              value='Accessories'
                              className='focus:bg-secondary focus:text-foreground'
                            >
                              Accessories
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-xs text-rose-400' />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </div>

            {/* Pricing Section */}
            <div className='glass-card border-none overflow-hidden rounded-3xl'>
              <div className='px-8 py-5 border-b border-border bg-secondary/30 flex items-center gap-3'>
                <div className='p-2 bg-emerald-500/10 rounded-lg'>
                  <Banknote size={18} className='text-emerald-500' />
                </div>
                <h3 className='text-lg font-black text-foreground tracking-tight uppercase'>
                  Pricing & Profit
                </h3>
              </div>
              <CardContent className='p-8 space-y-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                  <FormField
                    control={form.control}
                    name='costPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest'>
                          Purchase Cost
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black'>
                              ₦
                            </span>
                            <Input
                              type='number'
                              className='pl-8 bg-secondary/50 border-border rounded-xl h-12 text-foreground font-black tabular-nums'
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
                    name='discountPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2'>
                          Discount Price
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black'>
                              ₦
                            </span>
                            <Input
                              type='number'
                              placeholder='Optional'
                              className='pl-8 bg-primary/5 border-primary/20 rounded-xl h-12 text-foreground font-black tabular-nums placeholder:text-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                              {...field}
                              value={toInputValue(field.value)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='pt-6 border-t border-white/5'>
                  <FormField
                    control={form.control}
                    name='weight'
                    render={({ field }) => (
                      <FormItem className='max-w-[200px]'>
                        <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                          Physical Weight
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type='number'
                              placeholder='e.g. 1.5'
                              className='bg-secondary/50 border-border rounded-xl h-12 text-foreground font-black tabular-nums pr-12'
                              {...field}
                              value={toInputValue(field.value)}
                            />
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[10px] uppercase'>
                              KG
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage className='text-xs text-rose-400' />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className='space-y-8'>
            {/* Image Preview */}
            <div className='glass-card p-6 rounded-3xl'>
              <div className='px-2 py-3 mb-4'>
                <h3 className='text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest opacity-60'>
                  <ImageIcon size={14} className='text-primary' /> Product Visual
                </h3>
              </div>
              <div
                className='relative aspect-square rounded-4xl border-2 border-dashed border-border bg-secondary/50 transition-all hover:bg-secondary/80 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-inner'
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image src={imagePreview} alt='Preview' fill className='object-cover' />
                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm'>
                      <p className='text-white text-xs font-black uppercase tracking-widest'>
                        Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className='text-center p-6 transition-all'>
                    <div className='h-20 w-20 rounded-4xl bg-secondary border border-border shadow-xl flex items-center justify-center mx-auto mb-4 text-muted-foreground group-hover:scale-110 transition-transform'>
                      <ImageIcon size={32} />
                    </div>
                    <p className='text-[10px] font-black text-foreground mb-1 uppercase tracking-widest'>
                      Drop or Click
                    </p>
                    <p className='text-[9px] text-muted-foreground uppercase font-black tracking-tighter'>
                      Recommended: 1080x1080px
                    </p>
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
                  className='w-full mt-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all'
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(initialData?.imageUrl || null);
                  }}
                >
                  <Trash2 size={12} className='mr-2' /> Reset Selection
                </Button>
              )}
            </div>

            {/* Inventory Sidebar Card */}
            <div className='glass-card p-8 space-y-8 rounded-3xl'>
              <div className='flex items-center gap-3 mb-2'>
                <Database size={16} className='text-primary' />
                <h3 className='text-sm font-black text-foreground uppercase tracking-widest opacity-60'>
                  Inventory Control
                </h3>
              </div>

              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                      Initial Quantity
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        className='bg-white/3 border-white/5 rounded-xl h-11 text-white text-center font-bold text-lg'
                        {...field}
                        value={toInputValue(field.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lowStockAlert'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
                      Critical Alert Threshold
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        className='bg-secondary/50 border-border rounded-xl h-14 text-foreground text-center font-black text-2xl tabular-nums'
                        {...field}
                        value={toInputValue(field.value)}
                      />
                    </FormControl>
                    <FormDescription className='text-[9px] text-muted-foreground font-black uppercase mt-3 tracking-widest text-center opacity-60'>
                      System will flag low stock at this point.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Publication Card */}
            <div className='bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 animate-pulse' />
              <div className='relative z-10'>
                <h4 className='font-black text-xl text-foreground mb-2 leading-tight uppercase tracking-tight'>
                  Final Check
                </h4>
                <p className='text-muted-foreground text-sm mb-8 leading-relaxed font-bold'>
                  Ensure all specifications, pricing, and high-quality visuals are correctly mapped
                  before publishing.
                </p>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-16 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-lg'
                >
                  {isLoading ? (
                    <Loader2 size={24} className='animate-spin' />
                  ) : (
                    <div className='flex items-center gap-3'>
                      <CheckCircle2 size={24} />
                      <span>Confirm & Save Changes</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
