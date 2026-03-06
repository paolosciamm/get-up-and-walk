import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (req: LoginRequest) => {
    const res = await authService.login(req);
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, email: res.email }));
    setToken(res.token);
    setUser({ username: res.username, email: res.email });
  };

  const register = async (req: RegisterRequest) => {
    const res = await authService.register(req);
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('user', JSON.stringify({ username: res.username, email: res.email }));
    setToken(res.token);
    setUser({ username: res.username, email: res.email });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
