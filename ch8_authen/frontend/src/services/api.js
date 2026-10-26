import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = 'Bearer ' + token; return config; });
export const authApi = { register: (data) => api.post('/auth/register', data), login: (data) => api.post('/auth/login', data), me: () => api.get('/auth/me') };
export const menuApi = { getAll: () => api.get('/menus'), create: (data) => api.post('/menus', data), update: (id, data) => api.put('/menus/' + id, data), remove: (id) => api.delete('/menus/' + id), rate: (id, value) => api.put('/menus/' + id + '/rating', { value }) };
export const userApi = { getAll: () => api.get('/users'), changeRole: (id, role) => api.put('/users/' + id + '/role', { role }) };
