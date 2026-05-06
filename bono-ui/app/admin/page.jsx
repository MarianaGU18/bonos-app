"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PeopleIcon from "@mui/icons-material/People";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// --- Mock Data (Datos de Ejemplo para el Admin Dashboard) ---
const adminKpiData = {
  totalUsers: 152,
  pendingUsers: 3,
  activeBonds: 438,
  serverLoad: 25.5, // Percentage
};

const users = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@example.com",
    role: "USER",
    registeredAt: "2024-06-10",
    status: "active",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos.perez@example.com",
    role: "COLABORADOR",
    registeredAt: "2024-06-09",
    status: "active",
  },
  {
    id: 3,
    name: "Admin Principal",
    email: "admin@bonosapp.com",
    role: "ADMIN",
    registeredAt: "2024-01-15",
    status: "active",
  },
  {
    id: 4,
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    role: "USER",
    registeredAt: "2024-06-12",
    status: "pending",
  },
  {
    id: 5,
    name: "Javier Rodríguez",
    email: "javier.r@example.com",
    role: "USER",
    registeredAt: "2024-06-11",
    status: "active",
  },
  {
    id: 6,
    name: "Sofía Hernández",
    email: "sofia.h@example.com",
    role: "USER",
    registeredAt: "2024-06-13",
    status: "pending",
  },
  {
    id: 7,
    name: "Miguel López",
    email: "miguel.lopez@example.com",
    role: "USER",
    registeredAt: "2024-06-13",
    status: "pending",
  },
];

const getRoleChip = (role) => {
  switch (role) {
    case "ADMIN":
      return <Chip label="Admin" color="error" size="small" />;
    case "COLABORADOR":
      return <Chip label="Colaborador" color="primary" size="small" />;
    default:
      return <Chip label="Usuario" color="success" size="small" />;
  }
};

// --- Componente de Contenido del Dashboard de Admin ---
function AdminDashboardContent() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Panel de Administración
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="text.secondary">Usuarios Totales</Typography>
                <Typography variant="h5">{adminKpiData.totalUsers}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <HourglassEmptyIcon
                color="warning"
                sx={{ fontSize: 40, mr: 2 }}
              />
              <Box>
                <Typography color="text.secondary">
                  Usuarios Pendientes
                </Typography>
                <Typography variant="h5">
                  {adminKpiData.pendingUsers}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more KPIs if needed */}
      </Grid>

      {/* Tabla de Gestión de Usuarios */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Gestión de Usuarios
        </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabla de usuarios">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Registrado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  hover
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>{user.registeredAt}</TableCell>
                  <TableCell align="center">
                    {user.status === "pending" ? (
                      <Tooltip title="Aprobar Usuario">
                        <IconButton color="success" disabled>
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Editar Usuario">
                          <IconButton color="primary" disabled>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar Usuario">
                          <IconButton color="error" disabled>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// --- Componente Envoltorio de Protección ---
function ProtectedAdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado o no es admin, redirige
    if (!user || !isAdmin) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  // Muestra un loader mientras se verifica o redirige
  if (!user || !isAdmin) {
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

  // Si es admin, muestra el dashboard
  return <AdminDashboardContent />;
}

export default ProtectedAdminPage;
