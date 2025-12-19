import axios from 'axios';

// Use environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// Add token to requests if it exists
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

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token'); // Clean up refresh token too
    localStorage.removeItem('user');
  },
  verifyToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('No token found'));
    }
    // Fixed path: removed extra '/api' since baseURL has it
    return api.get('/auth/verify/'); 
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    // basic check: must have token and user object
    return !!(token && user);
  },
};

// Project services
export const projectService = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  
  // FIX: Remove the manual 'headers' object. Axios handles it automatically for FormData.
  create: (data) => api.post('/projects/', data),
  
  update: (id, data) => api.put(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
};

// Client services
export const clientService = {
  getAll: () => api.get('/clients/'),
  
  // FIX: Remove manual headers here too
  create: (data) => api.post('/clients/', data),
  
  delete: (id) => api.delete(`/clients/${id}/`),
};

// Contact services
export const contactService = {
  // FIX: Renamed 'submit' to 'create' to match LandingPage usage
  create: (data) => api.post('/contact/', data),
  getAll: () => api.get('/contact/'),
  markAsRead: (id) => api.patch(`/contact/${id}/`, { is_read: true }),
  delete: (id) => api.delete(`/contact/${id}/`),
};

// Newsletter services
export const newsletterService = {
  // FIX: Renamed 'subscribe' to 'create' to match LandingPage usage
  create: (data) => api.post('/newsletter/', data),
  getAll: () => api.get('/newsletter/'),
  unsubscribe: (id) => api.post(`/newsletter/${id}/unsubscribe/`),
};

export default api;