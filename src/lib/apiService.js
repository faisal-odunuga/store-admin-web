import api from '@/lib/api';

export const ordersService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data.order;
  },
  updateStatus: async (id, payload) => {
    const response = await api.patch(`/admin/orders/${id}/status`, payload);
    return response.data.order;
  },
};

export const productsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data.product;
  },
  create: async (payload) => {
    const response = await api.post('/admin/products', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },
  update: async (id, payload) => {
    const response = await api.patch(`/admin/products/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },
  delete: async (id) => {
    await api.delete(`/admin/products/${id}`);
  },
};

export const usersService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },
  update: async (id, payload) => {
    const response = await api.patch(`/admin/users/${id}/role`, payload);
    return response.data.user;
  },
  delete: async (id) => {
    await api.delete(`/admin/users/${id}`);
  },
  createManager: async (payload) => {
    const response = await api.post('/admin/users', payload);
    return response.data.user;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard');
    const data = response.data;

    if (data && typeof data === 'object' && 'stats' in data) {
      return data.stats;
    }

    if (data && typeof data === 'object' && 'users' in data) {
      return data;
    }

    throw new Error('Could not find dashboard stats in response');
  },

  getRevenueData: async (days = 30) => {
    const response = await api.get('/admin/dashboard/revenue', {
      params: { days },
    });
    return response.data.data;
  },
};

export const inventoryService = {
  getLowStock: async () => {
    const response = await api.get('/admin/inventory/low-stock');
    return response.data.products;
  },
  adjustStock: async (id, payload) => {
    const response = await api.post(`/admin/inventory/${id}/adjust`, payload);
    return response.data.product;
  },
  getLogs: async (id) => {
    const response = await api.get(`/admin/inventory/${id}/logs`);
    return response.data.logs;
  },
  getAllLogs: async (params = {}) => {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },
};

export const authService = {
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
  completeSetup: async () => {
    const response = await api.post('/auth/setup-complete');
    return response.data.user;
  },
};
