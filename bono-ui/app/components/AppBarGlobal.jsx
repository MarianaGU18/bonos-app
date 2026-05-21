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
  Avatar,
  Chip,
  Tooltip,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import Link from "next/link";
import AutoStories from "@mui/icons-material/AutoStories";
import LogoutIcon from "@mui/icons-material/Logout";
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

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <Stack direction="row" spacing={4} alignItems="center">
            {!user && (
              <Stack direction="row" spacing={2}>
                <Link href="/">
                  <Button color="secondary">HOME</Button>
                </Link>
                <Link href="/login">
                  <Button color="secondary">SIGN IN</Button>
                </Link>
                <Link href="/register">
                  <Button color="secondary">REGISTER</Button>
                </Link>
              </Stack>
            )}

            {user && (
              <Stack direction="row" spacing={3}>
                <Link href={getHomePath()}>
                  <Button color="secondary">DASHBOARD</Button>
                </Link>
                <Link href="/portafolio">
                  <Button color="secondary">PORTAFOLIO</Button>
                </Link>
              </Stack>
            )}

            {(!user || isUser) && (
              <Stack direction="row" spacing={2}>
                <Link href="/about">
                  <Button color="secondary">ABOUT</Button>
                </Link>
                <Link href="/contact">
                  <Button color="secondary">CONTACT</Button>
                </Link>
              </Stack>
            )}

            {user && (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ display: "inline-flex" }}
              >
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
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 35,
                      height: 35,
                      fontSize: "1rem",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                {/* MENU */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, minWidth: 180, borderRadius: 2 },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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

                  <MenuItem onClick={handleClose}>
                    <Link
                      href="/about"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      About
                    </Link>
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
                    <Link
                      href="/contact"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      Contact
                    </Link>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Stack>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal;
