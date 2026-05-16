"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const updateUser = async (userData) => {
    console.log("AuthContext: Attempting to update user with data:", userData);
    setLoading(true);
    try {
      const res = await authFetch(`/auth/user/${userData.id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("AuthContext: Error response from server:", errorData);
        throw new Error(errorData.message || "Failed to update user profile.");
      }

      const updatedUser = await res.json();
      console.log(
        "AuthContext: User updated successfully. Server response:",
        updatedUser,
      );

      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error) {
      console.error("AuthContext: Error in updateUser function:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, lastname, maternallast, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, lastname, maternallast, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const userData = {
      id: data.id,
      name: data.name,
      lastname: data.lastname,
      maternallast: data.maternallast,
      email: data.email,
      role: data.role,
    };

    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return data;
  };

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

    if (!res.ok || data.message !== "LOGIN OK") {
      throw new Error(data.message || "Login failed");
    }

    const userData = {
      id: data.id,
      name: data.name,
      lastname: data.lastname,
      maternallast: data.maternallast,
      email: data.email,
      role: data.role,
    };

    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return data;
  };

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

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const isColaborador = user?.role === "COLABORADOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
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
