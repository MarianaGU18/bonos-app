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
    }
  }, [open, ceteId, loadEstimation]);

  const handleConfirm = () => {
    onConfirm(ceteId);
  };

  const totalValue = estimation?.estimatedSaleAmount || 0;
  const profit = estimation?.estimatedProfit || 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirmar Venta</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : estimation ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ¿Estás seguro de que deseas vender esta inversión? A continuación
              se muestra el desglose de tu rendimiento estimado:
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 3, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Inversión Original:</Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {fmt(totalValue - profit)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="success.main">
                  Interés Devengado (+):
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
                <Typography variant="h6">Total a Recibir:</Typography>
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
          </Box>
        ) : (
          <Typography color="error">
            No se pudo cargar la estimación.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !estimation}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Confirmar Venta
        </Button>
      </DialogActions>
    </Dialog>
  );
}
