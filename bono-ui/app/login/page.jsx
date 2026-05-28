"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton, StyledTextField } from "../components/FormComponents";

const metrics = [
  ["Cartera", "$1.29M"],
  ["YTD", "+6.45%"],
  ["Liquidez", "T+0"],
];

function MarketLine() {
  return (
    <Box
      sx={{
        height: 160,
        borderRadius: "14px",
        position: "relative",
        overflow: "hidden",
        bgcolor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "38px 38px",
      }}
    >
      {[42, 70, 56, 92, 76, 118, 104, 132].map((height, index) => (
        <Box
          key={height + index}
          sx={{
            position: "absolute",
            left: `${9 + index * 11}%`,
            bottom: 24,
            width: 14,
            height,
            borderRadius: "5px 5px 0 0",
            bgcolor: index % 2 === 0 ? "#27B58A" : "#71A6F8",
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          left: "8%",
          right: "9%",
          top: "39%",
          height: 2,
          bgcolor: "#F1C66D",
          transform: "skewY(-8deg)",
        }}
      />
    </Box>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") router.replace("/admin");
      else if (user.role === "COLABORADOR") router.replace("/colab");
      else router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert("No se pudo iniciar sesion");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ display: "flex", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" },
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              position: "relative",
              p: 5,
              overflow: "hidden",
              color: "#fff",
              background: `
                radial-gradient(circle at 24% 18%, rgba(39,181,138,0.28), transparent 28%),
                radial-gradient(circle at 78% 12%, rgba(56,119,214,0.26), transparent 24%),
                linear-gradient(145deg, #2F3B48 0%, #101820 58%, #080D12 100%)
              `,
            }}
          >
            <Stack sx={{ position: "relative", zIndex: 2, width: "100%" }} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#DDF7EE",
                    color: "#101820",
                  }}
                >
                  <AutoGraphOutlinedIcon />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                    Acero Inteligente
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>
                    Plataforma de renta fija
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ maxWidth: 620, my: 8 }}>
                <Chip
                  icon={<ShieldOutlinedIcon />}
                  label="Acceso seguro"
                  sx={{
                    mb: 3,
                    borderRadius: "10px",
                    color: "#DDF7EE",
                    bgcolor: "rgba(39,181,138,0.14)",
                    border: "1px solid rgba(39,181,138,0.28)",
                  }}
                />
                <Typography sx={{ fontSize: { lg: 58, xl: 68 }, lineHeight: 0.98, fontWeight: 950 }}>
                  Entra a tu mesa de decision financiera.
                </Typography>
                <Typography sx={{ mt: 3, color: "rgba(255,255,255,0.66)", fontSize: 18, lineHeight: 1.72 }}>
                  Revisa rendimiento, liquidez, vencimientos y capital
                  disponible desde una interfaz creada para operar bonos con
                  claridad.
                </Typography>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(18px)",
                  color: "#fff",
                  maxWidth: 620,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 13 }}>
                      Resumen institucional
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: 28, fontWeight: 900 }}>
                      Portafolio balanceado
                    </Typography>
                  </Box>
                  <TrendingUpOutlinedIcon sx={{ color: "#DDF7EE" }} />
                </Stack>
                <MarketLine />
                <Box sx={{ mt: 1.2, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                  {metrics.map(([label, value]) => (
                    <Box
                      key={label}
                      sx={{
                        p: 1.4,
                        borderRadius: "12px",
                        bgcolor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                        {label}
                      </Typography>
                      <Typography sx={{ mt: 0.5, fontWeight: 900, fontSize: 20 }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Stack>
          </Box>

          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 2, sm: 4, md: 7 },
              py: { xs: 5, md: 7 },
              background: `
                radial-gradient(circle at 84% 12%, rgba(39,181,138,0.11), transparent 24%),
                linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)
              `,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 470 }}>
              <Stack direction="row" alignItems="center" spacing={1.3} sx={{ mb: 5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    display: { xs: "grid", lg: "none" },
                    placeItems: "center",
                    bgcolor: "#17212B",
                    color: "#DDF7EE",
                  }}
                >
                  <AutoGraphOutlinedIcon fontSize="small" />
                </Box>
                <Typography sx={{ display: { xs: "block", lg: "none" }, fontWeight: 900 }}>
                  Acero Inteligente
                </Typography>
              </Stack>

              <Box sx={{ mb: 4 }}>
                <Typography component="h1" sx={{ color: "#101820", fontSize: { xs: 36, sm: 44 }, lineHeight: 1.04, fontWeight: 950 }}>
                  Bienvenido de vuelta
                </Typography>
                <Typography sx={{ mt: 1.4, color: "#667382", lineHeight: 1.7 }}>
                  Accede para revisar tu dashboard, cartera y oportunidades de CETES.
                </Typography>
              </Box>

              <Paper
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(16,24,32,0.10)",
                  boxShadow: "0 24px 60px rgba(16,24,32,0.10)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                  <LockOutlinedIcon sx={{ color: "#27B58A" }} />
                  <Typography sx={{ fontWeight: 900 }}>Acceso a plataforma</Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleLogin}>
                  <StyledTextField
                    label="Email"
                    type="email"
                    placeholder="usuario@acero.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <StyledTextField
                    label="Password"
                    type="password"
                    placeholder="Tu password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <PrimaryButton type="submit" endIcon={<ArrowForwardIcon />}>
                    Entrar
                  </PrimaryButton>

                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.2} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No tienes cuenta?{" "}
                      <NextLink href="/register" style={{ textDecoration: "none" }}>
                        <Typography component="span" sx={{ fontWeight: 900, color: "#17212B" }}>
                          Crear cuenta
                        </Typography>
                      </NextLink>
                    </Typography>
                    <Button size="small" sx={{ alignSelf: { xs: "flex-start", sm: "center" }, color: "#667382", p: 0, minWidth: 0 }}>
                      Recuperar acceso
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
