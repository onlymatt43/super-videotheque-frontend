import axios from 'axios';

const ADMIN_TOKEN_KEY = 'admin_auth_token';
const ADMIN_AUTH_FLAG_KEY = 'admin_authenticated';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Avoid silently calling an old/stale backend when env vars are missing.
  // In dev you can still set `.env.local` with VITE_API_BASE_URL.
  throw new Error('Missing VITE_API_BASE_URL. Set it to your backend base URL (e.g. https://<render-domain>/api).');
}

export const apiClient = axios.create({
  baseURL,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export const setAdminSessionToken = (token: string) => {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_AUTH_FLAG_KEY, 'true');
};

export const clearAdminSessionToken = () => {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_FLAG_KEY);
};

export const hasAdminSessionToken = () =>
  Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_AUTH_FLAG_KEY));

const isAdminProtectedMutation = (method?: string, url?: string) => {
  if (!method || !url) return false;
  const normalizedMethod = method.toLowerCase();
  if (!['post', 'patch', 'delete'].includes(normalizedMethod)) return false;

  return (
    url.startsWith('/api/admin') ||
    url.startsWith('/api/movies') ||
    url.startsWith('/api/categories')
  );
};

// Normalize error messages from backend (use server-provided message when available)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Une erreur est survenue.';
    return Promise.reject(new Error(message));
  }
);

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token && isAdminProtectedMutation(config.method, config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
