"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      alert("Error de autenticación ❌");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Bonos
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: (theme) => theme.palette.accent.main,
                ml: 0.8,
                mt: "6px",
              }}
            />
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Securely manage your bond portfolio
          </Typography>
        </Box>

        {/* Card */}
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Welcome Back
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Correo"
                type="email"
                margin="normal"
                required
                placeholder="admin@bonos.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                margin="normal"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                }}
              >
                Login
              </Button>

              {/* Registro */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don t have an account?{" "}
                  <NextLink href="/register" style={{ textDecoration: "none" }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Create account
                    </Typography>
                  </NextLink>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
