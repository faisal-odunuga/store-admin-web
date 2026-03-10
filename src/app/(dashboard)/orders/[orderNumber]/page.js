'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrder, useUpdateOrder } from '@/hooks/useOrders';
import {
  Loader2,
  ChevronLeft,
  Package,
  CheckCircle2,
  Clock,
  CreditCard,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Printer,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  orderStatusConfig,
  paymentStatusConfig,
} from '@/components/sections/orders/orderTableConfig';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { printContent, generateInvoiceHTML } from '@/lib/exportUtils';

export default function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const router = useRouter();
  const { data: order, isLoading } = useOrder(orderNumber);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  console.log(order);
  const handleUpdateStatus = (newStatus) => {
    updateOrder(
      { id: order.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus}`, {
            className: 'glass-morphism border-white/10 text-white',
          });
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update status', {
            className: 'glass-morphism border-white/10 text-white',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className='h-[70vh] flex flex-col items-center justify-center gap-6'>
        <div className='relative'>
          <Loader2 className='h-16 w-16 text-primary animate-spin' strokeWidth={1.5} />
          <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse' />
        </div>
        <p className='text-slate-500 font-extrabold tracking-[0.2em] text-[10px] uppercase'>
          Decrypting Transaction Data...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='h-[70vh] flex flex-col items-center justify-center gap-6'>
        <AlertCircle size={48} className='text-rose-500 opacity-20' />
        <h1 className='text-2xl font-bold text-foreground tracking-tight'>
          Order Record Not Found
        </h1>
        <Button
          onClick={() => router.push('/orders')}
          className='bg-secondary border border-border text-foreground h-12 px-8 rounded-2xl hover:bg-secondary/80'
        >
          Back to Register
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-10 pb-20 animate-in'>
      {/* Master Header */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10'>
        <div className='flex items-center gap-6'>
          <Button
            variant='ghost'
            size='icon'
            className='h-12 w-12 rounded-[1.25rem] bg-secondary border border-border hover:bg-secondary/80 text-foreground shadow-xl transition-all'
            onClick={() => router.push('/orders')}
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-4xl font-black text-foreground tracking-tighter uppercase tabular-nums'>
                #{order.orderNumber}
              </h1>
              <DataStatus
                status={order.status}
                labels={orderStatusConfig.labels}
                config={orderStatusConfig.config}
                icon={orderStatusConfig.icons[order.status]}
              />
            </div>
            <p className='text-muted-foreground font-bold uppercase tracking-widest text-[10px] flex items-center gap-2'>
              <Calendar size={12} className='text-primary' /> Placed on{' '}
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            className='bg-secondary border border-border text-foreground font-bold h-12 px-6 rounded-2xl hover:bg-secondary/80 transition-all'
            onClick={() =>
              printContent(generateInvoiceHTML(order), `Invoice #${order.orderNumber}`)
            }
          >
            <Printer className='mr-2 h-4 w-4' /> Print Invoice
          </Button>

          <div className='h-12 flex items-center gap-1 bg-secondary border border-border rounded-2xl px-2'>
            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((s) => (
              <Button
                key={s}
                size='sm'
                variant='ghost'
                disabled={isUpdating || order.status === s}
                onClick={() => handleUpdateStatus(s)}
                className={cn(
                  'h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all',
                  order.status === s
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {/* Central Order Data */}
        <div className='lg:col-span-2 space-y-10'>
          {/* Product Manifest */}
          <Card className='glass-card border-none overflow-hidden'>
            <div className='px-10 py-6 border-b border-border bg-secondary/30 flex items-center justify-between'>
              <h3 className='text-lg font-black text-foreground tracking-tight flex items-center gap-3'>
                <Package size={20} className='text-primary' /> Manifest Content
              </h3>
              <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                {order.items?.length || 0} Registered Items
              </span>
            </div>
            <div className='p-0 divide-y divide-white/5'>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className='p-8 flex items-center gap-6 group hover:bg-secondary/20 transition-colors'
                >
                  <div className='h-20 w-20 relative rounded-2xl border border-border bg-secondary shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-2xl'>
                    {item.product?.imageUrl && (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className='object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1 space-y-2'>
                    <h4 className='text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors'>
                      {item.product?.name}
                    </h4>
                    <div className='flex items-center gap-6'>
                      <span className='text-[10px] font-extrabold px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded-md tracking-widest uppercase'>
                        {item.product?.sku}
                      </span>
                      <span className='text-xs text-muted-foreground font-bold tabular-nums'>
                        Qty: <span className='text-foreground'>{item.quantity}</span>
                      </span>
                      <span className='text-xs text-muted-foreground font-bold tabular-nums'>
                        Unit:{' '}
                        <span className='text-primary'>
                          {formatCurrency(item.sellingPrice ?? item.price ?? 0)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xl font-black text-foreground tracking-tighter'>
                      {formatCurrency((item.sellingPrice ?? item.price ?? 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='p-10 bg-secondary/10 border-t border-border space-y-4'>
              <div className='flex justify-between items-center text-muted-foreground font-bold text-xs uppercase tracking-widest'>
                <span>Items Subtotal</span>
                <span className='text-foreground'>
                  {formatCurrency(order.subtotal || order.totalAmount)}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className='flex justify-between items-center text-muted-foreground font-bold text-xs uppercase tracking-widest'>
                  <span>Discount Total</span>
                  <span className='text-rose-400'>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}

              {order.taxAmount > 0 && (
                <div className='flex justify-between items-center text-muted-foreground font-bold text-xs uppercase tracking-widest'>
                  <span>Estimated Tax</span>
                  <span className='text-amber-400'>{formatCurrency(order.taxAmount)}</span>
                </div>
              )}

              <div className='flex justify-between items-center text-muted-foreground font-bold text-xs uppercase tracking-widest'>
                <span>Logistics / Shipping</span>
                {order.shippingFee > 0 ? (
                  <span className='text-foreground'>{formatCurrency(order.shippingFee)}</span>
                ) : (
                  <span className='text-emerald-400'>FREE</span>
                )}
              </div>
              <div className='h-px bg-white/5 my-6' />
              <div className='flex justify-between items-center'>
                <span className='text-lg font-black text-foreground uppercase tracking-tighter'>
                  Grand Total
                </span>
                <span className='text-3xl font-black text-primary tracking-tighter shadow-[0_0_20px_rgba(59,130,246,0.2)]'>
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
              {order.profitAmount !== null && order.profitAmount !== undefined && (
                <div className='flex justify-between items-center mt-4 pt-4 border-t border-white/5'>
                  <span className='text-xs font-black text-muted-foreground uppercase tracking-widest opacity-80'>
                    Net Profit Margin
                  </span>
                  <span className='text-sm font-black text-emerald-400 tracking-tighter'>
                    {formatCurrency(order.profitAmount)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Dynamic Log/Timeline */}
          <Card className='glass-card border-none p-10 space-y-8'>
            <h3 className='text-lg font-black text-foreground tracking-tight flex items-center gap-3 mb-6'>
              <Clock size={20} className='text-primary' /> Lifecycle Audit
            </h3>
            <div className='relative pl-10 space-y-10'>
              <div className='absolute left-3 top-2 bottom-2 w-px bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]' />
              {[
                { status: 'PLACED', label: 'Order Created', time: order.createdAt, done: true },
                {
                  status: 'PAYMENT',
                  label: 'Transaction Verified',
                  time: order.updatedAt,
                  done: order.paymentStatus === 'PAID',
                },
                {
                  status: 'PROCESSING',
                  label: 'Preparing Manifest',
                  time: null,
                  done: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status),
                },
                {
                  status: 'SHIPPED',
                  label: 'Dispatched to Transit',
                  time: null,
                  done: ['SHIPPED', 'DELIVERED'].includes(order.status),
                },
                {
                  status: 'DELIVERED',
                  label: 'Fulfillment Complete',
                  time: null,
                  done: order.status === 'DELIVERED',
                },
              ].map((step, i) => (
                <div key={i} className='relative group'>
                  <div
                    className={cn(
                      'absolute -left-[35px] top-1.5 h-4 w-4 rounded-full border-2 border-[#050b1a] z-10 transition-all duration-500',
                      step.done
                        ? 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-110'
                        : 'bg-white/10',
                    )}
                  >
                    {step.done && (
                      <CheckCircle2 size={10} className='text-white absolute inset-0 m-auto' />
                    )}
                  </div>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                    <h4
                      className={cn(
                        'font-bold text-sm tracking-tight transition-colors',
                        step.done ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </h4>
                    {step.time && (
                      <span className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                        {formatDate(step.time)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contextual Intelligence Sidebar */}
        <div className='space-y-10'>
          {/* Customer Knowledge */}
          <Card className='glass-card border-none p-8 space-y-8 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16' />
            <h4 className='text-xs font-black text-foreground uppercase tracking-widest opacity-50 flex items-center gap-2'>
              <User size={14} className='text-primary' /> Customer Profile
            </h4>
            <div className='flex items-center gap-4'>
              <div className='h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg'>
                {order.user?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h4 className='text-lg font-black text-foreground tracking-tight'>
                  {order.user?.name || 'Guest Client'}
                </h4>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                  {order.user?.email || 'N/A'}
                </p>
              </div>
            </div>
            <div className='space-y-4 pt-4 border-t border-white/5'>
              <div className='flex items-center gap-3 text-slate-400 font-medium text-xs'>
                <Phone size={14} className='text-primary/60' /> +234 812 345 6789
              </div>
              <div className='flex items-start gap-3 text-muted-foreground font-medium text-xs leading-relaxed'>
                <MapPin size={14} className='text-primary/60 mt-0.5' />
                Plot 12, Industrial Estate, <br />
                Victoria Island, Lagos
              </div>
            </div>
            <Button
              variant='ghost'
              className='w-full text-primary font-extrabold text-[10px] uppercase tracking-[0.2em] h-10 rounded-xl hover:bg-primary/5'
            >
              View Complete Profile
            </Button>
          </Card>

          {/* Financial Status */}
          <Card className='glass-card border-none p-8 space-y-8 bg-white/[0.02]'>
            <h4 className='text-xs font-black text-foreground uppercase tracking-widest opacity-50 flex items-center gap-2'>
              <CreditCard size={14} className='text-emerald-400' /> Transaction Intelligence
            </h4>
            <div className='space-y-6'>
              <div>
                <p className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2'>
                  Settlement Status
                </p>
                <DataStatus
                  status={order.paymentStatus}
                  labels={paymentStatusConfig.labels}
                  config={paymentStatusConfig.config}
                  icon={paymentStatusConfig.icons[order.paymentStatus]}
                />
              </div>
              <div className='space-y-4 pt-4 border-t border-white/5'>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                    Gateway
                  </span>
                  <span className='text-xs font-black text-foreground uppercase tracking-tighter'>
                    Paystack Enterprise
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest'>
                    Reference
                  </span>
                  <span className='text-[10px] font-mono font-bold text-primary'>
                    T-REC-99201-X
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
