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
  Stack,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InsightsIcon from "@mui/icons-material/Insights";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";

// ---------------- DYNAMIC CHART ----------------
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
          <ResponsiveContainer width="99%" height={220}>
            <BarChart
              data={props.data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />

              <Tooltip
                formatter={(value) => `$${value.toLocaleString("es-MX")}`}
              />

              <Bar
                dataKey="value"
                name="Portfolio Value"
                fill="#1976d2"
                radius={[8, 8, 0, 0]}
              />
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

// ---------------- CARD STYLE ----------------
const dashboardCardStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  boxShadow: 2,
  transition: "0.2s ease",
  bgcolor: "#f8fafc",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 5,
    //borderColor: "#8b1fac",
  },
};

// ---------------- DASHBOARD CONTENT ----------------
function DashboardContent({ user, isAuthenticated }) {
  const { authFetch } = useAuth();
  const [portfolio, setPortfolio] = useState({
    cashBalance: 0,
    cetesBalance: 0,
    total: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [portfolioError, setPortfolioError] = useState(null);

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  const loadPortfolioData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingPortfolio(true);
      setPortfolioError(null);
      const portRes = await authFetch(`/portafolio/user/${user.id}`);
      if (!portRes.ok) throw new Error("Could not retrieve portfolio data");
      const portData = await portRes.json();

      const currentPortfolio = {
        cashBalance: portData.cashBalance,
        cetesBalance: portData.cetesBalance,
        total: portData.totalBalance,
      };

      setPortfolio(currentPortfolio);

      // Build real chart data from transaction history
      const transRes = await authFetch(`/portafolio/transacciones/${user.id}`);
      if (transRes.ok) {
        const transactions = await transRes.json();
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const now = new Date();
        const history = [];

        let runningTotal = currentPortfolio.total;
        const sortedTrans = [...transactions].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        let transIdx = 0;

        for (let i = 0; i < 6; i++) {
          const targetMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1,
          );
          const monthLabel = months[targetMonthStart.getMonth()];

          history.unshift({
            name: monthLabel,
            value: Number(Math.max(0, runningTotal).toFixed(2)),
          });

          // Reverse-calculate balance by subtracting transactions from the current month
          while (transIdx < sortedTrans.length) {
            const transDate = new Date(sortedTrans[transIdx].createdAt);
            if (transDate >= targetMonthStart) {
              const amount = sortedTrans[transIdx].monto;
              const type = sortedTrans[transIdx].tipo;
              // If it was an inflow (deposit/sale), subtract it. If outflow (purchase/withdrawal), add it back.
              if (type === "DEPOSITO" || type === "VENTA") {
                runningTotal -= amount;
              } else {
                runningTotal += amount;
              }
              transIdx++;
            } else {
              break;
            }
          }
        }
        setChartData(history);
      }
    } catch (error) {
      console.error("Error loading portfolio data for dashboard:", error);
      setPortfolioError("Failed to load portfolio summary.");
    } finally {
      setLoadingPortfolio(false);
    }
  }, [user?.id, authFetch]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioData();
    }
  }, [isAuthenticated, loadPortfolioData]);

  if (loadingPortfolio) {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pt: 5,
          pb: 4,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <InsightsIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#0f172a" }}
              >
                DASHBOARD
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user?.name}. Track your performance.
              </Typography>
            </Box>
          </Stack>
          <Link href="/perfil" passHref>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#003366",
                color: "#003366",
                px: 3,
                "&:hover": {
                  borderColor: "#002244",
                  bgcolor: "rgba(0,51,102,0.04)",
                },
              }}
            >
              View Profile
            </Button>
          </Link>
        </Box>

        {/* ACTION CARDS */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6} lg={4}>
            {/* 🔵 AZUL: Grid Item (Acción) sx={{ border: "3px solid #3b82f6" }}*/}
            <Card sx={dashboardCardStyle}>
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                >
                  CETES Valuation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculate CETES prices using Banxico exchange rates and
                  financial market data.
                </Typography>
              </CardContent>

              <Box sx={{ p: 3, pt: 0 }}>
                <Link href="/cetes" passHref>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Open Calculator
                  </Button>
                </Link>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* 🔵 AZUL: Grid Item (Próximamente) sx={{ border: "3px solid #3b82f6" }}*/}
            <Card sx={dashboardCardStyle}>
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                >
                  Bonds Valuation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Soon: Bond M, Udibonos, Bondes and more fixed income products.
                </Typography>
              </CardContent>

              <Box sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  disabled
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Coming Soon
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 5 }} />

        {/* SUMMARY */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <TrendingUpIcon color="action" />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Portfolio Summary
          </Typography>
        </Box>

        {portfolioError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {portfolioError}
          </Alert>
        )}

        {/* SUMMARY CARDS */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 2,
                bgcolor: "#f8fafc",
                border: "2px solid #1976d2",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AccountBalanceWalletIcon fontSize="small" color="primary" />
                <Typography variant="overline" sx={{ fontWeight: 700 }}>
                  Available Cash
                </Typography>
              </Stack>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {fmt(portfolio.cashBalance)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 2,
                bgcolor: "#f8fafc",
                border: "2px solid #10b981",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUpIcon fontSize="small" color="secondary" />
                <Typography variant="overline" sx={{ fontWeight: 700 }}>
                  Invested in CETES
                </Typography>
              </Stack>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {fmt(portfolio.cetesBalance)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 2,
                bgcolor: "#0f172a",
                border: "2px solid #8b5cf6",
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 700, opacity: 0.8, display: "block", mb: 1 }}
              >
                Total Portfolio Value
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {fmt(portfolio.total)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* CHART */}
        <Grid item xs={12} md={8}>
          {/* 🔵 AZUL: Grid Item del Gráfico sx={{ border: "3px solid #3b82f6" }}*/}
          <Paper
            sx={{
              p: 3,
              height: 320,
              borderRadius: 4,
              boxShadow: 2,
              border: "2px solid #1976d2",
              bgcolor: "#f8fafc",
              transition: "0.2s ease",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Portfolio Performance
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Last 6 months
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ height: 220 }}>
              <BarChartComponent data={chartData} />
            </Box>
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
}

// ---------------- PROTECTED WRAPPER ----------------
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
          height: "100vh",
          bgcolor: "grey.100",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <DashboardContent user={user} isAuthenticated={isAuthenticated} />;
}

export default ProtectedDashboardPage;
