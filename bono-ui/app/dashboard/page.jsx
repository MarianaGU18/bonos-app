"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useAuth } from "../context/AuthContext";

const chartColors = {
  cash: "#1D4E89",
  cetes: "#7FB3D5",
  bonds: "#7FB3D5",
  yield: "#7C5CFC",
  grid: "rgba(16,24,32,0.08)",
  text: "#1F2937",
};

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

      return function ChartWrapper({ data }) {
        return (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={data}
              margin={{ top: 12, right: 10, left: -12, bottom: 0 }}
              barCategoryGap="28%"
            >
              <defs>
                <linearGradient id="portfolioBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7FB3D5" stopOpacity={0.98} />
                  <stop offset="100%" stopColor="#1D4E89" stopOpacity={0.88} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke={chartColors.grid}
                strokeDasharray="4 6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 12, fontWeight: 700 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 12 }}
                width={64}
                tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              />
              <Tooltip
                cursor={{ fill: "rgba(127,179,213,0.08)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #D8E3EC",
                  boxShadow: "0 18px 38px rgba(11,31,58,0.12)",
                }}
                formatter={(value) => [
                  `$${Number(value).toLocaleString("es-MX")}`,
                  "Valor",
                ]}
              />
              <Bar
                dataKey="value"
                name="Valor de cartera"
                fill="url(#portfolioBar)"
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
      <Box sx={{ display: "grid", placeItems: "center", height: 290 }}>
        <CircularProgress />
      </Box>
    ),
  },
);

const DonutChartComponent = dynamic(
  () =>
    import("recharts").then((mod) => {
      const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;

      return function DonutWrapper({ data }) {
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={105}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #D8E3EC",
                  boxShadow: "0 18px 38px rgba(11,31,58,0.12)",
                }}
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString("es-MX")}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: "grid", placeItems: "center", height: 250 }}>
        <CircularProgress />
      </Box>
    ),
  },
);

