"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function SellBonoModal({ open, onClose, onConfirm, bonoId }) {
  const { authFetch } = useAuth();
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
      const res = await authFetch(`/bonos-activos/estimar-venta/${bonoId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEstimation(data);
    } catch {
      setEstimation(null);
    } finally {
      setLoading(false);
    }
  }, [bonoId, authFetch]);

  useEffect(() => {
    if (open && bonoId) {
      loadEstimation();
    } else {
      setEstimation(null);
    }
  }, [open, bonoId, loadEstimation]);

  const totalValue = estimation?.estimatedSaleAmount || 0;
  const profit = estimation?.estimatedProfit || 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>Confirmar venta</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : estimation ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Estas por vender esta inversion. Revisa el desglose estimado
              antes de confirmar la operacion.
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 3, mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography>Inversion original</Typography>
                <Typography sx={{ fontWeight: 850 }}>{fmt(totalValue - profit)}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography color="success.main">Interes devengado</Typography>
                <Typography color="success.main" sx={{ fontWeight: 900 }}>
                  {fmt(profit)}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="h6">Total a recibir</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 950 }}>
                  {fmt(totalValue)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Typography color="error">No se pudo cargar la estimacion.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={() => onConfirm(bonoId)}
          variant="contained"
          color="error"
          disabled={loading || !estimation}
          sx={{ borderRadius: "12px" }}
        >
          Confirmar venta
        </Button>
      </DialogActions>
    </Dialog>
  );
}
