import axios from 'axios';

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Tự động gắn token vào mọi request
httpRequest.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    config.headers.Authorization = `Bearer ${userData.jwt}`;
  }
  return config;
});

export const get = async (path: string, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path: string, options = {}) => {
  const response = await httpRequest.post(path, options);
  return response.data;
};

export default httpRequest;