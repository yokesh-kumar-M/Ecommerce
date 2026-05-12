import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shopnest-backend-001.onrender.com';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        Cookies.set('access_token', data.access, { expires: 1 / 24, secure: true, sameSite: 'strict' });
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export const productsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/products/', { params }),
  retrieve: (id: number) => api.get(`/products/${id}/`),
  create: (data: FormData) => api.post('/products/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.patch(`/products/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/products/${id}/`),
  reviews: (productId: number) => api.get(`/products/${productId}/reviews/`),
  addReview: (productId: number, data: { name: string; description: string; rating: number }) =>
    api.post(`/products/${productId}/reviews/`, data),
};

export const collectionsApi = {
  list: () => api.get('/collections/'),
  retrieve: (id: number) => api.get(`/collections/${id}/`),
};

export const cartApi = {
  create: () => api.post('/carts/'),
  retrieve: (cartId: string) => api.get(`/carts/${cartId}/`),
  delete: (cartId: string) => api.delete(`/carts/${cartId}/`),
  addItem: (cartId: string, data: { product_id: number; quantity: number }) =>
    api.post(`/carts/${cartId}/items/`, data),
  updateItem: (cartId: string, itemId: number, data: { quantity: number }) =>
    api.patch(`/carts/${cartId}/items/${itemId}/`, data),
  deleteItem: (cartId: string, itemId: number) =>
    api.delete(`/carts/${cartId}/items/${itemId}/`),
};

export const ordersApi = {
  list: () => api.get('/orders/'),
  retrieve: (id: number) => api.get(`/orders/${id}/`),
  create: (cart_id: string) => api.post('/orders/', { cart_id }),
};

export const customerApi = {
  me: () => api.get('/customers/me/'),
  updateMe: (data: Partial<{ first_name: string; last_name: string; phone: string; birth_date: string }>) =>
    api.put('/customers/me/', data),
  addresses: () => api.get('/addresses/'),
  addAddress: (data: { street: string; city: string; state: string; zip_code: string; country: string }) =>
    api.post('/addresses/', data),
  deleteAddress: (id: number) => api.delete(`/addresses/${id}/`),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/token/', { email, password }),
  refresh: (refresh: string) =>
    api.post('/auth/token/refresh/', { refresh }),
};
