import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../lib/apiService';

export const useOrders = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getAll(filters),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      paymentStatus,
    }: {
      id: string;
      status?: string;
      paymentStatus?: string;
    }) => ordersService.updateStatus(id, { status, paymentStatus }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};
