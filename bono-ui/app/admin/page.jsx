"use client";

//import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute role="ADMIN">
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Panel de Administración
        </Typography>

        <Grid container spacing={3}>
          {/* Usuarios */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Usuarios</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestionar usuarios del sistema
                </Typography>

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => router.push("/admin/users")}
                >
                  Ver usuarios
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Bonos */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Bonos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Crear y administrar CETES
                </Typography>

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => router.push("/admin/bonos")}
                >
                  Crear bono
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Transacciones */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Transacciones</Typography>
                <Typography variant="body2" color="text.secondary">
                  Historial de compras y ventas
                </Typography>

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => router.push("/admin/transacciones")}
                >
                  Ver transacciones
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}
