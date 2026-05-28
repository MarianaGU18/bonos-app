"use client";

import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/inicio") return null;

  return (
    <Box
      component="footer"
      sx={{
        py: 3.5,
        bgcolor: "#EEF3F8",
        borderTop: "1px solid #D8E3EC",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                bgcolor: "#0B1F3A",
                color: "#EEF3F8",
              }}
            >
              <AccountBalanceIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#0F172A", fontWeight: 900, lineHeight: 1 }}
              >
                Acero Inteligente
              </Typography>
              <Typography sx={{ color: "#1F2937", fontSize: 12, mt: 0.3 }}>
                Plataforma de inversion en bonos
              </Typography>
            </Box>
          </Stack>
          <Divider flexItem sx={{ display: { sm: "none" } }} />
          <Typography variant="body2" sx={{ color: "#1F2937" }}>
            Copyright (c) {new Date().getFullYear()} Acero Inteligente.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