function MetricCard({ icon, label, value, helper, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <Paper
      sx={{
        p: 2.5,
        minHeight: 156,
        bgcolor: dark ? "#0B1F3A" : "#FFFFFF",
        color: dark ? "#fff" : "#1F2937",
        borderRadius: "18px",
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #D8E3EC",
        boxShadow: dark
          ? "0 24px 58px rgba(16,24,32,0.18)"
          : "0 14px 34px rgba(16,24,32,0.06)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            display: "grid",
            placeItems: "center",
            bgcolor: dark ? "rgba(255,255,255,0.08)" : "rgba(127,179,213,0.10)",
            color: dark ? "#EEF3F8" : "#7FB3D5",
          }}
        >
          {icon}
        </Box>
        <Chip
          label={helper}
          size="small"
          sx={{
            bgcolor: dark ? "rgba(127,179,213,0.16)" : "#EEF3F8",
            color: dark ? "#EEF3F8" : "#1F2937",
          }}
        />
      </Stack>
      <Typography
        sx={{
          mt: 2.4,
          color: dark ? "rgba(255,255,255,0.58)" : "#1F2937",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.8,
          fontSize: { xs: 27, md: 31 },
          lineHeight: 1,
          fontWeight: 950,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function DashboardContent({ user, isAuthenticated }) {
  const { authFetch } = useAuth();
  const [portfolio, setPortfolio] = useState({
    cashBalance: 0,
    cetesBalance: 0,
    bondsBalance: 0,
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
        bondsBalance: portData.bondsBalance || 0,
        total: portData.totalBalance,
      };

      setPortfolio(currentPortfolio);

      const transRes = await authFetch(`/portafolio/transacciones/${user.id}`);
      if (transRes.ok) {
        const transactions = await transRes.json();
        const months = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
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

          while (transIdx < sortedTrans.length) {
            const transDate = new Date(sortedTrans[transIdx].createdAt);
            if (transDate >= targetMonthStart) {
              const amount = sortedTrans[transIdx].monto;
              const type = sortedTrans[transIdx].tipo;
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
      setPortfolioError("No se pudo cargar el resumen del portafolio.");
    } finally {
      setLoadingPortfolio(false);
    }
  }, [user?.id, authFetch]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioData();
    }
  }, [isAuthenticated, loadPortfolioData]);

  const allocationData = useMemo(() => {
    const items = [
      {
        name: "Efectivo",
        value: Number(portfolio.cashBalance || 0),
        color: chartColors.cash,
      },
      {
        name: "CETES",
        value: Number(portfolio.cetesBalance || 0),
        color: chartColors.cetes,
      },
      { name: "Bonos", value: Number(portfolio.bondsBalance || 0), color: chartColors.bonds },
      { name: "Rendimiento", value: 0, color: chartColors.yield },
    ].filter((item) => item.value > 0);

    return items.length
      ? items
      : [{ name: "Sin capital", value: 1, color: "#D8E3EC" }];
  }, [portfolio.cashBalance, portfolio.cetesBalance]);

  const activeRatio =
    portfolio.total > 0
      ? Math.round((portfolio.cetesBalance / portfolio.total) * 100)
      : 0;
  const bondsRatio =
    portfolio.total > 0
      ? Math.round((portfolio.bondsBalance / portfolio.total) * 100)
      : 0;
  const liquidityRatio =
    portfolio.total > 0
      ? Math.round((portfolio.cashBalance / portfolio.total) * 100)
      : 0;

  if (loadingPortfolio) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 9% 8%, rgba(127,179,213,0.12), transparent 25%),
          radial-gradient(circle at 86% 6%, rgba(29,78,137,0.10), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 44%, #EEF3F8 100%)
        `,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: "20px",
            color: "#fff",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: `
              radial-gradient(circle at 83% 10%, rgba(127,179,213,0.26), transparent 28%),
              linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
            `,
            boxShadow: "0 30px 76px rgba(16,24,32,0.18)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Chip
                label="Dashboard financiero"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(127,179,213,0.16)",
                  color: "#EEF3F8",
                  border: "1px solid rgba(127,179,213,0.28)",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 38, md: 54 },
                  lineHeight: 1,
                  fontWeight: 950,
                }}
              >
                Hola, {user?.name}.
              </Typography>
              <Typography
                sx={{
                  mt: 1.6,
                  maxWidth: 680,
                  color: "rgba(255,255,255,0.66)",
                  fontSize: 17,
                }}
              >
                Tu posicion, liquidez y rendimiento se organizan para decidir
                rapido sin perder control.
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems={{ sm: "center" }}
            >
              <Button
                component={Link}
                href="/perfil"
                variant="outlined"
                startIcon={<PersonOutlineOutlinedIcon />}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.28)" }}
              >
                Perfil
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {portfolioError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {portfolioError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <MetricCard
            icon={<AccountBalanceWalletOutlinedIcon />}
            label="Efectivo disponible"
            value={fmt(portfolio.cashBalance)}
            helper={`${liquidityRatio}% liquido`}
          />
          <MetricCard
            icon={<SavingsOutlinedIcon />}
            label="Invertido en CETES"
            value={fmt(portfolio.cetesBalance)}
            helper={`${activeRatio}% activo`}
          />
          <MetricCard
            icon={<AccountBalanceOutlinedIcon />}
            label="Invertido en Bonos"
            value={fmt(portfolio.bondsBalance)}
            helper={`${bondsRatio}% activo`}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.55fr 0.95fr" },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Paper
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "18px",
              bgcolor: "rgba(255,255,255,0.92)",
              boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InsightsOutlinedIcon sx={{ color: "#7FB3D5" }} />
                  <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                    Evolucion del portafolio
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 0.7, color: "#1F2937", fontSize: 14 }}>
                  Ultimos 6 meses calculados desde movimientos registrados.
                </Typography>
              </Box>
              <Chip
                label="Valor mensual"
                sx={{ alignSelf: "flex-start", bgcolor: "#EEF3F8" }}
              />
            </Stack>
            <BarChartComponent data={chartData} />
          </Paper>

          <Paper
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "18px",
              bgcolor: "rgba(255,255,255,0.92)",
              boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <DonutLargeOutlinedIcon sx={{ color: "#1D4E89" }} />
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                Distribucion
              </Typography>
            </Stack>
            <Typography sx={{ color: "#1F2937", fontSize: 14 }}>
              Porcentaje del dinero por tipo de posicion.
            </Typography>

            <Box sx={{ position: "relative", mt: 1 }}>
              <DonutChartComponent data={allocationData} />
              <Box
                sx={{
                  position: "absolute",
                  inset: "72px 0 auto 0",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography
                  sx={{ color: "#1F2937", fontSize: 12, fontWeight: 800 }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{ color: "#1F2937", fontSize: 23, fontWeight: 950 }}
                >
                  {fmt(portfolio.total)}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.2}>
              {allocationData.map((item) => {
                const percent =
                  portfolio.total > 0
                    ? Math.round((item.value / portfolio.total) * 100)
                    : 0;
                return (
                  <Stack
                    key={item.name}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: item.color,
                        }}
                      />
                      <Typography sx={{ color: "#1F2937", fontWeight: 800 }}>
                        {item.name}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#1F2937", fontWeight: 800 }}>
                      {percent}%
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {[
            {
              icon: <AutoGraphOutlinedIcon />,
              title: "Valuacion CETES",
              body: "Calcula precios, plazo, tasa y remanente antes de operar.",
              href: "/cetes",
              action: "Abrir calculadora",
            },
            {
              icon: <AccountBalanceOutlinedIcon />,
              title: "Valuacion Bonos",
              body: "Calcula precio teórico, rendimiento y cupones antes de invertir.",
              href: "/bonos",
              action: "Abrir calculadora",
            },
            {
              icon: <ShieldOutlinedIcon />,
              title: "Cartera y movimientos",
              body: "Revisa posiciones activas, efectivo y actividad reciente.",
              href: "/portafolio",
              action: "Ver cartera",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              sx={{
                p: 2.5,
                borderRadius: "18px",
                bgcolor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(127,179,213,0.10)",
                    color: "#7FB3D5",
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900 }}>{item.title}</Typography>
                  <Typography sx={{ mt: 0.4, color: "#1F2937", fontSize: 14 }}>
                    {item.body}
                  </Typography>
                </Box>
              </Stack>
              <Button
                component={Link}
                href={item.href}
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                {item.action}
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

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
          display: "grid",
          placeItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <DashboardContent user={user} isAuthenticated={isAuthenticated} />;
}

export default ProtectedDashboardPage;
