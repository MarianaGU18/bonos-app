"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useAuth } from "../context/AuthContext";
import SellCeteModal from "../components/SellCeteModal";

const TRANSACTION_TYPE_LABELS = {
  DEPOSITO: "Deposito",
  RETIRO: "Retiro",
  COMPRA: "Compra",
  VENTA: "Venta",
};

function AppPanel({ children, sx = {} }) {
  return (
    <Paper
      sx={{
        p: { xs: 2.4, md: 3 },
        borderRadius: "18px",
        bgcolor: "rgba(255,255,255,0.92)",
        border: "1px solid #D8E3EC",
        boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

function SummaryCard({ label, value, helper, icon, dark = false }) {
  return (
    <AppPanel
      sx={{
        minHeight: 150,
        bgcolor: dark ? "#0B1F3A" : "#fff",
        color: dark ? "#fff" : "#1F2937",
        boxShadow: dark ? "0 24px 58px rgba(16,24,32,0.18)" : "0 14px 34px rgba(16,24,32,0.06)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
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
        <Typography sx={{ color: dark ? "rgba(255,255,255,0.56)" : "#1F2937", fontSize: 12, fontWeight: 800 }}>
          {helper}
        </Typography>
      </Stack>
      <Typography sx={{ mt: 2.2, color: dark ? "rgba(255,255,255,0.58)" : "#1F2937", fontSize: 13, fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.6, fontSize: { xs: 27, md: 31 }, fontWeight: 950, lineHeight: 1 }}>
        {value}
      </Typography>
    </AppPanel>
  );
}

export default function PortfolioPage() {
  const { user, makeDeposit, authFetch, loading: authLoading } = useAuth();

  const [portfolio, setPortfolio] = useState({
    cashBalance: 0,
    cetesBalance: 0,
    total: 0,
  });
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isConfirmingDeposit, setIsConfirmingDeposit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedCeteId, setSelectedCeteId] = useState(null);

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  const loadAllData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const portRes = await authFetch(`/portafolio/user/${user.id}`);
      if (!portRes.ok) throw new Error();

      const portData = await portRes.json();

      setPortfolio({
        cashBalance: portData.cashBalance,
        cetesBalance: portData.cetesBalance,
        total: portData.totalBalance,
      });

      const [cetesRes, transRes] = await Promise.all([
        authFetch(`/cetes/portafolio/${user.id}`),
        authFetch(`/portafolio/transacciones/${user.id}`),
      ]);

      if (cetesRes.ok) setInvestments(await cetesRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (err) {
      setError("No se pudo conectar con el portafolio. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  useEffect(() => {
    if (!authLoading && user) loadAllData();
  }, [user, authLoading, loadAllData]);

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
    setIsConfirmingDeposit(false);
    setDepositAmount("");
  };

  const handleDeposit = async (e) => {
    if (e) e.preventDefault();

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    try {
      await makeDeposit(user.id, amount);
      await loadAllData();

      handleCloseDepositModal();
      setSuccessMessage(`Deposito completado: ${fmt(amount)}`);
    } catch {
      setError("No se pudo procesar el deposito.");
    }
  };

  const handleOpenSellModal = (id) => {
    setSelectedCeteId(id);
    setSellModalOpen(true);
  };

  const handleConfirmSell = async (id) => {
    try {
      const res = await authFetch(`/cetes/vender/${id}`, { method: "POST" });

      if (!res.ok) throw new Error();

      setSellModalOpen(false);
      setSuccessMessage("Activo vendido correctamente.");
      await loadAllData();
    } catch {
      setError("No se pudo completar la venta.");
    }
  };

  const allocation = useMemo(() => {
    const total = Number(portfolio.total || 0);
    const cash = total > 0 ? Math.round((Number(portfolio.cashBalance || 0) / total) * 100) : 0;
    const cetes = total > 0 ? Math.round((Number(portfolio.cetesBalance || 0) / total) * 100) : 0;
    return { cash, cetes };
  }, [portfolio]);

  const avgRate = useMemo(() => {
    if (!investments.length) return 0;
    const totalRate = investments.reduce((sum, item) => sum + Number(item.tasaCompra || 0), 0);
    return (totalRate / investments.length).toFixed(2);
  }, [investments]);

  if (authLoading || (loading && investments.length === 0)) {
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
          radial-gradient(circle at 8% 8%, rgba(127,179,213,0.12), transparent 25%),
          radial-gradient(circle at 88% 7%, rgba(29,78,137,0.10), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 48%, #EEF3F8 100%)
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
            background: `
              radial-gradient(circle at 84% 10%, rgba(127,179,213,0.25), transparent 28%),
              linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
            `,
            boxShadow: "0 30px 76px rgba(16,24,32,0.18)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
            <Box>
              <Chip
                label="Cartera consolidada"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(127,179,213,0.16)",
                  color: "#EEF3F8",
                  border: "1px solid rgba(127,179,213,0.28)",
                }}
              />
              <Typography component="h1" sx={{ fontSize: { xs: 38, md: 56 }, lineHeight: 1, fontWeight: 950 }}>
                {fmt(portfolio.total)}
              </Typography>
              <Typography sx={{ mt: 1.4, maxWidth: 680, color: "rgba(255,255,255,0.66)", fontSize: 17 }}>
                Valor total distribuido entre efectivo disponible e instrumentos activos.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ sm: "center" }}>
              <Button
                component={NextLink}
                href="/cetes"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: "#fff", color: "#1F2937", "&:hover": { bgcolor: "#EEF3F8" } }}
              >
                Comprar CETES
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsDepositModalOpen(true)}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.28)" }}
              >
                Agregar fondos
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
          <SummaryCard
            icon={<AccountBalanceWalletOutlinedIcon />}
            label="Efectivo disponible"
            value={fmt(portfolio.cashBalance)}
            helper={`${allocation.cash}% liquido`}
          />
          <SummaryCard
            icon={<SavingsOutlinedIcon />}
            label="Invertido en CETES"
            value={fmt(portfolio.cetesBalance)}
            helper={`${allocation.cetes}% activo`}
          />
          <SummaryCard
            icon={<TrendingUpOutlinedIcon />}
            label="Tasa promedio"
            value={`${avgRate}%`}
            helper={`${investments.length} posiciones`}
            dark
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1.35fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <AppPanel>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Distribucion</Typography>
                <Typography sx={{ color: "#1F2937", fontSize: 14 }}>Estructura actual del dinero.</Typography>
              </Box>
              <Chip label="MXN" sx={{ bgcolor: "#EEF3F8" }} />
            </Stack>
            <Stack spacing={2.2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                  <Typography sx={{ fontWeight: 850 }}>CETES</Typography>
                  <Typography sx={{ color: "#1F2937", fontWeight: 850 }}>{allocation.cetes}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={allocation.cetes}
                  sx={{ height: 10, borderRadius: 999, bgcolor: "#EEF3F8", "& .MuiLinearProgress-bar": { bgcolor: "#7FB3D5" } }}
                />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                  <Typography sx={{ fontWeight: 850 }}>Efectivo</Typography>
                  <Typography sx={{ color: "#1F2937", fontWeight: 850 }}>{allocation.cash}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={allocation.cash}
                  sx={{ height: 10, borderRadius: 999, bgcolor: "#EEF3F8", "& .MuiLinearProgress-bar": { bgcolor: "#1D4E89" } }}
                />
              </Box>
            </Stack>
          </AppPanel>

          <AppPanel>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ReceiptLongOutlinedIcon sx={{ color: "#7FB3D5" }} />
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Activos principales</Typography>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 1.4,
              }}
            >
              {investments.length ? (
                investments.slice(0, 4).map((cete) => (
                  <Box
                    key={cete.id}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: "1px solid #D8E3EC",
                      bgcolor: "#EEF3F8",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip label="CETE" size="small" sx={{ bgcolor: "rgba(127,179,213,0.12)", color: "#0B1F3A" }} />
                      <Typography sx={{ color: "#1F2937", fontSize: 13 }}>{cete.plazo} dias</Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, fontSize: 24, lineHeight: 1, fontWeight: 950 }}>
                      {fmt(cete.montoInvertido)}
                    </Typography>
                    <Typography sx={{ mt: 0.8, color: "#1F2937", fontSize: 14 }}>
                      Tasa de compra {cete.tasaCompra}%
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "#1F2937" }}>Aun no hay inversiones activas.</Typography>
              )}
            </Box>
          </AppPanel>
        </Box>

        <AppPanel sx={{ mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptLongOutlinedIcon sx={{ color: "#7FB3D5" }} />
                <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Instrumentos activos</Typography>
              </Stack>
              <Typography sx={{ mt: 0.5, color: "#1F2937", fontSize: 14 }}>
                Posiciones disponibles para seguimiento o venta.
              </Typography>
            </Box>
          </Stack>

          <TableContainer sx={{ borderRadius: "14px", border: "1px solid #D8E3EC", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Instrumento</TableCell>
                  <TableCell>Plazo</TableCell>
                  <TableCell>Tasa</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="right">Accion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.length ? (
                  investments.map((cete) => (
                    <TableRow key={cete.id} hover>
                      <TableCell>
                        <Chip label="CETE" size="small" sx={{ bgcolor: "rgba(127,179,213,0.12)", color: "#0B1F3A" }} />
                      </TableCell>
                      <TableCell>{cete.plazo} dias</TableCell>
                      <TableCell>{cete.tasaCompra}%</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>
                        {fmt(cete.montoInvertido)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleOpenSellModal(cete.id)}
                        >
                          Vender
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography sx={{ color: "#1F2937", py: 2 }}>No hay instrumentos activos.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AppPanel>

        <AppPanel>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <HistoryOutlinedIcon sx={{ color: "#1D4E89" }} />
            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>Actividad reciente</Typography>
          </Stack>

          <TableContainer sx={{ borderRadius: "14px", border: "1px solid #D8E3EC", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length ? (
                  transactions.slice(0, 8).map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell>{new Date(t.createdAt).toLocaleString("es-MX")}</TableCell>
                      <TableCell>
                        <Chip label={TRANSACTION_TYPE_LABELS[t.tipo] || t.tipo} size="small" />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900 }}>
                        {fmt(t.monto)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography sx={{ color: "#1F2937", py: 2 }}>No hay movimientos recientes.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AppPanel>

        <SellCeteModal
          open={sellModalOpen}
          onClose={() => setSellModalOpen(false)}
          onConfirm={handleConfirmSell}
          ceteId={selectedCeteId}
        />

        <Dialog open={isDepositModalOpen} onClose={handleCloseDepositModal} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 900 }}>
            {isConfirmingDeposit ? "Confirmar deposito" : "Agregar fondos"}
          </DialogTitle>
          <DialogContent>
            {isConfirmingDeposit ? (
              <Typography sx={{ mt: 1, color: "#1F2937" }}>
                Confirma el deposito de <strong>{fmt(parseFloat(depositAmount))}</strong> a tu cuenta.
              </Typography>
            ) : (
              <TextField
                autoFocus
                fullWidth
                label="Monto"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDepositModal}>Cancelar</Button>
            {isConfirmingDeposit ? (
              <Button onClick={handleDeposit} variant="contained">
                Confirmar deposito
              </Button>
            ) : (
              <Button
                onClick={() => setIsConfirmingDeposit(true)}
                variant="contained"
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Continuar
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage("")}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}


