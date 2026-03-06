import axios from 'axios';

type ClerkSession = {
  getToken: () => Promise<string | null>;
  user?: { id?: string };
};

type ClerkGlobal = {
  session?: ClerkSession;
  user?: { id?: string };
};

declare global {
  interface Window {
    Clerk: ClerkGlobal;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined' && window.Clerk?.session) {
    try {
      const token = await window.Clerk.session.getToken();
      const userId = window.Clerk.session.user?.id || window.Clerk.user?.id;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      if (userId) {
        config.headers['clerkId'] = userId;
      }
    } catch (error) {
      console.error('Error fetching Clerk token:', error);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // console.log('API Response Raw:', response.data);
    // Automatically unwrap the 'data' property from our standard response format
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
