"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api/v1";

export function AuthProvider({ children }) {
  // Inicialización correcta sin useEffect
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Register
  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const userData = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return data;
  };

  // Login (con cookie)
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();

    console.log("LOGIN DATA:", data);

    if (!res.ok || data.message !== "LOGIN OK") {
      throw new Error(data.message || "Login failed");
    }

    const userData = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return data;
  };

  // Fetch automático
  const authFetch = async (url, options = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      logout();
      throw new Error("Session expired");
    }

    return res;
  };

  // Logout
  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // Roles
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const isColaborador = user?.role === "COLABORADOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
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
