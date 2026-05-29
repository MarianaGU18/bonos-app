"use client";

import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";

export default function AppMain({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <Box
      component="main"
      sx={{
        pt: isLanding ? 0 : { xs: 9, md: 10 },
      }}
    >
      {children}
    </Box>
  );
}
