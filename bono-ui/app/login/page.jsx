"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
            bgcolor: index % 2 === 0 ? "#7FB3D5" : "#7FB3D5",
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
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");
    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(
        err.message || "No se pudo iniciar sesión. Verifique sus credenciales.",
      );
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#EEF3F8",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{ display: "flex", minHeight: "100vh" }}
      >
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
                radial-gradient(circle at 24% 18%, rgba(127,179,213,0.28), transparent 28%),
                radial-gradient(circle at 78% 12%, rgba(29,78,137,0.26), transparent 24%),
                linear-gradient(145deg, #1D4E89 0%, #0B1F3A 58%, #0B1F3A 100%)
              `,
            }}
          >
            <Stack
              sx={{ position: "relative", zIndex: 2, width: "100%" }}
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1.4}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#1C285A",
                  }}
                >
                  <Image
                    src="/Logo.png"
                    alt="Logo"
                    width={28}
                    height={28}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                    NeoInvest
                  </Typography>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}
                  >
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
                    color: "#EEF3F8",
                    bgcolor: "rgba(127,179,213,0.14)",
                    border: "1px solid rgba(127,179,213,0.28)",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { lg: 58, xl: 68 },
                    lineHeight: 0.98,
                    fontWeight: 950,
                  }}
                >
                  Entra a tu mesa de decision financiera.
                </Typography>
                <Typography
                  sx={{
                    mt: 3,
                    color: "rgba(255,255,255,0.66)",
                    fontSize: 18,
                    lineHeight: 1.72,
                  }}
                >
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.58)", fontSize: 13 }}
                    >
                      Resumen institucional
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: 28, fontWeight: 900 }}>
                      Portafolio balanceado
                    </Typography>
                  </Box>
                  <TrendingUpOutlinedIcon sx={{ color: "#EEF3F8" }} />
                </Stack>
                <MarketLine />
                <Box
                  sx={{
                    mt: 1.2,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                  }}
                >
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
                      <Typography
                        sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{ mt: 0.5, fontWeight: 900, fontSize: 20 }}
                      >
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
                radial-gradient(circle at 84% 12%, rgba(127,179,213,0.11), transparent 24%),
                linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 100%)
              `,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 470 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.3}
                sx={{ mb: 5 }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: { xs: "grid", lg: "none" },
                    placeItems: "center",
                    bgcolor: "#1C285A",
                  }}
                >
                  <Image
                    src="/Logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  sx={{ display: { xs: "block", lg: "none" }, fontWeight: 900 }}
                >
                  NeoInvest
                </Typography>
              </Stack>

              <Box sx={{ mb: 4 }}>
                <Typography
                  component="h1"
                  sx={{
                    color: "#1F2937",
                    fontSize: { xs: 36, sm: 44 },
                    lineHeight: 1.04,
                    fontWeight: 950,
                  }}
                >
                  Bienvenido de vuelta
                </Typography>
                <Typography sx={{ mt: 1.4, color: "#1F2937", lineHeight: 1.7 }}>
                  Accede para revisar tu dashboard, cartera y oportunidades de
                  CETES.
                </Typography>
              </Box>

              <Paper
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.88)",
                  border: "1px solid #D8E3EC",
                  boxShadow: "0 24px 60px rgba(11,31,58,0.10)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2.5 }}
                >
                  <LockOutlinedIcon sx={{ color: "#7FB3D5" }} />
                  <Typography sx={{ fontWeight: 900 }}>
                    Acceso a plataforma
                  </Typography>
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

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1.2}
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No tienes cuenta?{" "}
                      <NextLink
                        href="/register"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          component="span"
                          sx={{ fontWeight: 900, color: "#0B1F3A" }}
                        >
                          Crear cuenta
                        </Typography>
                      </NextLink>
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        alignSelf: { xs: "flex-start", sm: "center" },
                        color: "#1F2937",
                        p: 0,
                        minWidth: 0,
                      }}
                    >
                      Recuperar acceso
                    </Button>
                  </Stack>

                  <Collapse in={!!errorMsg} sx={{ mt: 3 }}>
                    <Alert
                      severity="error"
                      variant="filled"
                      onClose={() => setErrorMsg("")}
                      sx={{
                        borderRadius: "12px",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {errorMsg}
                    </Alert>
                  </Collapse>
                </form>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
