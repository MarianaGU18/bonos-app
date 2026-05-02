"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 🔒 No autenticado
      if (!user) {
        router.push("/login");
        return;
      }

      // 🔒 No tiene el rol correcto
      if (role && user.role !== role) {
        if (user.role == "ADMIN") {
          router.push("/admin");
        } else if (user.role == "COLABORADOR") {
          router.push("/colab");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, loading, role, router]);

  if (loading) return null;

  return children;
}
