"use client";

import { Box, Typography, Container } from "@mui/material";

import Link from "next/link";

export default function NotFound() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 4,
        px: {
          xs: 3,
          sm: 5,
          md: 8,
        },
      }}
    >
      {/* LOGO */}
      <Typography
        variant="h4"
        sx={{
          color: "primary.main",
          fontWeight: 800,
          mb: 4,
        }}
      >
        Bonos
        <Box
          component="span"
          sx={{
            color: "accent.main",
          }}
        >
          .
        </Box>
      </Typography>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          alignItems: "center",

          gap: {
            xs: 4,
            md: 8,
          },

          mb: 6,
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            pl: { md: 4, lg: 8 },
          }}
        >
          {/* SORRY */}
          <Typography
            sx={{
              fontSize: {
                xs: "5rem",
                md: "9rem",
                lg: "11rem",
              },

              fontWeight: 200,
              lineHeight: 1,
              color: "primary.main",
              letterSpacing: "-0.04em",
            }}
          >
            SORRY
          </Typography>

          {/* TITLE */}
          <Typography
            variant="h3"
            sx={{
              color: "primary.main",
              mb: 2,
              maxWidth: 550,
            }}
          >
            We couldn&apos;t find that page
          </Typography>

          {/* ACCENT LINE */}
          <Box
            sx={{
              width: 70,
              height: 4,
              backgroundColor: "accent.main",
              borderRadius: 10,
              mb: 4,
            }}
          />

          {/* MESSAGE */}
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              lineHeight: 1.8,
              maxWidth: 500,
              mb: 5,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                textDecoration: "underline",
                color: "accent.main",
              },
            }}
          >
            Go to Bonos&apos;s home page
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/siamese-cat.png"
            alt="Siamese analyst cat"
            sx={{
              width: {
                xs: 220,
                md: 260,
                lg: 300,
              },

              height: "auto",

              objectFit: "contain",

              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
