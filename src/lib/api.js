import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  // Wait for Clerk to be ready on the client side
  if (typeof window !== 'undefined' && window.Clerk) {
    try {
      // Ensure we have a session to get a token from
      if (window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        const userId = window.Clerk.user?.id;

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
          config.headers['clerkId'] = userId;
        }
      }
    } catch (error) {
      console.warn('API Interceptor: Error fetching Clerk token', error);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === 'success' && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized (401) - Please ensure you are logged in and synced.');
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    } else if (error.response?.status === 403) {
      console.error('Forbidden (403)');
    }
    return Promise.reject(error);
  },
);

export default api;
