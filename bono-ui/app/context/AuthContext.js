"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // 🔐 LOGIN 
  const login = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      throw new Error(data.message || "Login failed");
    }

    const userData = { mail: data.mail };

    setUser(userData);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    return data;
  };

  // 📝 REGISTER
  const register = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Register failed");
    }

    return data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getAuthHeaders = () => {
    return { 
      "Content-Type": "application/json",  
      Authorization: `Bearer ${token}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}