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
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

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
          <ResponsiveContainer width="100%" height="100%">
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

// ---------------- MOCK DATA ----------------
const kpiData = {
  portfolioValue: 52345.67,
};

const portfolioHistory = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 46500 },
  { name: "Mar", value: 47200 },
  { name: "Apr", value: 48500 },
  { name: "May", value: 50100 },
  { name: "Jun", value: 52345 },
];

// ---------------- CARD STYLE ----------------
const dashboardCardStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
  boxShadow: 2,
  transition: "0.2s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 5,
  },
};

// ---------------- DASHBOARD CONTENT ----------------
function DashboardContent({ user }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          pt: 5,
          pb: 4,

          px: {
            xs: 2,
            sm: 3,
            md: 6,
            lg: 8,
          },
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Dashboard
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}. Track your investments and portfolio
            performance.
          </Typography>
        </Box>

        {/* ACTION CARDS */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={dashboardCardStyle}>
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                  }}
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
            <Card sx={dashboardCardStyle}>
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                  }}
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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Portfolio Summary
          </Typography>

          <Typography color="text.secondary">
            Overview of your current portfolio performance.
          </Typography>
        </Box>

        {/* CHART */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: 320,
              borderRadius: 4,
              boxShadow: 2,
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
              <BarChartComponent data={portfolioHistory} />
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

  return <DashboardContent user={user} />;
}

export default ProtectedDashboardPage;
