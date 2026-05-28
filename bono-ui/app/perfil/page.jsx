"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddFundsModal from "../components/AddFundsModal";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        bgcolor: "#EEF3F8",
        border: "1px solid #D8E3EC",
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box sx={{ color: "#7FB3D5", display: "grid", placeItems: "center" }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#1F2937", fontSize: 12, fontWeight: 850 }}>{label}</Typography>
          <Typography sx={{ color: "#1F2937", fontWeight: 900, overflowWrap: "anywhere" }}>{value}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function ProfilePage() {
  const { user, loading, makeDeposit, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      let rawDate = user.birthdate || user.birthDate || "";

      if (typeof rawDate === "string" && rawDate.includes("T")) {
        rawDate = rawDate.split("T")[0];
      }

      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        maternallast: user.maternallast || "",
        birthdate: rawDate,
      });
    }
  }, [user]);

  const balance = useMemo(() => user?.balance ?? 0, [user?.balance]);

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  const initials = `${user?.name?.[0] || "U"}${user?.lastname?.[0] || ""}`.toUpperCase();

  const handleAddFunds = async (amount) => {
    if (!user || isDepositing) return;

    setIsDepositing(true);
    try {
      setError("");

      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Monto invalido.");
      }

      await makeDeposit(user.id, numericAmount);
      setShowSuccessAlert(true);
      setIsFundsModalOpen(false);
    } catch (err) {
      setError(err.message || "No se pudieron agregar fondos.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      setError("");
      await updateUser(formData);
      setIsEditing(false);
      setShowSuccessAlert(true);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    if (user) {
      let bdate = user.birthdate || user.birthDate || "";
      if (typeof bdate === "string" && bdate.includes("T")) bdate = bdate.split("T")[0];

      setFormData({
        name: user.name,
        lastname: user.lastname,
        maternallast: user.maternallast,
        birthdate: bdate,
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contrasenas no coinciden o estan vacias.");
      return;
    }
    try {
      setIsSaving(true);
      await new Promise((r) => setTimeout(r, 1000));
      setShowSuccessAlert(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user || !formData) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh", bgcolor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 8% 8%, rgba(127,179,213,0.12), transparent 25%),
          radial-gradient(circle at 88% 7%, rgba(29,78,137,0.10), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 48%, #EEF3F8 100%)
        `,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Paper
            sx={{
              position: { lg: "sticky" },
              top: { lg: 96 },
              overflow: "hidden",
              borderRadius: "20px",
              bgcolor: "#fff",
              boxShadow: "0 24px 58px #D8E3EC",
            }}
          >
            <Box
              sx={{
                p: 3,
                color: "#fff",
                background: `
                  radial-gradient(circle at 80% 10%, rgba(127,179,213,0.28), transparent 32%),
                  linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
                `,
              }}
            >
              <Avatar
                sx={{
                  width: 86,
                  height: 86,
                  borderRadius: "22px",
                  bgcolor: "#EEF3F8",
                  color: "#1F2937",
                  fontSize: 29,
                  fontWeight: 950,
                  mb: 2.2,
                }}
              >
                {initials}
              </Avatar>
              <Typography sx={{ fontSize: 28, lineHeight: 1.08, fontWeight: 950 }}>
                {user.name} {user.lastname}
              </Typography>
              <Typography sx={{ mt: 0.9, color: "rgba(255,255,255,0.62)", overflowWrap: "anywhere" }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role}
                sx={{
                  mt: 2,
                  bgcolor: "rgba(127,179,213,0.16)",
                  color: "#EEF3F8",
                  border: "1px solid rgba(127,179,213,0.28)",
                }}
              />
            </Box>

            <Stack spacing={1.2} sx={{ p: 2.2 }}>
              <InfoTile icon={<MailOutlineOutlinedIcon />} label="Email" value={user.email} />
              <InfoTile icon={<BadgeOutlinedIcon />} label="Fecha de nacimiento" value={formData.birthdate || "No especificada"} />
              <InfoTile icon={<AccountBalanceWalletOutlinedIcon />} label="Balance registrado" value={fmt(balance)} />
              <Button
                variant="contained"
                startIcon={<AccountBalanceWalletOutlinedIcon />}
                onClick={() => setIsFundsModalOpen(true)}
              >
                Agregar fondos
              </Button>
            </Stack>
          </Paper>

          <Box>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                borderRadius: "20px",
                bgcolor: "rgba(255,255,255,0.92)",
                boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Chip label="Configuracion de cuenta" sx={{ mb: 1.5, bgcolor: "rgba(127,179,213,0.12)", color: "#0B1F3A" }} />
                  <Typography component="h1" sx={{ fontSize: { xs: 34, md: 48 }, lineHeight: 1, fontWeight: 950 }}>
                    Perfil y seguridad
                  </Typography>
                  <Typography sx={{ mt: 1.4, color: "#1F2937", maxWidth: 680 }}>
                    Administra datos personales, seguridad de acceso y preferencias basicas de tu cuenta financiera.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SecurityOutlinedIcon sx={{ color: "#7FB3D5" }} />
                  <Typography sx={{ fontWeight: 900 }}>Cuenta protegida</Typography>
                </Stack>
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2.4, md: 3 },
                borderRadius: "20px",
                bgcolor: "rgba(255,255,255,0.94)",
                boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: "1px solid #D8E3EC" }}
              >
                <Tab icon={<BadgeOutlinedIcon fontSize="small" />} iconPosition="start" label="Datos personales" />
                <Tab icon={<LockOutlinedIcon fontSize="small" />} iconPosition="start" label="Seguridad" />
                <Tab icon={<SettingsOutlinedIcon fontSize="small" />} iconPosition="start" label="Preferencias" />
              </Tabs>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              <TabPanel value={tabValue} index={0}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 950 }}>Informacion personal</Typography>
                    <Typography sx={{ color: "#1F2937", mt: 0.5 }}>Mantén tus datos de identificacion actualizados.</Typography>
                  </Box>
                  {!isEditing && (
                    <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </Button>
                  )}
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  <TextField label="Nombre" name="name" value={formData.name} onChange={handleProfileChange} disabled={!isEditing} fullWidth />
                  <TextField label="Apellido paterno" name="lastname" value={formData.lastname} onChange={handleProfileChange} disabled={!isEditing} fullWidth />
                  <TextField label="Apellido materno" name="maternallast" value={formData.maternallast} onChange={handleProfileChange} disabled={!isEditing} fullWidth />
                  <TextField
                    label="Fecha de nacimiento"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>

                {isEditing && (
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={1.2} sx={{ mt: 3 }}>
                    <Button variant="outlined" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveOutlinedIcon />}
                      onClick={handleSaveProfile}
                    >
                      {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </Stack>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 950 }}>Seguridad de acceso</Typography>
                  <Typography sx={{ color: "#1F2937", mt: 0.5 }}>Actualiza tu contraseña y revisa el estado de proteccion.</Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  <TextField
                    type="password"
                    label="Password actual"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                  />
                  <TextField
                    type="password"
                    label="Nuevo password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                  />
                  <TextField
                    type="password"
                    label="Confirmar nuevo password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                  />
                </Box>

                <Divider sx={{ my: 3 }} />
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <SecurityOutlinedIcon sx={{ color: "#7FB3D5" }} />
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>Estado de cuenta</Typography>
                      <Typography sx={{ color: "#1F2937", fontSize: 14 }}>Acceso protegido por sesion autenticada.</Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={handleUpdatePassword}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />}
                  >
                    {isSaving ? "Actualizando..." : "Actualizar password"}
                  </Button>
                </Stack>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 950 }}>Preferencias financieras</Typography>
                  <Typography sx={{ color: "#1F2937", mt: 0.5 }}>Configuracion preparada para futuras preferencias del producto.</Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 1.5,
                  }}
                >
                  <InfoTile icon={<AccountBalanceWalletOutlinedIcon />} label="Moneda base" value="MXN" />
                  <InfoTile icon={<SecurityOutlinedIcon />} label="Tipo de inversion" value="Renta fija" />
                  <InfoTile icon={<SettingsOutlinedIcon />} label="Reportes" value="Mensual" />
                </Box>
              </TabPanel>
            </Paper>
          </Box>
        </Box>

        <AddFundsModal
          open={isFundsModalOpen}
          onClose={() => setIsFundsModalOpen(false)}
          onAddFunds={handleAddFunds}
          loading={isDepositing}
        />

        <Snackbar open={showSuccessAlert} autoHideDuration={5000} onClose={() => setShowSuccessAlert(false)}>
          <Alert severity="success">Operacion completada correctamente.</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}


