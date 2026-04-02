"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { navItem } from "../constants/AppBarGlobal";
import Link from "next/link";
import AutoStories from "@mui/icons-material/AutoStories";

const AppBarGlobal = () => {
  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <AutoStories sx={{ display: { xs: "flex" }, mr: 1 }} />

        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              color: "inherit",
              fontWeight: "700",
              letterSpacing: "0.2rem",
            }}
          >
            Bonos
          </Typography>
        </Link>

        {/* NAV */}
        <Box sx={{ ml: "auto", display: { xs: "block" } }}>
          {navItem.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button color="inherit">
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal;