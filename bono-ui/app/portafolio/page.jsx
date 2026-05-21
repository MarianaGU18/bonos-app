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

/* ----------------- UI PRIMITIVE ----------------- */
const AppCard = ({ children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={(theme) => ({
      p: 3,
      borderRadius: 4,
      bgcolor: "background.paper",
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
      transition: "0.2s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
      },
      ...sx,
    })}
  >
    {children}
  </Paper>
);

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

  /* ----------------- DATA ----------------- */
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
        bondsBalance: portData.bondsBalance,
        total: portData.totalBalance,
      });

      const [cetesRes, transRes] = await Promise.all([
        authFetch(`/cetes/portafolio/${user.id}`),
        authFetch(`/portafolio/transacciones/${user.id}`),
      ]);

      if (cetesRes.ok) setInvestments(await cetesRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, authFetch]);

  useEffect(() => {
    if (!authLoading && user) loadAllData();
  }, [user, authLoading, loadAllData]);

  /* ----------------- ACTIONS ----------------- */
  const handleDeposit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    try {
      await makeDeposit(user.id, amount);
      await loadAllData();

      setIsDepositModalOpen(false);
      setDepositAmount("");
      setSuccessMessage(`Deposit completed: ${fmt(amount)}`);
    } catch {
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
        { method: "POST" },
      );

      if (!res.ok) throw new Error();

      setSellModalOpen(false);
      setSuccessMessage("Asset sold successfully!");
      await loadAllData();
    } catch {
      setError("Sale failed.");
    }
  };

  /* ----------------- LOADING ----------------- */
  if (authLoading || (loading && investments.length === 0)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ----------------- UI ----------------- */
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Stack direction="row" spacing={2}>
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              My Portfolio
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
          >
            Buy CETES
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDepositModalOpen(true)}
          >
            Add Funds
          </Button>
        </Stack>
      </Box>

      {/* ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* SUMMARY */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <AppCard>
            <Typography variant="overline">Available Cash</Typography>
            <Typography variant="h4">{fmt(portfolio.cashBalance)}</Typography>
          </AppCard>
        </Grid>

        <Grid item xs={12} md={2}>
          <AppCard>
            <Typography variant="overline">Bonddia</Typography>
            <Typography variant="h5">{fmt(portfolio.bondsBalance)}</Typography>
          </AppCard>
        </Grid>

        <Grid item xs={12} md={2}>
          <AppCard>
            <Typography variant="overline">CETES</Typography>
            <Typography variant="h4">{fmt(portfolio.cetesBalance)}</Typography>
          </AppCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AppCard sx={{ bgcolor: "primary.main", color: "white" }}>
            <Typography variant="overline">Total</Typography>
            <Typography variant="h4">{fmt(portfolio.total)}</Typography>
          </AppCard>
        </Grid>
      </Grid>

      {/* TABLE: INVESTMENTS */}
      <AppCard sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} mb={2}>
          <ReceiptLongIcon />
          <Typography variant="h6">Active Holdings</Typography>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {investments.map((cete) => (
                <TableRow key={cete.id}>
                  <TableCell>
                    <Chip label="CETE" color="primary" size="small" />
                  </TableCell>

                  <TableCell>{cete.plazo} days</TableCell>
                  <TableCell>{cete.tasaCompra}%</TableCell>

                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {fmt(cete.montoInvertido)}
                  </TableCell>

                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleOpenSellModal(cete.id)}
                    >
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AppCard>

      {/* HISTORY */}
      <AppCard>
        <Stack direction="row" spacing={1} mb={2}>
          <HistoryIcon />
          <Typography variant="h6">Recent History</Typography>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.slice(0, 8).map((t) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={t.tipo} size="small" />
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                  {fmt(t.monto)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppCard>

      {/* MODALS */}
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
      >
        <DialogTitle>Add Funds</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDepositModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeposit} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Container>
  );
}
