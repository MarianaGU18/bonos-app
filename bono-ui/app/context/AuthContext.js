"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN (CON COOKIE)
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 CLAVE
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("RESPUESTA:", data);

    // ❌ ya NO validar token
    if (!res.ok || data.message !== "LOGIN OK") {
      throw new Error(data.message || "Login failed");
    }

    const userData = {
      email: data.email,
      role: data.role,
    };

    setUser(userData);

    // ✔ solo guardamos user (opcional)
    localStorage.setItem("user", JSON.stringify(userData));

    return data;
  };

  // 🔐 FETCH AUTOMÁTICO (USA COOKIE)
  const authFetch = async (url, options = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include", // 🔥 IMPORTANTE
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

  // 🚪 LOGOUT
  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // 🧠 ROLES
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const isColaborador = user?.role === "COLABORADOR";

  return (
    <AuthContext.Provider
      value={{
        user,
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
