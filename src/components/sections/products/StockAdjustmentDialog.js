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
        className: 'bg-destructive text-destructive-foreground border-none',
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
            className: 'bg-emerald-500 text-white border-none',
          });
          onClose();
          setAdjustmentQty(0);
          onRefetch?.();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to adjust stock', {
            className: 'bg-destructive text-destructive-foreground border-none',
          });
        },
      },
    );
  };

  return (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md glass-card border-none rounded-3xl text-foreground'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3 text-xl font-black text-foreground uppercase tracking-tight'>
            <div className='p-2 bg-emerald-500/10 rounded-xl'>
              <PackagePlus className='h-6 w-6 text-emerald-500' />
            </div>
            Inventory Adjustment
          </DialogTitle>
          <p className='text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2'>
            {selectedProduct?.name}
          </p>
        </DialogHeader>
        <div className='space-y-6 py-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-5 bg-secondary/50 rounded-2xl border border-border text-center'>
              <p className='text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest mb-2'>
                Current Base
              </p>
              <p className='text-2xl font-black text-foreground tabular-nums'>
                {selectedProduct?.stock}
              </p>
            </div>
            <div className='p-5 bg-primary/10 rounded-2xl border border-primary/20 text-center shadow-inner'>
              <p className='text-[10px] text-primary font-extrabold uppercase tracking-widest mb-2'>
                Projected
              </p>
              <p className='text-2xl font-black text-primary tabular-nums'>
                {(selectedProduct?.stock || 0) + adjustmentQty}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <Label className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
              Quantity Adjustment
            </Label>
            <Input
              type='number'
              value={adjustmentQty}
              onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
              className='bg-secondary/50 border-border rounded-xl h-14 text-center text-2xl font-black text-foreground focus:ring-primary/20'
              autoFocus
            />
            <p className='text-[10px] text-muted-foreground font-bold uppercase text-center tracking-tighter'>
              Use negative values to subtract stock
            </p>
          </div>

          <div className='space-y-3'>
            <Label className='text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1'>
              Observation Details
            </Label>
            <Input
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              placeholder='e.g. Bulk restock June'
              className='bg-secondary/50 border-border rounded-xl h-12 text-sm font-bold text-foreground focus:ring-primary/20'
            />
          </div>
        </div>
        <DialogFooter className='gap-3 sm:gap-2'>
          <Button
            variant='ghost'
            onClick={onClose}
            className='rounded-xl font-bold text-muted-foreground hover:bg-secondary h-12 px-6'
          >
            Discard
          </Button>
          <Button
            onClick={handleAdjustStock}
            disabled={isPending || adjustmentQty === 0}
            className='rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black h-12 px-8 shadow-lg shadow-emerald-500/20 transition-all active:scale-95'
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
