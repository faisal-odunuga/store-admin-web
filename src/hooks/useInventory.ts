'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../lib/apiService';

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => inventoryService.getLowStock(),
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
      type,
      note,
    }: {
      id: string;
      quantity: number;
      type: 'IN' | 'OUT' | 'ADJUSTMENT';
      note?: string;
    }) => inventoryService.adjustStock(id, { quantity, type, note }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'logs', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useInventoryLogs = (productId?: string) => {
  return useQuery({
    queryKey: ['inventory', 'logs', productId],
    queryFn: () => inventoryService.getLogs(productId),
  });
};
