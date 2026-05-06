"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { deepOrange } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

// --- Componente de Contenido de la Página ---
// Este componente renderiza la UI del perfil y asume que el usuario ya está autenticado.
function ProfilePageContent({ user }) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const name = user?.name ?? "Usuario";
  const email = user?.email ?? "cargando...";
  const role = user?.role ?? "USER";
  console.log(user);

  const getRoleChip = (role) => {
    switch (role) {
      case "ADMIN":
        return <Chip label="Administrator" color="error" variant="filled" />;
      case "COLABORADOR":
        return <Chip label="Contributor" color="primary" variant="filled" />;
      default:
        return <Chip label="User" color="success" variant="filled" />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Mi Perfil
      </Typography>
      <Grid container spacing={4}>
        {/* Columna Izquierda: Tarjeta de Perfil */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 16px",
                  bgcolor: deepOrange[500],
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 90 }} />
              </Avatar>
              <Typography variant="h5" component="div">
                {name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {email}
              </Typography>
              {getRoleChip(role)}
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Button variant="contained" startIcon={<EditIcon />} disabled>
                  Editar Perfil
                </Button>
                <Button variant="outlined" startIcon={<LockIcon />} disabled>
                  Cambiar Contraseña
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha: Pestañas de Configuración */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="pestañas de configuración"
              >
                <Tab label="Configuración de la Cuenta" />
                <Tab label="Seguridad" />
                <Tab label="Notificaciones" disabled />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6">Detalles de la Cuenta</Typography>
              <Typography sx={{ mt: 2 }}>
                Aquí podrás administrar la información de tu cuenta, como tu
                nombre y correo electrónico.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                La funcionalidad para editar la cuenta estará disponible
                próximamente.
              </Alert>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6">Opciones de Seguridad</Typography>
              <Typography sx={{ mt: 2 }}>
                Aquí podrás cambiar tu contraseña y gestionar la autenticación
                de dos factores (2FA).
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Las opciones de seguridad avanzadas se implementarán en una
                futura actualización.
              </Alert>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// --- Componente Envoltorio de Protección ---
function ProtectedProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si después de la carga inicial el usuario no está autenticado, redirige.
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Mientras no esté autenticado (en el proceso de redirección), muestra un loader.
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si el usuario está autenticado, renderiza la página de perfil con sus datos.
  return <ProfilePageContent user={user} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default ProtectedProfilePage;
