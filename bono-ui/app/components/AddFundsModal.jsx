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
} from "@mui/material";

export default function AddFundsModal({ open, onClose, onAddFunds }) {
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
      <DialogTitle sx={{ fontWeight: "bold" }}>Add Funds</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter the amount you would like to deposit into your account.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Amount (MXN)"
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
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Deposit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
