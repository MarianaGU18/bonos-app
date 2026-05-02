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

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <AutoStories sx={{ mr: 1 }} />

        <Typography
          component={Link}
          href={
            isAdmin
              ? "/admin"
              : isColaborador
                ? "/colab"
                : user
                  ? "/dashboard"
                  : "/"
          }
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
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button color="secondary">Home</Button>
                </Link>
              )}

              {isColaborador && (
                <Link href="/colab">
                  <Button color="secondary">Home</Button>
                </Link>
              )}

              {isUser && (
                <Link href="/dashboard">
                  <Button color="secondary">Home</Button>
                </Link>
              )}
            </>
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

          {/* Links adicionales */}
          {/*<Link href="/about">
            <Button color="secondary">About</Button>
          </Link>
          <Link href="/contact">
            <Button color="secondary">Contact</Button>
          </Link>*/}

          {user && (
            <>
              {/* ICONO */}
              <IconButton onClick={handleClick}>
                <AccountCircleIcon color="secondary" sx={{ fontSize: 32 }} />
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
