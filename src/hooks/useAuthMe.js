import { useQuery } from '@tanstack/react-query';
import { authService } from '../lib/apiService';

export const useAuthMe = (options = {}) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const data = await authService.getMe();
      // Handle potential double-wrapping or different structures
      return data?.user || data;
    },
    retry: 1,
    ...options,
  });
};
