import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../lib/apiService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  });
};

export const useRevenueData = (days: number = 30) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => dashboardService.getRevenueData(days),
  });
};
