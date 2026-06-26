import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/localStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    authService
      .getMe()
      .then((response) => {
        if (mounted) {
          setUser(response.user);
        }
      })
      .catch(() => {
        if (mounted) {
          clearStoredToken();
          setToken('');
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const authValue = useMemo(() => ({
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(user && token),
    async login(email, password) {
      setLoading(true);
      setError('');
      try {
        const response = await authService.login(email, password);
        setStoredToken(response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      } catch (loginError) {
        setError(loginError.message || 'Unable to login');
        throw loginError;
      } finally {
        setLoading(false);
      }
    },
    async register(name, email, password, passwordConfirm) {
      setLoading(true);
      setError('');
      try {
        const response = await authService.register(name, email, password, passwordConfirm);
        setStoredToken(response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      } catch (registerError) {
        setError(registerError.message || 'Unable to register');
        throw registerError;
      } finally {
        setLoading(false);
      }
    },
    async logout() {
      try {
        await authService.logout();
      } finally {
        clearStoredToken();
        setToken('');
        setUser(null);
      }
    },
    async refreshUser() {
      const response = await authService.getMe();
      setUser(response.user);
      return response.user;
    },
    setError,
  }), [user, token, loading, error]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
