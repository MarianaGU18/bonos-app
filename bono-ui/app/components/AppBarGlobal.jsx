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
  Divider,
  Stack,
} from "@mui/material";

import Link from "next/link";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AppBarGlobal = () => {
  const { user, logout, loading, isAdmin, isColaborador, isUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) return null;

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const getHomePath = () => {
    if (isAdmin) return "/admin";
    if (isColaborador) return "/colab";
    if (user) return "/dashboard";
    return "/";
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "primary.main",
        mb: 2,
        borderRadius: 0, // Hace que sea cuadrado
        border: "none", // Elimina el borde definido en el tema global para Paper
        "&:hover": {
          transform: "none", // Desactiva la animación de "flotado" del GlobalTheme
        },
        transition: "none", // Elimina cualquier transición suave de movimiento
      }}
    >
      <Toolbar>
        {/* LOGO */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoStoriesIcon />
          <Typography
            component={Link}
            href={getHomePath()}
            sx={{
              textDecoration: "none",
              color: "inherit",
              typography: "titleLogo", // Usa la fuente Nunito 800 del tema
            }}
          >
            Bonos
          </Typography>
        </Stack>

        {/* NAV */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* LINKS PUBLICOS */}
            {!user && (
              <>
                <Button component={Link} href="/" color="inherit">
                  Home
                </Button>
                <Button component={Link} href="/login" color="inherit">
                  Sign in
                </Button>
                <Button component={Link} href="/register" color="inherit">
                  Register
                </Button>
              </>
            )}

            {/* LINKS USUARIO */}
            {user && (
              <>
                <Button component={Link} href={getHomePath()} color="inherit">
                  Dashboard
                </Button>
                <Button component={Link} href="/portafolio" color="inherit">
                  Portfolio
                </Button>
              </>
            )}

            {/* INFO GENERAL */}
            {!isAdmin && (
              <>
                <Button component={Link} href="/about" color="inherit">
                  About
                </Button>
                <Button component={Link} href="/contact" color="inherit">
                  Contact
                </Button>
              </>
            )}

            {/* USER MENU */}
            {user && (
              <>
                <IconButton onClick={openMenu} sx={{ ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "secondary.main",
                      fontSize: "1rem",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  PaperProps={{
                    sx: { mt: 1.5, minWidth: 180, borderRadius: 2 },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem component={Link} href="/perfil" onClick={closeMenu}>
                    Profile
                  </MenuItem>

                  <MenuItem component={Link} href="/about" onClick={closeMenu}>
                    About
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    href="/contact"
                    onClick={closeMenu}
                  >
                    Contact
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarGlobal;
