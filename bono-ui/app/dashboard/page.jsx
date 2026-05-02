"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute role="USER">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>

          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            Selecciona qué quieres evaluar
          </Typography>

          <Grid container spacing={3}>
            {/* CARD CETES */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Valuar CETES
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Calcula el precio con tasas reales de Banxico.
                  </Typography>

                  <Link href="/cetes" passHref>
                    <Button variant="contained">Ir</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD BONOS */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Valuar Bonos
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Próximamente: Bonos M, Udibonos, etc.
                  </Typography>

                  <Button variant="contained" disabled>
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
