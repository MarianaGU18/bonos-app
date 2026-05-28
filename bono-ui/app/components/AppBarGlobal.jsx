"use client";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const publicNav = [
  { label: "Inicio", href: "/inicio#inicio" },
  { label: "Valor", href: "/inicio#valor" },
  { label: "Modulos", href: "/inicio#modulos" },
  { label: "Confianza", href: "/inicio#confianza" },
  { label: "Operacion", href: "/inicio#operacion" },
];

const privateNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Bonos", href: "/cetes" },
  { label: "Cartera", href: "/portafolio" },
  { label: "Perfil", href: "/perfil" },
];

function Brand({ href, compact = false }) {
  return (
    <Stack component={Link} href={href} direction="row" spacing={1.1} alignItems="center" sx={{ color: "inherit", textDecoration: "none" }}>
      <Box
        sx={{
          width: compact ? 34 : 38,
          height: compact ? 34 : 38,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          color: "#101820",
          bgcolor: "#DDF7EE",
          boxShadow: "0 10px 22px rgba(39,181,138,0.22)",
        }}
      >
        <AccountBalanceIcon fontSize={compact ? "small" : "medium"} />
      </Box>
      <Box sx={{ lineHeight: 1 }}>
        <Typography sx={{ color: "#101820", fontSize: compact ? 15 : 17, fontWeight: 900, letterSpacing: 0 }}>
          Acero Inteligente
        </Typography>
        {!compact && (
          <Typography sx={{ display: { xs: "none", sm: "block" }, mt: 0.3, color: "#667382", fontSize: 11, fontWeight: 750 }}>
            Inversion en bonos
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function NavLinks({ items, isActive, onNavigate, mobile = false }) {
  return (
    <Stack component="nav" direction={mobile ? "column" : "row"} spacing={mobile ? 0.7 : 0.3} sx={{ width: mobile ? "100%" : "auto" }}>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Button
            key={item.label}
            component={Link}
            href={item.href}
            onClick={onNavigate}
            sx={{
              justifyContent: mobile ? "flex-start" : "center",
              minWidth: "auto",
              px: mobile ? 1.5 : 1.35,
              py: mobile ? 1.1 : 0.85,
              borderRadius: "10px",
              color: active ? "#101820" : "#667382",
              bgcolor: active ? "rgba(39,181,138,0.14)" : "transparent",
              boxShadow: "none",
              fontSize: 13,
              fontWeight: 800,
              "&:hover": {
                transform: "none",
                boxShadow: "none",
                bgcolor: active ? "rgba(39,181,138,0.18)" : "rgba(16,24,32,0.05)",
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
}

export default function AppBarGlobal() {
  const { user, logout, loading, isAdmin, isColaborador } = useAuth();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;
  if (pathname === "/inicio") return null;

  const homePath = isAdmin ? "/admin" : isColaborador ? "/colab" : user ? "/dashboard" : "/inicio";
  const navItems = user ? privateNav : publicNav;
  const compact = !user && !scrolled;

  const isActive = (href) => {
    if (href.includes("#")) return false;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: { xs: 10, md: 14 },
        left: "50%",
        width: "min(1180px, calc(100% - 28px))",
        transform: "translateX(-50%)",
        zIndex: (theme) => theme.zIndex.appBar,
        borderRadius: "16px",
        color: "#101820",
        border: scrolled || user ? "1px solid rgba(16,24,32,0.12)" : "1px solid rgba(255,255,255,0.34)",
        bgcolor: scrolled || user ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.42)",
        boxShadow: scrolled || user ? "0 18px 42px rgba(16,24,32,0.10)" : "0 10px 28px rgba(16,24,32,0.04)",
        backdropFilter: "blur(22px)",
        transition: "background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease, transform 220ms ease",
        "&:hover": { transform: "translateX(-50%)" },
      }}
    >
      <Toolbar sx={{ minHeight: compact ? 58 : 64, px: { xs: 1.4, md: 1.8 }, gap: 1.5 }}>
        <Brand href={homePath} compact={compact} />

        <Box sx={{ display: { xs: "none", md: "block" }, ml: { md: 2, lg: 4 } }}>
          <NavLinks items={navItems} isActive={isActive} />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
          {user && (
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                width: 250,
                px: 1.4,
                py: 0.65,
                borderRadius: "12px",
                bgcolor: "#F5F7FA",
                border: "1px solid rgba(16,24,32,0.10)",
                color: "#667382",
              }}
            >
              <SearchIcon sx={{ fontSize: 18, mr: 0.8 }} />
              <InputBase
                placeholder="Buscar bono o emisor"
                inputProps={{ "aria-label": "Buscar bonos" }}
                sx={{ flex: 1, color: "#101820", fontSize: 13 }}
              />
            </Box>
          )}

          {user && (
            <IconButton
              aria-label="Notificaciones"
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                bgcolor: "#F5F7FA",
                border: "1px solid rgba(16,24,32,0.10)",
                color: "#17212B",
                "&:hover": { bgcolor: "rgba(39,181,138,0.12)" },
              }}
            >
              <Badge color="info" variant="dot">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
          )}

          {user ? (
            <>
              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} aria-label="Abrir menu de usuario" sx={{ p: 0.25 }}>
                <Avatar sx={{ width: 38, height: 38, borderRadius: "12px", bgcolor: "#17212B", color: "#fff", fontWeight: 900 }}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1.3, minWidth: 210, borderRadius: "14px", border: "1px solid rgba(16,24,32,0.12)", boxShadow: "0 22px 56px rgba(16,24,32,0.16)" } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem component={Link} href="/perfil" onClick={() => setAnchorEl(null)}>Perfil</MenuItem>
                <MenuItem component={Link} href="/portafolio" onClick={() => setAnchorEl(null)}>Cartera</MenuItem>
                <MenuItem component={Link} href="/contact" onClick={() => setAnchorEl(null)}>Contacto</MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Cerrar sesion
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={0.8} sx={{ display: { xs: "none", sm: "flex" } }}>
              <Button component={Link} href="/login" sx={{ color: "#17212B", px: 1.5, boxShadow: "none" }}>
                Entrar
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{ borderRadius: "10px", bgcolor: "#17212B", color: "#fff", px: 2, "&:hover": { bgcolor: "#0B1117" } }}
              >
                Crear cuenta
              </Button>
            </Stack>
          )}

          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir navegacion"
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "#17212B" }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 310, p: 2.5, bgcolor: "#F8FAFC", minHeight: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Brand href={homePath} />
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Cerrar navegacion">
              <CloseIcon />
            </IconButton>
          </Stack>
          <NavLinks items={navItems} isActive={isActive} mobile onNavigate={() => setDrawerOpen(false)} />
          {!user && (
            <Stack spacing={1.2} sx={{ mt: 3 }}>
              <Button component={Link} href="/login" variant="outlined" onClick={() => setDrawerOpen(false)}>
                Entrar
              </Button>
              <Button component={Link} href="/register" variant="contained" onClick={() => setDrawerOpen(false)}>
                Crear cuenta
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
