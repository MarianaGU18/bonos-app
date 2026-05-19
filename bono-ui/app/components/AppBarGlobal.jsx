"use client";

import {
  AppBar,
  Box,
  Button,
  Menu,
  Toolbar,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStories from "@mui/icons-material/AutoStories";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AppBarGlobal = () => {
  const { user, logout, loading, isAdmin, isColaborador, isUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) return null;

  // 🔓 Abrir Menu con el click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 🔒 Cerrar Menu con el click
  const handleClose = () => {
    setAnchorEl(null);
  };

  // logout - Cerrar sesión
  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getHomePath = () => {
    if (isAdmin) return "/admin";
    if (isColaborador) return "/colab";
    if (user) return "/dashboard";
    return "/";
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <AutoStories sx={{ mr: 1 }} />

        <Typography
          variant="h6"
          component={Link}
          href={getHomePath()}
          sx={{
            textDecoration: "none",
            color: "secondary.main",
            fontFamily: "serif",
            fontWeight: "bold",
          }}
        >
          Bonos
        </Typography>

        <Box sx={{ ml: "auto" }}>
          {!user && (
            <>
              <Link href="/">
                <Button color="secondary">Home</Button>
              </Link>
              <Link href="/login">
                <Button color="secondary">SIGN IN</Button>
              </Link>

              <Link href="/register">
                <Button color="secondary">REGISTER</Button>
              </Link>
            </>
          )}

          {user && (
            <Link href={getHomePath()}>
              <Button color="secondary">Home</Button>
            </Link>
          )}
          {(!user || isUser) && (
            <>
              <Link href="/about">
                <Button color="secondary">About</Button>
              </Link>
              <Link href="/contact">
                <Button color="secondary">Contact</Button>
              </Link>
            </>
          )}

          {user && (
            <>
              {/* ICONO */}
              <IconButton
                onClick={handleClick}
                sx={{
                  p: 0.5,

                  transition: "0.2s ease",

                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                <AccountCircleIcon
                  color="secondary"
                  sx={{
                    fontSize: 42,
                  }}
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

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal;
