'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Truck,
  User as UserIcon,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Receipt,
  Download,
  Printer,
  Wallet,
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { useOrder, useUpdateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuthMe } from '@/hooks/useAuthMe';
import {
  orderStatusConfig,
  paymentStatusConfig,
} from '@/components/sections/orders/orderTableConfig';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

export default function OrderDetailPage() {
  const { orderNumber } = useParams() as { orderNumber: string };
  const router = useRouter();
  const { data: me } = useAuthMe();
  const isAdmin = me?.role === 'ADMIN';
  const { data: order, isLoading, isError } = useOrder(orderNumber);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  React.useEffect(() => {
    if (order) {
      document.title = `Order #${order.orderNumber} | Antigravity Store`;
    }
  }, [order]);

  const handleStatusUpdate = (status: string) => {
    if (!order) return;
    updateOrder(
      { id: order.id, status },
      {
        onSuccess: () => toast.success('Order status updated'),
        onError: () => toast.error('Failed to update order status'),
      },
    );
  };

  const handlePaymentStatusUpdate = (paymentStatus: string) => {
    if (!order) return;
    updateOrder(
      { id: order.id, paymentStatus },
      {
        onSuccess: () => toast.success('Payment status updated'),
        onError: () => toast.error('Failed to update payment status'),
      },
    );
  };

  if (isLoading) {
    return (
      <PageContainer title='Order Details'>
        <div className='max-w-6xl mx-auto space-y-8'>
          <Skeleton className='h-32 w-full rounded-2xl' />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Skeleton className='h-[400px] md:col-span-2 rounded-2xl' />
            <Skeleton className='h-[400px] rounded-2xl' />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !order) {
    return (
      <PageContainer title='Error'>
        <div className='flex flex-col items-center justify-center h-96 gap-4'>
          <AlertCircle size={48} className='text-rose-500' />
          <p className='text-slate-600 font-medium'>Failed to load order details</p>
          <Button onClick={() => router.push('/orders')} variant='outline' className='rounded-xl'>
            Back to orders
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Order #${order.orderNumber}`}
      description={`Customer: ${order.user?.name || 'Unknown User'}`}
    >
      <div className='max-w-6xl mx-auto space-y-8 pb-12'>
        {/* Actions & Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <Button
            variant='ghost'
            onClick={() => router.push('/orders')}
            className='rounded-xl h-10 px-4 font-bold text-slate-500 hover:text-indigo-600 group w-fit'
          >
            <ArrowLeft size={18} className='mr-2 group-hover:-translate-x-1 transition-transform' />
            Back to Orders
          </Button>
          <div className='flex items-center gap-2'>
            <Button variant='outline' className='rounded-xl h-10 font-bold border-slate-200'>
              <Printer size={16} className='mr-2' /> Print
            </Button>
            <Button variant='outline' className='rounded-xl h-10 font-bold border-slate-200'>
              <Download size={16} className='mr-2' /> Invoice
            </Button>
          </div>
        </div>

        {/* Status Summary Card */}
        <Card className='border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-slate-900 text-white'>
          <CardContent className='p-8 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex items-center gap-6'>
              <div className='h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0'>
                <Truck size={32} className='text-indigo-400' />
              </div>
              <div className='space-y-1'>
                <p className='text-indigo-300 text-[10px] font-black uppercase tracking-widest'>
                  Current Status
                </p>
                <h2 className='text-2xl font-black tracking-tight flex items-center gap-2'>
                  {orderStatusConfig.labels[order.status]}
                  <Badge
                    className={`${orderStatusConfig.config.bg[order.status]} ${orderStatusConfig.config.text[order.status]} border-0 rounded-lg ml-2`}
                  >
                    Live
                  </Badge>
                </h2>
              </div>
            </div>

            <div className='flex items-center gap-4 w-full md:w-auto'>
              <div className='space-y-2 w-full md:w-48'>
                <p className='text-indigo-300 text-[10px] font-black uppercase tracking-widest'>
                  Update Status
                </p>
                <Select
                  disabled={isUpdating}
                  onValueChange={handleStatusUpdate}
                  defaultValue={order.status}
                >
                  <SelectTrigger className='bg-white/10 border-white/20 text-white rounded-xl h-11 focus:ring-indigo-500'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl border-slate-200'>
                    {Object.entries(orderStatusConfig.labels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2 w-full md:w-48'>
                <p className='text-indigo-300 text-[10px] font-black uppercase tracking-widest'>
                  Payment Status
                </p>
                <Select
                  disabled={isUpdating}
                  onValueChange={handlePaymentStatusUpdate}
                  defaultValue={order.paymentStatus}
                >
                  <SelectTrigger className='bg-white/10 border-white/20 text-white rounded-xl h-11 focus:ring-indigo-500'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl border-slate-200'>
                    {Object.entries(paymentStatusConfig.labels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Content */}
          <div className='lg:col-span-2 space-y-6'>
            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <Receipt size={16} className='text-indigo-600' /> Order Items
                </h3>
                <span className='text-[10px] font-bold text-slate-400'>
                  {order.orderItems?.length || 0} items
                </span>
              </div>
              <CardContent className='p-0'>
                <div className='divide-y divide-slate-100'>
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className='p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden'>
                          {item.product?.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt=''
                              className='h-full w-full object-cover'
                              width={48}
                              height={48}
                            />
                          ) : (
                            <Package size={20} className='text-slate-400' />
                          )}
                        </div>
                        <div className='space-y-1'>
                          <p
                            onClick={() =>
                              router.push(
                                `/products/${item.product?.sku?.toLowerCase() || item.productId}`,
                              )
                            }
                            className='font-bold text-slate-900 text-sm hover:underline cursor-pointer'
                          >
                            {item.product?.name || 'Unknown Product'}
                          </p>
                          <p className='text-[10px] text-slate-400 font-medium'>
                            QTY: {item.quantity} x {formatCurrency(item.sellingPrice)}
                          </p>
                        </div>
                      </div>
                      <p className='font-bold text-slate-900'>{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>

                {/* Summary Table */}
                <div className='bg-slate-50 p-8 space-y-4'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-slate-500'>Subtotal</span>
                    <span className='font-bold text-slate-900'>
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-slate-500'>Shipping Fee</span>
                    <span className='font-bold text-slate-900'>
                      {formatCurrency(order.shippingFee)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-slate-500'>Tax Amount</span>
                    <span className='font-bold text-slate-900'>
                      {formatCurrency(order.taxAmount)}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className='flex justify-between items-center text-sm text-rose-600'>
                      <span>Discount</span>
                      <span className='font-bold'>-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className='pt-4 border-t border-slate-200 flex justify-between items-center'>
                    <span className='font-black text-slate-900'>Total Amount</span>
                    <span className='text-2xl font-black text-indigo-600'>
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Additional Info Placeholder */}
            <Card className='border-slate-200 shadow-sm rounded-2xl p-6'>
              <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2 mb-4'>
                <Clock size={16} className='text-indigo-600' /> Order Activity
              </h3>
              <div className='space-y-6'>
                <div className='flex gap-4 relative'>
                  <div className='absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-slate-100' />
                  <div className='h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10'>
                    <CheckCircle2 size={14} className='text-indigo-600' />
                  </div>
                  <div className='pb-6'>
                    <p className='text-sm font-bold text-slate-900'>Order Placed</p>
                    <p className='text-xs text-slate-500'>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </p>
                  </div>
                </div>
                {order.status !== 'PENDING' && (
                  <div className='flex gap-4 relative'>
                    <div className='h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10'>
                      <Clock size={14} className='text-indigo-600' />
                    </div>
                    <div>
                      <p className='text-sm font-bold text-slate-900'>
                        Status Updated to {orderStatusConfig.labels[order.status]}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {format(new Date(order.updatedAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Customer & Shipping Info */}
          <div className='space-y-6'>
            <Card className='border-slate-200 shadow-sm rounded-2xl overflow-hidden'>
              <div className='bg-slate-50 px-6 py-4 border-b border-slate-100'>
                <h3 className='text-sm font-bold text-slate-800 flex items-center gap-2'>
                  <UserIcon size={16} className='text-indigo-600' /> Customer Profile
                </h3>
              </div>
              <CardContent className='p-6 space-y-6'>
                <div className='flex flex-col items-center gap-3 text-center'>
                  <div className='h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-50'>
                    <span className='text-2xl font-black text-indigo-600'>
                      {order.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className='font-black text-slate-900'>
                      {order.user?.name || 'Guest User'}
                    </h4>
                    <p className='text-xs text-slate-400 font-bold'>
                      ID: #{order.userId.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className='space-y-4 pt-4 border-t border-slate-100'>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400'>
                      <Mail size={16} />
                    </div>
                    <span className='text-slate-600 font-medium truncate'>
                      {order.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400'>
                      <Phone size={16} />
                    </div>
                    <span className='text-slate-600 font-medium'>{order.user?.phone || 'N/A'}</span>
                  </div>
                </div>

                <Button
                  variant='outline'
                  className='w-full rounded-xl h-10 font-bold border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                >
                  View Customer History
                </Button>
              </CardContent>
            </Card>

            <Card className='border-slate-200 shadow-sm rounded-2xl'>
              <CardContent className='p-6 space-y-4'>
                <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider'>
                  Delivery & Payment
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-start gap-3'>
                    <div className='h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 border border-slate-100'>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                        Shipping Address
                      </p>
                      <p className='text-sm font-bold text-slate-700 leading-relaxed'>
                        {order.shippingAddress || 'No address provided'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 border border-slate-100'>
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                        Payment Method
                      </p>
                      <p className='text-sm font-bold text-slate-700'>
                        {order.paymentMethod || 'Debit Card'}
                      </p>
                    </div>
                  </div>
                  {isAdmin && order.profitAmount !== undefined && (
                    <div className='p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2'>
                      <div className='flex justify-between items-center'>
                        <p className='text-[10px] font-black text-indigo-600 uppercase tracking-widest'>
                          Net Profit
                        </p>
                        <Badge className='bg-indigo-600 text-white border-0 text-[10px]'>
                          Verified
                        </Badge>
                      </div>
                      <p className='text-2xl font-black text-slate-900'>
                        {formatCurrency(order.profitAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
