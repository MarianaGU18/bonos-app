"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

// ======================================================================
// COMPONENT: AddFundsModal
// ======================================================================

export default function AddFundsModal({ open, onClose, onAddFunds }) {
  const [amount, setAmount] = React.useState("");

  const handleAdd = () => {
    // We'll add validation and the actual API call here later.
    onAddFunds(amount);
    handleClose();
  };

  const handleClose = () => {
    setAmount(""); // Reset amount on close
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Funds to Your Account</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please enter the amount you would like to add. The funds will be
          available in your account immediately after processing.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="amount"
          label="Amount (USD)"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            startAdornment: <span style={{ marginRight: "5px" }}>$</span>,
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAdd} variant="contained">
          Add Funds
        </Button>
      </DialogActions>
    </Dialog>
  );
}
