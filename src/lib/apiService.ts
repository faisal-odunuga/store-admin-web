import api from '@/lib/api';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { User } from '@/types/user';

export interface DashboardStats {
  users: number;
  orders: number;
  products: number;
  revenue: number;
  profit?: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  profit?: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  balanceAfter: number;
  reason?: string;
  note?: string;
  createdAt: string;
  product?: Product;
}

export const ordersService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<{
      orders: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/orders', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ order: Order }>(`/admin/orders/${id}`);
    return response.data.order;
  },
  updateStatus: async (id: string, payload: { status?: string; paymentStatus?: string }) => {
    const response = await api.patch<{ order: Order }>(`/admin/orders/${id}/status`, payload);
    return response.data.order;
  },
};

export const productsService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<{
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/products', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ product: Product }>(`/admin/products/${id}`);
    return response.data.product;
  },
  create: async (payload: FormData) => {
    // Backend uses multer for images, so we use FormData
    const response = await api.post<{ product: Product }>('/admin/products', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },
  update: async (id: string, payload: FormData) => {
    const response = await api.patch<{ product: Product }>(`/admin/products/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },
  delete: async (id: string) => {
    await api.delete(`/admin/products/${id}`);
  },
};

export const usersService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<{
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/users', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ user: User }>(`/admin/users/${id}`);
    return response.data.user;
  },
  update: async (id: string, payload: { role?: string }) => {
    const response = await api.patch<{ user: User }>(`/admin/users/${id}/role`, payload);
    return response.data.user;
  },
  delete: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },
  createManager: async (payload: Record<string, unknown>) => {
    const response = await api.post<{ user: User }>('/admin/users', payload);
    return response.data.user;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<{ stats: DashboardStats }>('/admin/dashboard');
    // console.log('Dashboard Stats Keys:', Object.keys(response.data || {}));

    const data = response.data as Record<string, unknown>;

    if (data && typeof data === 'object' && 'stats' in data) {
      return data.stats as DashboardStats;
    }

    if (data && typeof data === 'object' && 'users' in data) {
      return data as unknown as DashboardStats;
    }

    console.error('Unexpected dashboard stats response structure:', JSON.stringify(data));
    throw new Error('Could not find dashboard stats in response');
  },

  getRevenueData: async (days: number = 30) => {
    const response = await api.get<{ data: RevenueData[] }>('/admin/dashboard/revenue', {
      params: { days },
    });
    return response.data.data;
  },
};

export const inventoryService = {
  getLowStock: async () => {
    const response = await api.get<{ products: Product[] }>('/admin/inventory/low-stock');
    return response.data.products;
  },
  adjustStock: async (
    id: string,
    payload: { quantity: number; type: 'IN' | 'OUT' | 'ADJUSTMENT'; note?: string },
  ) => {
    const response = await api.post<{ product: Product }>(`/admin/inventory/${id}/adjust`, payload);
    return response.data.product;
  },
  getLogs: async (id: string) => {
    const response = await api.get<{ logs: InventoryLog[] }>(`/admin/inventory/${id}/logs`);
    return response.data.logs;
  },
  getAllLogs: async (params?: Record<string, unknown>) => {
    const response = await api.get<{
      logs: InventoryLog[];
      total: number;
      page: number;
      totalPages: number;
    }>('/admin/inventory', { params });
    return response.data;
  },
};

export const authService = {
  getMe: async () => {
    const response = await api.get<{ user: User & { setupComplete?: boolean } }>('/auth/me');
    return response.data.user;
  },
  completeSetup: async () => {
    const response = await api.post<{ user: unknown }>('/auth/setup-complete');
    return response.data.user;
  },
};
