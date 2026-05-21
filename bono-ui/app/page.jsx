"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import Link from "next/link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: 10,
          pb: 8,
        }}
      >
        {/* HERO SECTION */}
        <Box
          sx={{
            textAlign: "center",
            mb: 10,
            p: 4,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              mb: 2,
              letterSpacing: "-1px",
            }}
          >
            Invest in your future with{" "}
            <span style={{ color: "#1e3a8a" }}>Bono App</span>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 700, mx: "auto" }}
          >
            The most professional and simple way to manage your government bonds
            and CETES investments in Mexico.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Link href="/login" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: "#1e3a8a" }}
              >
                Get Started
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: "#1e3a8a",
                  color: "#1e3a8a",
                }}
              >
                Learn More
              </Button>
            </Link>
          </Stack>
        </Box>

        {/* FEATURES GRID */}
        <Grid container spacing={4}>
          {[
            {
              icon: <TrendingUpIcon fontSize="large" />,
              title: "Real-time Valuation",
              color: "#10b981",
              border: "#10b981",
            },
            {
              icon: <SecurityIcon fontSize="large" />,
              title: "Secure Platform",
              color: "#3b82f6",
              border: "#3b82f6",
            },
            {
              icon: <AccountBalanceIcon fontSize="large" />,
              title: "Bank Grade Analytics",
              color: "#d946ef",
              border: "#d946ef",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 5,
                  bgcolor: "#f8fafc",
                  border: `2px solid ${feature.border}`, // Bordes de colores según el feature
                  boxShadow: 2,
                  transition: "0.2s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 5 },
                }}
              >
                <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience institutional quality tools designed for the modern
                  retail investor.
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
