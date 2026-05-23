"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function SellCeteModal({ open, onClose, onConfirm, ceteId }) {
  const { estimateCeteSale } = useAuth();
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [includeBonddia, setIncludeBonddia] = useState(false);

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  const loadEstimation = useCallback(async () => {
    setLoading(true);
    try {
      const data = await estimateCeteSale(ceteId);
      console.log("Backend Estimate Response:", data);
      setEstimation(data);
    } catch (error) {
      console.error("Error loading estimation:", error);
    } finally {
      setLoading(false);
    }
  }, [ceteId, estimateCeteSale]);

  useEffect(() => {
    if (open && ceteId) {
      loadEstimation();
    } else {
      setEstimation(null);
      setIncludeBonddia(false);
    }
  }, [open, ceteId, loadEstimation]);

  const handleConfirm = () => {
    onConfirm(ceteId, includeBonddia);
  };

  const totalValue = estimation?.estimatedSaleAmount || 0;
  const profit = estimation?.estimatedProfit || 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Sale</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : estimation ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Are you sure you want to sell this CETE investment? Below is the
              breakdown of your estimated return:
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 3, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Original Investment:</Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {fmt(totalValue - profit)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="success.main">
                  Accrued Profit (+):
                </Typography>
                <Typography
                  variant="body1"
                  color="success.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {fmt(profit)}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total to Receive:</Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {fmt(totalValue)}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Checkbox
                  checked={includeBonddia}
                  onChange={(e) => setIncludeBonddia(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Include Bonddia liquidity in this sale
                </Typography>
              }
            />
          </Box>
        ) : (
          <Typography color="error">Could not load estimation data.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !estimation}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Confirm Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
}
