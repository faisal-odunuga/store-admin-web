import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../lib/apiService';

export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity, type, note }) =>
      inventoryService.adjustStock(id, { quantity, type, note }),
    onSuccess: (updatedProduct) => {
      // Invalidate both product and general inventory data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (updatedProduct?.id) {
        queryClient.invalidateQueries({ queryKey: ['products', updatedProduct.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['inventory', 'logs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-logs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
