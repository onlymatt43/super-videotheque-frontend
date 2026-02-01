import axios from 'axios';

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

// Normalize error messages from backend (use server-provided message when available)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Une erreur est survenue.';
    return Promise.reject(new Error(message));
  }
);

// Add admin authentication header if password is set
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
if (adminPassword) {
  apiClient.interceptors.request.use((config) => {
    // Only add auth header for admin routes (POST, PATCH, DELETE)
    if (config.method && ['post', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers.Authorization = `Bearer ${adminPassword}`;
    }
    return config;
  });
}
