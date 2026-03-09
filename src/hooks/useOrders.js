import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { ordersService } from '../lib/apiService';

export const useOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getAll(filters),
    placeholderData: keepPreviousData,
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, paymentStatus }) =>
      ordersService.updateStatus(id, { status, paymentStatus }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};
