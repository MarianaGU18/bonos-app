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
  Button,
  Container,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// --- Importación dinámica para el gráfico ---
const BarChartComponent = dynamic(
  () =>
    import("recharts").then((mod) => {
      const {
        BarChart,
        Bar,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
      } = mod;

      return function ChartWrapper(props) {
        return (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={props.data}
              margin={{ top: 5, right: 20, left: -10, bottom: -5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString("es-MX")}`}
              />
              <Bar dataKey="value" name="Valor del Portafolio" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    ),
  },
);

// --- Mock Data (Datos de Ejemplo) ---
const kpiData = {
  portfolioValue: 52345.67,
};

const portfolioHistory = [
  { name: "Ene", value: 45000 },
  { name: "Feb", value: 46500 },
  { name: "Mar", value: 47200 },
  { name: "Abr", value: 48500 },
  { name: "May", value: 50100 },
  { name: "Jun", value: 52345 },
];

// --- Componente de Contenido del Dashboard ---
function DashboardContent({ user }) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        Select a stock or check the status of your portfolio.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                CETES Valuation
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Calculate the price using Banxico&apos;s actual exchage.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Link href="/cetes" passHref>
                <Button variant="contained" fullWidth>
                  GO
                </Button>
              </Link>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Valuar Bonos
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Próximamente: Bonos M, Udibonos, etc.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="contained" disabled fullWidth>
                Próximamente
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      {/* SECCIÓN DE RESUMEN VISUAL */}
      <Typography variant="h5" component="h2" gutterBottom>
        Portfolio Summary
      </Typography>
      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <CardContent>
              <Typography gutterBottom>Total Portfolio Value</Typography>
              <Typography variant="h4">
                ${kpiData.portfolioValue.toLocaleString("es-MX")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" mb={2}>
              Portfolio Performance (Last 6 Months)
            </Typography>
            <BarChartComponent data={portfolioHistory} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// --- Componente Envoltorio de Protección ---
function ProtectedDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

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

  return <DashboardContent user={user} />;
}

export default ProtectedDashboardPage;
