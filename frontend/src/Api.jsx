import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Vite style
  withCredentials: true
});

export default api;
