import { useQuery } from '@tanstack/react-query';
import { usersService } from '../lib/apiService';

export const useUsers = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
  });
};
