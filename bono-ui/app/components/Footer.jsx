"use client";

import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

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
                borderRadius: "20%",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                bgcolor: "#1C285A",
                boxShadow: "0 8px 16px rgba(127,179,213,0.18)",
              }}
            >
              <Image
                src="/Logo.png"
                alt="Logo NeoInvest"
                width={24}
                height={24}
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#0F172A", fontWeight: 900, lineHeight: 1 }}
              >
                NeoInvest
              </Typography>
            </Box>
          </Stack>
          <Divider flexItem sx={{ display: { sm: "none" } }} />
          <Typography variant="body2" sx={{ color: "#1F2937" }}>
            Copyright (c) {new Date().getFullYear()} NeoInvest.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
