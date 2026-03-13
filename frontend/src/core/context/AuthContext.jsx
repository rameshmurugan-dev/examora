/**
 * Authentication Context Provider.
 * Manages user session, login, logout, and token storage.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import storage from '../utils/storage';

const AuthContext = createContext(null);

/**
 * Provider component to wrap the app with authentication state.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async (isInitialLoad = false) => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            // Clear storage if session fetch fails (e.g., token expired)
            storage.clearStorage();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = storage.getToken();
        if (token) {
            fetchUser(true);
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);

            // ✅ Extract JWT correctly from ApiResponse
            const token = response.data.data;

            storage.setToken(token);

            await fetchUser();
            return true;
        } catch (error) {
            throw error;
        }
    };


    const logout = () => {
        storage.clearStorage();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * data access hook for AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
