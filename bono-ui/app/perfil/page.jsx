"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  CssBaseline,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { user } = useAuth();

  // Defaults seguros
  const name = user?.name ?? "Usuario";
  const email = user?.email ?? "usuario@example.com";

  const role =
    user?.role === "ADMIN"
      ? "Administrador"
      : user?.role === "COLABORADOR"
        ? "Colaborador"
        : "Usuario";

  return (
    <React.Fragment>
      <CssBaseline />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <Box
          sx={{
            width: 280,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              bgcolor: "transparent",
              color: "white",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                src={user?.avatar || "/profile.svg"}
                sx={{
                  mx: "auto",
                  mb: 2,
                  width: 100,
                  height: 100,
                  bgcolor: "secondary.main",
                  fontSize: 32,
                }}
              >
                {name.charAt(0)}
              </Avatar>

              <Typography variant="h6" fontWeight="bold">
                {name}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {email}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {role}
              </Typography>

              <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
                Perfil del usuario en el sistema
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, bgcolor: "secondary.main" }}
              >
                Editar perfil
              </Button>
            </CardContent>
          </Card>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mt: 2 }} />
        </Box>

        {/* CONTENIDO PRINCIPAL */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Panel principal
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Aquí puedes configurar los detalles de tu cuenta, cambiar tu
            contraseña y gestionar tus preferencias.
          </Typography>

          {/* Sección futura */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Configuración de cuenta
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Aquí puedes agregar módulos como seguridad, notificaciones, roles
              o actividad reciente.
            </Typography>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
