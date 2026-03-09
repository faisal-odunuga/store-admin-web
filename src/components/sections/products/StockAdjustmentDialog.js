import * as React from 'react';
import { PackagePlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAdjustStock } from '@/hooks/useInventory';
import { toast } from 'sonner';

export function StockAdjustmentDialog({ selectedProduct, onClose, onRefetch }) {
  const [adjustmentQty, setAdjustmentQty] = React.useState(0);
  const [adjustmentReason, setAdjustmentReason] = React.useState('Regular restock');
  const { mutate: adjustStock, isPending } = useAdjustStock();

  const handleAdjustStock = () => {
    if (!selectedProduct) return;
    if (adjustmentQty < 0 && Math.abs(adjustmentQty) > selectedProduct.stock) {
      toast.error('Adjustment would result in negative inventory.', {
        className: 'glass-morphism border-white/10 text-white',
      });
      return;
    }
    adjustStock(
      {
        id: selectedProduct.id,
        quantity: Math.abs(adjustmentQty),
        type: adjustmentQty > 0 ? 'IN' : 'OUT',
        note: adjustmentReason,
      },
      {
        onSuccess: () => {
          toast.success('Stock adjusted successfully', {
            className: 'glass-morphism border-white/10 text-white',
          });
          onClose();
          setAdjustmentQty(0);
          onRefetch?.();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to adjust stock', {
            className: 'glass-morphism border-white/10 text-white',
          });
        },
      },
    );
  };

  return (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md glass-morphism border-white/10 rounded-3xl text-white'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3 text-xl font-bold'>
            <div className='p-2 bg-emerald-500/10 rounded-xl'>
              <PackagePlus className='h-6 w-6 text-emerald-400' />
            </div>
            Inventory Adjustment
          </DialogTitle>
          <p className='text-slate-400 text-sm mt-2'>{selectedProduct?.name}</p>
        </DialogHeader>
        <div className='space-y-6 py-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-5 bg-white/5 rounded-2xl border border-white/5 text-center'>
              <p className='text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2'>
                Current Base
              </p>
              <p className='text-2xl font-bold text-white'>{selectedProduct?.stock}</p>
            </div>
            <div className='p-5 bg-primary/10 rounded-2xl border border-primary/20 text-center shadow-inner'>
              <p className='text-[10px] text-primary font-extrabold uppercase tracking-widest mb-2'>
                Projected
              </p>
              <p className='text-2xl font-bold text-primary'>
                {(selectedProduct?.stock || 0) + adjustmentQty}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <Label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest'>
              Quantity Adjustment
            </Label>
            <Input
              type='number'
              value={adjustmentQty}
              onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
              className='bg-white/3 border-white/5 rounded-xl h-12 text-center text-xl font-bold'
              autoFocus
            />
            <p className='text-[10px] text-slate-600 font-bold uppercase text-center tracking-tighter'>
              Use negative values to subtract stock
            </p>
          </div>

          <div className='space-y-3'>
            <Label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-widest'>
              Observation Details
            </Label>
            <Input
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              placeholder='e.g. Bulk restock June'
              className='bg-white/3 border-white/5 rounded-xl h-11 text-sm'
            />
          </div>
        </div>
        <DialogFooter className='gap-3 sm:gap-2'>
          <Button
            variant='ghost'
            onClick={onClose}
            className='rounded-xl font-bold text-slate-400 hover:bg-white/5 h-12 px-6'
          >
            Discard
          </Button>
          <Button
            onClick={handleAdjustStock}
            disabled={isPending || adjustmentQty === 0}
            className='rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-8 shadow-lg shadow-emerald-500/10'
          >
            {isPending ? (
              <Loader2 className='h-5 w-5 animate-spin mr-2' />
            ) : (
              <PackagePlus className='h-5 w-5 mr-2' />
            )}
            Confirm Sync
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
