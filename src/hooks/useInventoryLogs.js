import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { inventoryService } from '../lib/apiService';

export const useInventoryLogs = (params = {}) => {
  return useQuery({
    queryKey: ['inventory-logs', params],
    queryFn: () => inventoryService.getAllLogs(params),
    placeholderData: keepPreviousData,
  });
};
