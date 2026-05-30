"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext();

// Definimos la URL base para las APIs de autenticación y transacciones
const API_URL =
  process.env.NEXT_PUBLIC_API_URL_V1 ||
  "https://bonos-app-production.up.railway.app/api/v1";

// Función auxiliar para manejar respuestas de la API
// Definida fuera del componente para que sea una referencia estática estable
const handleResponse = async (res) => {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    const statusMessages = {
      400: "The information provided is incorrect. Please check the fields.",
      401: "Your session has expired. Please log in again.",
      403: "Correo o contraseña incorrectos. Intenta nuevamente.",
      404: "The requested resource was not found.",
      409: "This email address is already registered. Please use another one.",
      500: "Our servers are having trouble. Please try again in a few minutes.",
    };

    const serverMsg = data.message || data.error || "";
    const isGeneric =
      !serverMsg ||
      [
        "Conflict",
        "Forbidden",
        "Bad Request",
        "Unauthorized",
        "No message available",
        "Access Denied",
      ].includes(serverMsg);

    const errorMessage = isGeneric
      ? statusMessages[res.status] ||
        serverMsg ||
        res.statusText ||
        "An unexpected error occurred"
      : serverMsg;

    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }
  return data;
};

// Safe localStorage helpers — Safari private mode throws SecurityError on write
const storage = {
  get: (key) => {
    try { return typeof window !== "undefined" ? localStorage.getItem(key) : null; } catch { return null; }
  },
  set: (key, value) => {
    try { if (typeof window !== "undefined") localStorage.setItem(key, value); } catch { /* private mode */ }
  },
  remove: (key) => {
    try { if (typeof window !== "undefined") localStorage.removeItem(key); } catch { /* private mode */ }
  },
};

export function AuthProvider({ children }) {
  const normalizeUser = (data) => {
    if (!data) return null;
    const normalized = { ...data };
    normalized.birthdate = data.birthdate || data.birthDate || "";
    return normalized;
  };

  const [user, setUser] = useState(() => {
    const storedUser = storage.get("user");
    return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
  });

  const [loading, setLoading] = useState(false);

  const authFetch = useCallback(async (url, options = {}) => {
    const token = storage.get("token");
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      storage.remove("token");
      storage.remove("user");
      setUser(null);
      if (typeof window !== "undefined") window.location.assign("/login");
      throw new Error("Session expired");
    }

    return res;
  }, []);

  // This function remains for profile text updates (name, etc.)
  const updateUser = async (newUserData) => {
    if (!user || !user.id) {
      throw new Error("User not authenticated or available.");
    }

    setLoading(true);

    // Creamos el payload asegurando compatibilidad de nombres para Java (CamelCase)
    const payload = {
      ...user,
      ...newUserData,
      birthDate: newUserData.birthdate, // Duplicamos para asegurar que el backend lo reciba
    };

    try {
      const response = await authFetch(`/auth/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const updatedUserFromServer = await handleResponse(response);
      // Mezclamos con cuidado: si el servidor no devuelve la fecha, mantenemos la local
      const mergedData = { ...user, ...updatedUserFromServer };
      if (
        !updatedUserFromServer.birthdate &&
        !updatedUserFromServer.birthDate &&
        newUserData.birthdate
      ) {
        mergedData.birthdate = newUserData.birthdate;
      }

      const finalUser = normalizeUser(mergedData);
      setUser(finalUser);
      storage.set("user", JSON.stringify(finalUser));
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
      const response = await authFetch(`/portafolio/deposito/${userId}`, {
        method: "POST",
        body: JSON.stringify({ monto: amount }),
      });

      const updatedPortfolio = await handleResponse(response);

      // Update the user state with the new balance from the portfolio
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      storage.set("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("AuthContext: Error in makeDeposit function:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await handleResponse(response);
    if (data.message !== "LOGIN OK") {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) storage.set("token", data.token);

    // After login, fetch the portfolio to get the correct balance
    try {
      const portfolioRes = await fetch(
        `${API_URL}/portafolio/user/${data.id}`,
        {
          credentials: "include",
          headers: data.token ? { Authorization: `Bearer ${data.token}` } : {},
        },
      );
      if (!portfolioRes.ok) {
        data.balance = 0;
      } else {
        const portfolioData = await portfolioRes.json();
        data.balance = portfolioData.cashBalance;
      }
    } catch {
      data.balance = 0;
    }

    const finalUser = normalizeUser(data);
    setUser(finalUser);
    storage.set("user", JSON.stringify(finalUser));
    return finalUser;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      storage.remove("token");
      storage.remove("user");
      window.location.assign("/login");
    }
  };

  const register = async (userData) => {
    // Aseguramos que el objeto que enviamos tenga ambos nombres de campo
    const payload = {
      ...userData,
      birthDate: userData.birthdate,
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);

    if (data.token) storage.set("token", data.token);

    const mergedData = { ...userData, ...data, balance: 0 };
    if (!data.birthdate && !data.birthDate && userData.birthdate) {
      mergedData.birthdate = userData.birthdate;
    }

    const finalUser = normalizeUser(mergedData);
    setUser(finalUser);
    storage.set("user", JSON.stringify(finalUser));
    return finalUser;
  };

  const sellCetes = async (ceteId) => {
    setLoading(true);
    try {
      const response = await authFetch(`/cetes/vender/${ceteId}`, {
        method: "POST",
      });

      const updatedPortfolio = await handleResponse(response);
      // Actualizar el balance del usuario en el estado global
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      storage.set("user", JSON.stringify(updatedUser));
      return updatedPortfolio;
    } finally {
      setLoading(false);
    }
  };

  const getCetesRates = useCallback(async () => {
    const response = await authFetch("/cetes/rates");
    return await handleResponse(response);
  }, [authFetch]);

  const calculateInversion = useCallback(
    async (monto, plazo, tasa) => {
      // Aseguramos que los valores sean numéricos antes de enviarlos
      const m = parseFloat(monto) || 0;
      const p = parseInt(plazo) || 28;
      const t = parseFloat(tasa) || 0;

      const response = await authFetch(
        `/cetes/calcular?monto=${m}&plazo=${p}&tasa=${t}`,
      );
      return await handleResponse(response);
    },
    [authFetch],
  );

  const buyCetes = async (monto, plazo, tasa) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await authFetch("/cetes/comprar", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, monto, plazo, tasa }),
      });

      const updatedPortfolio = await handleResponse(response);
      const updatedUser = { ...user, balance: updatedPortfolio.cashBalance };
      setUser(updatedUser);
      storage.set("user", JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  const estimateCeteSale = async (ceteId) => {
    try {
      const response = await authFetch(`/cetes/estimar-venta/${ceteId}`, {
        method: "GET",
      });
      return await handleResponse(response);
    } finally {
      // No activamos el loading global para evitar que la UI principal se oculte al pedir estimaciones
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
        calculateInversion,
        getCetesRates,
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
