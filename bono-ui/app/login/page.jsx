"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { StyledTextField, PrimaryButton } from "../components/FormComponents";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else if (user.role == "COLABORADOR") {
        router.replace("/colab");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert("Authentication Failed ❌");
      console.error(error);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,

        background: `
          radial-gradient(circle at top left, rgba(25,118,210,0.08), transparent 25%),
          radial-gradient(circle at bottom right, rgba(15,23,42,0.06), transparent 30%),
          ${theme.palette.background.default}
        `,
      })}
    >
      <Container maxWidth="sm">
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: 800,
                letterSpacing: "-1px",
                color: theme.palette.text.primary,
              })}
            >
              Bonos
            </Typography>

            <Box
              sx={(theme) => ({
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: theme.palette.secondary.main,
                boxShadow: `0 0 12px ${theme.palette.secondary.main}66`,
                mt: "8px",
              })}
            />
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 320, mx: "auto" }}
          >
            Securely manage your bond portfolio and track your investments in
            real time.
          </Typography>
        </Box>

        {/* CARD */}
        <Card
          elevation={0}
          sx={(theme) => ({
            borderRadius: 5,
            border: `1px solid ${theme.palette.border?.light || "#e2e8f0"}`,
            bgcolor: "background.paper",
            backdropFilter: "blur(10px)",
            transition: "all 0.25s ease",

            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: theme.shadows[4],
            },
          })}
        >
          <CardContent sx={{ p: 5 }}>
            {/* TITLE */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}
              >
                Welcome Back
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Login to continue to your dashboard
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* FORM */}
            <form onSubmit={handleLogin}>
              <StyledTextField
                label="Email"
                type="email"
                placeholder="admin@bonos.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <StyledTextField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Box sx={{ mt: 3 }}>
                <PrimaryButton type="submit">Login</PrimaryButton>
              </Box>

              {/* REGISTER */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <NextLink href="/register" style={{ textDecoration: "none" }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: "secondary.main",
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
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
