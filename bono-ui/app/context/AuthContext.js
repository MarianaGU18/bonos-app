"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: email, password }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error("Invalid response from server");
    }
    if (!res.ok || !data.token) {
      throw new Error(data.message || "Login failed");
    }

    const userData = {
      mail: data.mail,
      role: data.role,
    };

    setUser(userData);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    return data;
  };

  // 🔄 REFRESH TOKEN (simulado - listo para backend)
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      setToken(data.token);
      localStorage.setItem("token", data.token);

      return data.token;
    } catch (error) {
      logout();
    }
  };

  // 🔐 FETCH CON TOKEN AUTOMÁTICO
  const authFetch = async (url, options = {}) => {
    let currentToken = token;

    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
    });

    // 🔥 Si token expiró → intenta refresh
    if (res.status === 401) {
      const newToken = await refreshToken();

      if (!newToken) throw new Error("Session expired");

      return fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    return res;
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  // 🧠 HELPERS DE ROLES
  const isAuthenticated = !!user;

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const isColaborador = user?.role === "COLABORADOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        authFetch,
        isAuthenticated,
        isAdmin,
        isUser,
        isColaborador,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
