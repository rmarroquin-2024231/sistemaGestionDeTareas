import axios from 'axios';

/**
 * El sistema está compuesto por microservicios independientes.
 * Cada uno expone su propia URL base configurable por variables de entorno,
 * para que el frontend pueda apuntar a cada servicio sin acoplarse a uno solo.
 */
const baseURLs = {
  auth: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000',
  tasks: import.meta.env.VITE_TASKS_API_URL || 'http://localhost:4001',
  productivity: import.meta.env.VITE_PRODUCTIVITY_API_URL || 'http://localhost:4002'
};

const createClient = (serviceKey) => {
  const client = axios.create({
    baseURL: baseURLs[serviceKey],
    headers: { 'Content-Type': 'application/json' }
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('luma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Si el token expiró o es inválido, cerramos la sesión localmente
  // y mandamos al usuario de vuelta al login.
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('luma_token');
        localStorage.removeItem('luma_user');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authClient = createClient('auth');
export const tasksClient = createClient('tasks');
export const productivityClient = createClient('productivity');
