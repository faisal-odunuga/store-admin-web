'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../lib/apiService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
  });
};
