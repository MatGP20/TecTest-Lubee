import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ttl-token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ttl-user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("ttl-token", token);
    } else {
      localStorage.removeItem("ttl-token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ttl-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ttl-user");
    }
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!resp.ok) {
        throw new Error(resp.status === 401 ? "Credenciales inválidas" : "Error de autenticación");
      }
      const data = await resp.json();
      // API devuelve "accessToken" (camelCase) desde LoginResponse.AccessToken
      const accessToken = data.accessToken || data.token;
      if (!accessToken) {
        throw new Error("Token no recibido");
      }
      const loggedUser = { username: data.username, role: data.role };
      setToken(accessToken);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
