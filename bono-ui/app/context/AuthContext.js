"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

// Definimos la URL base para las APIs de autenticación y transacciones
const API_URL =
  process.env.NEXT_PUBLIC_API_URL_V1 || "http://localhost:8080/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const authFetch = useCallback(async (url, options = {}) => {
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
  }, []);

  // This function remains for profile text updates (name, etc.)
  const updateUser = async (newUserData) => {
    if (!user || !user.id) {
      console.error(
        "AuthContext: Cannot update user. User or user.id is missing.",
      );
      throw new Error("User not authenticated or available.");
    }

    setLoading(true);
    const updatedData = { ...user, ...newUserData };

    try {
      const res = await authFetch(`/auth/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update user profile.");
      }

      const updatedUserFromServer = await res.json();
      // Combine server response with existing balance to keep UI consistent
      const finalUser = { ...updatedUserFromServer, balance: user.balance };

      setUser(finalUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(finalUser));
      }
      return finalUser;
    } catch (error) {
      console.error("AuthContext: Error in updateUser function:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTION FOR DEPOSITS ---
  const makeDeposit = async (userId, amount) => {
    if (!userId) {
      throw new Error("User ID is required to make a deposit.");
    }
    setLoading(true);
    try {
      const res = await authFetch(`/portafolio/deposito/${userId}`, {
        method: "POST",
        body: JSON.stringify({ monto: amount }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to process deposit.");
      }

      const updatedPortfolio = await res.json();

      // Update the user state with the new balance from the portfolio
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error) {
      console.error("AuthContext: Error in makeDeposit function:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok || data.message !== "LOGIN OK") {
      throw new Error(data.message || "Login failed");
    }

    // After login, fetch the portfolio to get the correct balance
    try {
      const portfolioRes = await fetch(
        `${API_URL}/portafolio/user/${data.id}`,
        {
          credentials: "include",
        },
      );
      if (!portfolioRes.ok) {
        // If portfolio doesn't exist, default balance to 0
        console.warn(
          "Could not fetch portfolio after login. Defaulting balance to 0.",
        );
        data.balance = 0;
      } else {
        const portfolioData = await portfolioRes.json();
        data.balance = portfolioData.cashBalance;
      }
    } catch (e) {
      console.error("Error fetching portfolio, defaulting balance to 0:", e);
      data.balance = 0;
    }

    setUser(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const register = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const authUser = {
      id: data.id,
      name: data.name,
      lastname: data.lastname,
      maternallast: data.maternallast,
      birthdate: data.birthdate,
      email: data.email,
      role: data.role,
    };

    setUser(authUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(authUser));
    }

    return data;
  };

  const sellCetes = async (ceteId) => {
    setLoading(true);
    try {
      const res = await authFetch(`/cetes/vender/${ceteId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to sell CETES.");
      }

      const updatedPortfolio = await res.json();
      // Actualizar el balance del usuario en el estado global
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return updatedPortfolio;
    } finally {
      setLoading(false);
    }
  };

  const buyCetes = async (monto, dias) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await authFetch("/cetes/comprar", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, monto, dias }),
      });

      if (!res.ok) throw new Error("Failed to process purchase");

      const updatedPortfolio = await res.json();
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const estimateCeteSale = async (ceteId) => {
    setLoading(true); // Consider using a separate loading state for estimates if needed
    try {
      const res = await authFetch(`/cetes/estimar-venta/${ceteId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to estimate CETE sale.");
      }
      return await res.json();
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        makeDeposit, // <-- Expose the new function
        loading,
        register,
        login,
        logout,
        authFetch,
        sellCetes,
        buyCetes,
        estimateCeteSale,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
