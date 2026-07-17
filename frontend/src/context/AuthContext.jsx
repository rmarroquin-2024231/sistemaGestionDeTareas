import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../services/authService.js';

const TOKEN_KEY = 'luma_token';
const USER_KEY = 'luma_user';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsReady(true);
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    const { user: loggedUser, token } = await loginRequest({ identifier, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async ({ nombre, username, email, password }) => {
    return registerRequest({ nombre, username, email, password });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isReady, login, register, logout }),
    [user, isReady, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
