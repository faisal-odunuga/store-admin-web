import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/apiService';

export const useAuthMe = (enabled: boolean = true) =>
  useQuery({
    queryKey: ['auth-me'],
    queryFn: authService.getMe,
    enabled,
    staleTime: 30_000,
  });
