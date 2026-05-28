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
        bgcolor: "#F5F7FA",
        borderTop: "1px solid rgba(16,24,32,0.10)",
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
                bgcolor: "#17212B",
                color: "#DDF7EE",
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
              <Typography sx={{ color: "#667382", fontSize: 12, mt: 0.3 }}>
                Plataforma de inversion en bonos
              </Typography>
            </Box>
          </Stack>
          <Divider flexItem sx={{ display: { sm: "none" } }} />
          <Typography variant="body2" sx={{ color: "#667382" }}>
            Copyright (c) {new Date().getFullYear()} Acero Inteligente.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
