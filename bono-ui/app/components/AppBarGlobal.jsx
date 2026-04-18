"use client";

import {
  AppBar,
  Box,
  Button,
  Menu,
  Toolbar,
  Typography,
  MenuItem,
  IconButton
} from "@mui/material";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStories from "@mui/icons-material/AutoStories";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AppBarGlobal = () => {
  const { user, logout, loading } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) return null;

  // apertura del menú
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // cerrar menú
  const handleClose = () => {
    setAnchorEl(null);
  };

  // logout 
  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <AutoStories sx={{ mr: 1 }} />

        <Typography
          component={Link}
          href={user ? "/dashboard" : "/"}
          sx={{
            textDecoration: "none",
            color: "secondary.main",
          }}
        >
          Bonos
        </Typography>

        <Box sx={{ ml: "auto" }}>
          {!user && (
            <>
              <Link href="/login">
                <Button color="secondary">Login</Button>
              </Link>

              <Link href="/register">
                <Button color="secondary">Register</Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/dashboard">
                <Button color="secondary">Home</Button>
              </Link>

              {/* ICONO */}
              <IconButton onClick={handleClick}>
                <AccountCircleIcon
                  color="secondary"
                  sx={{ fontSize: 32 }}
                />
              </IconButton>

              {/* MENU */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/perfil"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    Profile
                  </Link>
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal;