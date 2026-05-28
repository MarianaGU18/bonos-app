"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

export default function AddFundsModal({ open, onClose, onAddFunds, loading = false }) {
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (val > 0) {
      onAddFunds(val);
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <AccountBalanceWalletOutlinedIcon sx={{ color: "#7FB3D5" }} />
          <span>Agregar fondos</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Indica el monto que quieres depositar en tu cuenta.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Monto (MXN)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={loading || !amount || parseFloat(amount) <= 0}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          Depositar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

