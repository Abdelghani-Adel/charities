import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { api } from "../services/api";

const TOKEN_KEY = "auth_token";
const EXPIRES_KEY = "auth_expires_at";

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadToken(): { token: string | null; expiresAt: string | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  return { token, expiresAt };
}

function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!expiresAt) return true;
  return Date.now() >= new Date(expiresAt).getTime();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = loadToken();
  const [token, setToken] = useState<string | null>(stored.token);
  const [expiresAt, setExpiresAt] = useState<string | null>(stored.expiresAt);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    api.clearToken();
    setToken(null);
    setExpiresAt(null);
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<{ token: string; expiresAt: string }>("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(EXPIRES_KEY, result.expiresAt);
      api.setToken(result.token);
      setToken(result.token);
      setExpiresAt(result.expiresAt);
    } catch (err: any) {
      const message = err?.message ?? "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isAuthenticated = !!token && !isTokenExpired();

  const value = useMemo(
    () => ({ token, expiresAt, isAuthenticated, error, loading, login, logout, clearError }),
    [token, expiresAt, isAuthenticated, error, loading, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
