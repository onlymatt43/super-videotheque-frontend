import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'https://backend-j3rvyszxi-matts-projects-77a3636c.vercel.app';

export const apiClient = axios.create({
  baseURL,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

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
