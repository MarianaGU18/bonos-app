"use client";

import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Alert,
  Icon,
  Paper,
  Divider,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SavingsIcon from "@mui/icons-material/Savings";

import { StyledTextField, PrimaryButton } from "../components/FormComponents";

export default function CetesPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    plazo: 28,
    monto: 1000,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔐 Validate session
  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/cetes/calcular?monto=1000&dias=28",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (res.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    validateSession();
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/cetes/calcular?monto=${formData.monto}&dias=${formData.plazo}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");

          throw new Error("Session expired. Please log in again.");
        }

        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();

      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 💰 Currency formatter
  const fmt = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Icon
          component={SavingsIcon}
          sx={{
            fontSize: 42,
            mr: 2,
            color: "primary.main",
          }}
        />

        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 800,
            }}
          >
            CETES Valuation
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Simulate your government bond investment returns
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* FORM */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "secondary.main",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                mb: 3,
              }}
            >
              Investment Parameters
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <StyledTextField
                label="Investment Amount ($)"
                name="monto"
                type="number"
                value={formData.monto}
                onChange={handleChange}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Investment Term</InputLabel>

                <Select
                  name="plazo"
                  value={formData.plazo}
                  label="Investment Term"
                  onChange={handleChange}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "background.paper",
                  }}
                >
                  <MenuItem value={28}>1 Month (28 days)</MenuItem>
                  <MenuItem value={91}>3 Months (91 days)</MenuItem>
                  <MenuItem value={182}>6 Months (182 days)</MenuItem>
                  <MenuItem value={364}>1 Year (364 days)</MenuItem>
                </Select>
              </FormControl>

              <PrimaryButton
                type="submit"
                disabled={loading}
                sx={{
                  mt: 4,
                  backgroundColor: "primary.main",

                  "&:hover": {
                    backgroundColor: "#082C44",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "CALCULATE RETURNS"
                )}
              </PrimaryButton>
            </Box>
          </Paper>
        </Grid>

        {/* RESULTS */}
        <Grid item xs={12} md={7}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "secondary.main",
              }}
            >
              {/* TITLE */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                  }}
                >
                  Investment Summary
                </Typography>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: "accent.main",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  CETES {result.plazo}
                </Box>
              </Box>

              <Grid container spacing={4}>
                {/* LEFT */}
                <Grid item xs={12} md={6}>
                  <Typography fontWeight={700} color="primary.main">
                    Invested Amount
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {fmt(result.montoInvertido)}
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    CETES Investment
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {fmt(result.inversionCetes)}
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    Gross Interest
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {fmt(result.interesBrutoCetes)}
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    Remaining Balance
                  </Typography>

                  <Typography>{fmt(result.remanente)}</Typography>
                </Grid>

                {/* RIGHT */}
                <Grid item xs={12} md={6}>
                  <Typography fontWeight={700} color="primary.main">
                    CETES Bonds
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {result.titulosCetes} bonds
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    BONDDIA Bonds
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {result.titulosBonddia} bonds
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    BONDDIA Interest
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    {fmt(result.interesBonddia)}
                  </Typography>

                  <Typography fontWeight={700} color="primary.main">
                    Tax Withholding (ISR)
                  </Typography>

                  <Typography>{fmt(result.isr)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* FINAL */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "primary.main",
                    fontWeight: 800,
                  }}
                >
                  Final Amount
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: "accent.main",
                    fontWeight: 800,
                  }}
                >
                  {fmt(result.totalFinal)}
                </Typography>
              </Box>
            </Paper>
          )}

          {!result && !loading && !error && (
            <Alert
              severity="info"
              sx={{
                borderRadius: 3,
              }}
            >
              Enter an investment amount and select a term to simulate your
              CETES investment performance.
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
