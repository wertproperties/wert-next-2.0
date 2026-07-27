import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const propertiesAPI = {
  getAll:      (params) => api.get('/properties', { params }),
  getFeatured: ()        => api.get('/properties', { params: { featured: true } }),
  getById:     (id)      => api.get(`/properties/${id}`),
  seed:        ()        => api.get('/properties/seed'),
};

export const formsAPI = {
  submitDamage:      (data) => api.post('/forms/damage', data),
  submitKey:         (data) => api.post('/forms/key', data),
  submitTenantChange:(data) => api.post('/forms/tenant-change', data),
};

export default api;
