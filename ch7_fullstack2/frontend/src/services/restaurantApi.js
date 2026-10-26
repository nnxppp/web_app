import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const menuApi = {
  getAll: async (params) => (await api.get('/menu', { params })).data,
  create: async (data) => (await api.post('/menu', data)).data,
  update: async (menuId, data) => (await api.put('/menu/' + menuId, data)).data,
  remove: async (menuId) => (await api.delete('/menu/' + menuId)).data,
};

export const typeApi = {
  getAll: async () => (await api.get('/type?includeMenus=false')).data,
  create: async (data) => (await api.post('/type', data)).data,
  update: async (typeId, data) => (await api.put('/type/' + typeId, data)).data,
  remove: async (typeId) => (await api.delete('/type/' + typeId)).data,
};
