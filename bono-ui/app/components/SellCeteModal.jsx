"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";

export default function SellCeteModal({
  open,
  onClose,
  onConfirm,
  ceteId,
  authFetch,
}) {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellBonddia, setSellBonddia] = useState(false);

  useEffect(() => {
    if (open && ceteId) {
      const fetchEstimate = async () => {
        setLoading(true);
        try {
          const res = await authFetch(`/cetes/estimar-venta/${ceteId}`);
          if (res.ok) {
            const data = await res.json();
            setEstimate(data);
          }
        } catch (err) {
          console.error("Error fetching estimate", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEstimate();
    }
  }, [open, ceteId, authFetch]);

  const handleConfirm = () => {
    onConfirm(ceteId, sellBonddia);
    setSellBonddia(false); // Reset para la próxima vez
  };

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirmar Venta</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : estimate ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" gutterBottom>
              ¿Estás seguro de que deseas vender este activo?
            </Typography>
            <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2, my: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Obtendrás aproximadamente:
              </Typography>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ fontWeight: 800 }}
              >
                {fmt(estimate.expectedAmount)}
              </Typography>
              <Typography variant="caption" color="success.main">
                Ganancia devengada: {fmt(estimate.profit)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Checkbox
                  checked={sellBonddia}
                  onChange={(e) => setSellBonddia(e.target.checked)}
                />
              }
              label="¿Vender también el remanente de Bonddia?"
            />
          </Box>
        ) : (
          <Typography color="error">
            No se pudo cargar la estimación.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !estimate}
        >
          Confirmar Venta
        </Button>
      </DialogActions>
    </Dialog>
  );
}
