import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');

            // Check if we're on an admin route
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                // Optionally redirect to login for regular users
                // window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
