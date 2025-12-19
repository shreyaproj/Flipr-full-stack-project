import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  verifyToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('No token found'));
    }
    return api.get('/auth/verify/');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    return !!(token && user);
  },
};

export const projectService = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.put(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
};

export const clientService = {
  getAll: () => api.get('/clients/'),
  create: (data) => api.post('/clients/', data),
  delete: (id) => api.delete(`/clients/${id}/`),
};

export const contactService = {
  create: (data) => api.post('/contact/', data),
  getAll: () => api.get('/contact/'),
  markAsRead: (id) => api.patch(`/contact/${id}/`, { is_read: true }),
  delete: (id) => api.delete(`/contact/${id}/`),
};

export const newsletterService = {
  create: (data) => api.post('/newsletter/', data),
  getAll: () => api.get('/newsletter/'),
  unsubscribe: (id) => api.post(`/newsletter/${id}/unsubscribe/`),
};

export default api;