// src/api/axios.js

/**
 * Global Axios instance configuration.
 * Handles API base URL, request headers, and automatic token injection.
 */
import axios from 'axios';
import storage from '../utils/storage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: Injects authentication token.
 */
api.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Handles unauthorized access (401).
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401,403].includes(error.response.status)) {
            storage.clearStorage();
            // Redirect to login if not already there to prevent loops
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
