"use client";

import { Box, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CetesCalculator from "../context/CetesCalculator";

export default function CetesPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 8% 8%, rgba(127,179,213,0.13), transparent 25%),
          radial-gradient(circle at 88% 9%, rgba(29,78,137,0.10), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 48%, #EEF3F8 100%)
        `,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Paper
          sx={{
            mb: 3,
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            color: "#fff",
            overflow: "hidden",
            background: `
              radial-gradient(circle at 84% 12%, rgba(127,179,213,0.25), transparent 28%),
              linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
            `,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 30px 76px rgba(16,24,32,0.18)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={3}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.4}
              alignItems={{ sm: "center" }}
            >
              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "16px",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "grid",
                  placeItems: "center",
                  color: "#EEF3F8",
                }}
              >
                <SavingsOutlinedIcon sx={{ fontSize: 34 }} />
              </Box>
              <Box>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 36, md: 52 },
                    lineHeight: 1,
                    fontWeight: 950,
                  }}
                >
                  Operacion CETES
                </Typography>
                <Typography
                  sx={{
                    mt: 1.4,
                    maxWidth: 720,
                    color: "rgba(255,255,255,0.66)",
                    fontSize: 17,
                    lineHeight: 1.7,
                  }}
                >
                  Define monto, plazo y tasa con un resumen financiero visible
                  antes de confirmar la inversion.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        <CetesCalculator />
      </Container>
    </Box>
  );
}
