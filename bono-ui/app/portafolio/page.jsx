"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  TextField,
  Grid,
  Alert,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import NextLink from "next/link";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InsightsIcon from "@mui/icons-material/Insights";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAuth } from "../context/AuthContext";
import SellCeteModal from "../components/SellCeteModal";

export default function PortfolioPage() {
  const { user, makeDeposit, authFetch, loading: authLoading } = useAuth();

  const [portfolio, setPortfolio] = useState({
    cashBalance: 0,
    cetesBalance: 0,
    bondsBalance: 0,
    total: 0,
  });
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
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

      // 1. Fetch Portfolio summary
      const portRes = await authFetch(`/portafolio/user/${user.id}`);
      if (!portRes.ok) throw new Error("Could not retrieve portfolio data");
      const portData = await portRes.json();

      setPortfolio({
        cashBalance: portData.cashBalance,
        cetesBalance: portData.cetesBalance,
        bondsBalance: portData.bondsBalance,
        total: portData.totalBalance,
      });

      // 2. Fetch Active Holdings & Transactions in parallel
      const [cetesRes, transRes] = await Promise.all([
        authFetch(`/cetes/portafolio/${user.id}`),
        authFetch(`/portafolio/transacciones/${user.id}`),
      ]);

      if (cetesRes.ok) setInvestments(await cetesRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (err) {
      console.error("Error loading portfolio:", err);
      setError("Connection error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  useEffect(() => {
    if (!authLoading && user) {
      loadAllData();
    }
  }, [user, authLoading, loadAllData]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await makeDeposit(user.id, amount);
      await loadAllData();
      setIsDepositModalOpen(false);
      setDepositAmount("");
      setSuccessMessage(`Deposit of ${fmt(amount)} completed!`);
    } catch (err) {
      setError("Could not process deposit.");
    }
  };

  const handleOpenSellModal = (id) => {
    setSelectedCeteId(id);
    setSellModalOpen(true);
  };

  const handleConfirmSell = async (id, includeBonddia) => {
    try {
      const res = await authFetch(
        `/cetes/vender/${id}?includeBonddia=${includeBonddia}`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        setSellModalOpen(false);
        setSuccessMessage("Asset sold successfully!");
        await loadAllData();
      } else {
        const errData = await res.json();
        setError(errData.message || "Error processing sale.");
      }
    } catch (err) {
      setError("An unexpected error occurred during the sale.");
    }
  };

  const getDisplayType = (tipo) => {
    const types = {
      DEPOSITO: "Deposit",
      RETIRO: "Withdrawal",
      COMPRA: "Purchase",
      VENTA: "Sale",
    };
    return types[tipo] || tipo;
  };

  const getChipColor = (tipo) => {
    switch (tipo) {
      case "DEPOSITO":
        return "success";
      case "RETIRO":
        return "error";
      case "COMPRA":
        return "info";
      case "VENTA":
        return "warning";
      default:
        return "default";
    }
  };

  if (authLoading || (loading && investments.length === 0)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
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
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              MY PORTFOLIO
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your investments and cash flow
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            component={NextLink}
            href="/cetes"
            variant="outlined"
            startIcon={<TrendingUpIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#003366",
              color: "#003366",
            }}
          >
            Buy CETES
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDepositModalOpen(true)}
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#003366",
              "&:hover": { bgcolor: "#002244" },
            }}
          >
            Add Funds
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
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
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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
        <Grid item xs={12} md={2}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 2,
              bgcolor: "#f8fafc",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <InsightsIcon fontSize="small" sx={{ color: "#16a34a" }} />
              <Typography variant="overline" sx={{ fontWeight: 700 }}>
                Bonddia
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontFamily: "monospace" }}
            >
              {fmt(portfolio.bondsBalance)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={2}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 2,
              bgcolor: "#f8fafc",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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
              color: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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

      {/* ACTIVE HOLDINGS TABLE */}
      <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 2, mb: 4 }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ReceiptLongIcon color="action" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            My Active Holdings
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ASSET</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TERM</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>RATE</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>INVESTED</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MATURITY</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No active holdings yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                investments.map((cete) => (
                  <TableRow key={cete.id} hover>
                    <TableCell>
                      <Chip
                        label="CETE"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{cete.plazo} Days</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                      {cete.tasaCompra}%
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontWeight: 700 }}
                    >
                      {fmt(cete.montoInvertido)}
                    </TableCell>
                    <TableCell>
                      {new Date(cete.fechaVencimiento).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenSellModal(cete.id)}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* RECENT HISTORY TABLE */}
      <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 2 }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <HistoryIcon color="action" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recent History
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, pr: 3 }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ py: 3, color: "text.secondary" }}
                  >
                    No transactions recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.slice(0, 8).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell
                      sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                    >
                      {new Date(t.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getDisplayType(t.tipo)}
                        size="small"
                        color={getChipColor(t.tipo)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color:
                          t.tipo === "DEPOSITO" || t.tipo === "VENTA"
                            ? "success.main"
                            : "text.primary",
                        pr: 3,
                      }}
                    >
                      {t.tipo === "DEPOSITO" || t.tipo === "VENTA" ? "+" : "-"}{" "}
                      {fmt(t.monto)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* MODALS & NOTIFICATIONS */}
      <SellCeteModal
        open={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onConfirm={handleConfirmSell}
        ceteId={selectedCeteId}
        authFetch={authFetch}
      />

      <Dialog
        open={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Funds</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The amount will be added to your available cash balance.
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label="Amount (MXN)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            InputProps={{ sx: { borderRadius: 3, fontFamily: "monospace" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsDepositModalOpen(false)}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeposit}
            sx={{
              borderRadius: 3,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#003366",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
