"use client";

import { Container, Typography, Box, Paper, Chip } from "@mui/material";

import SavingsIcon from "@mui/icons-material/Savings";
import CetesCalculator from "../context/CetesCalculator"; // Importamos el componente

export default function CetesPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: (theme) => `
        linear-gradient(
          135deg,
          ${theme.palette.background.default} 0%,
          ${theme.palette.background.subtle} 50%,
          ${theme.palette.background.default} 100%
        )
      `,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 4,
            md: 6,
          },
        }}
      >
        {/* HEADER */}

        <Paper
          sx={{
            mb: 5,

            p: {
              xs: 4,
              md: 5,
            },

            background: (theme) => `
            linear-gradient(
              135deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.background.dark} 100%
            )
          `,

            color: "white",
            border: "2px solid #ff1744",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",

              alignItems: "center",

              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 72,

                  height: 72,

                  borderRadius: 3,

                  bgcolor: "rgba(255,255,255,0.08)",

                  border: "1px solid rgba(0, 242, 20, 0.94)",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <SavingsIcon
                  sx={{
                    fontSize: 38,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="h3">CETES Valuation</Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,

                    mt: 1,
                  }}
                >
                  Calculate your government bond investment returns
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* CALCULADORA REUTILIZABLE */}
        <CetesCalculator />
      </Container>
    </Box>
  );
}
