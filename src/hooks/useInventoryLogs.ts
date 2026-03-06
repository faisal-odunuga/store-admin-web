import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../lib/apiService';

export const useInventoryLogs = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['inventory-logs', params],
    queryFn: () => inventoryService.getAllLogs(params),
  });
};
