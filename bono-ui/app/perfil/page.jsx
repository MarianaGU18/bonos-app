"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AddFundsModal from "../components/AddFundsModal";

import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Alert,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Snackbar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        maternallast: user.maternallast || "",
        birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
      });
    }
  }, [user]);

  const balance = useMemo(() => user?.balance ?? 0, [user?.balance]);

  const handleAddFunds = async (amount) => {
    if (!user || !user.id || isDepositing) {
      return;
    }

    setIsDepositing(true);
    try {
      setError("");

      const numericAmount = parseFloat(amount);

      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Invalid amount specified.");
      }

      await makeDeposit(user.id, numericAmount);

      setShowSuccessAlert(true);
      setIsFundsModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to add funds.");
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
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    if (user) {
      setFormData({
        name: user.name,
        lastname: user.lastname,
        maternallast: user.maternallast,
        birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
      });
    }
  };

  if (loading || !user || !formData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "grey.50",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      <Container
        sx={{
          pt: 5,
          pb: 5,
        }}
      >
        {/* HERO SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <PersonIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#0f172a" }}
              >
                MY PROFILE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your personal information
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={5}>
          {/* LEFT SIDEBAR */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 5,
                bgcolor: "#f8fafc", // Blanco "fuerte" para resaltar sobre el fondo blanco
                boxShadow: 2,
                transition: "0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 5,
                },
              }}
            >
              <Stack spacing={2.2} alignItems="center">
                <Avatar
                  alt={user.name}
                  src="/profile.svg"
                  sx={{
                    width: 120,
                    height: 120,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    bgcolor: "white",

                    // BORDE DEL AVATAR (CREMA)
                    // border: "5px solid #ce9015",
                  }}
                />

                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {user.name} {user.lastname}
                  </Typography>

                  <Typography color="text.secondary">{user.email}</Typography>
                </Box>

                {/* BORDE DEL SEPARADOR INTERNO (CREMA) */}
                <Divider sx={{ width: "100%" /*borderColor: "#e2dcd0" */ }} />

                {/* ROLE */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    width: "100%",
                    px: 0.5,
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Role
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {user.role}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
                borderRadius: 5,
                bgcolor: "#f8fafc", // Blanco "fuerte" para resaltar sobre el fondo blanco
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",

                // BORDE DEL CONTENEDOR PRINCIPAL DERECHO (CREMA)
                //border: "2px solid #d946ef", // 💗 ROSA: Card de Datos Personales/Historial

                boxShadow: 2,
                transition: "0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 5,
                },
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  mb: 3,
                  borderBottom: 1,

                  // BORDE DE LA LÍNEA INFERIOR DE LAS PESTAÑAS (CREMA)
                  borderColor: "#ded0e2",

                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1e3a8a", // Línea indicadora activa (Azul)
                  },
                }}
              >
                <Tab label="Personal Data" />
              </Tabs>

              {/* PERSONAL DATA */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Personal Information
                  </Typography>

                  <Typography color="text.secondary">
                    View and manage your personal information.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "#fafafa",

                          // 1. Borde en estado normal/reposo (Crema)
                          "& fieldset": {
                            borderColor: "#e2dcd0",
                          },
                          // 2. Borde cuando pasas el cursor por encima (Crema un poco más oscuro)
                          "&:hover fieldset": {
                            borderColor: "#c1b8aa",
                          },
                          // 3. Borde cuando haces click / estás editando (Azul)
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "#fafafa",
                          "& fieldset": {
                            borderColor: "#e2dcd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#c1b8aa",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Maternal Last Name"
                      name="maternallast"
                      value={formData.maternallast}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "#fafafa",
                          "& fieldset": {
                            borderColor: "#e2dcd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#c1b8aa",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Date of Birth"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: "#fafafa",
                          "& fieldset": {
                            borderColor: "#e2dcd0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#c1b8aa",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 5,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  {isEditing ? (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          px: 3,
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={
                          isSaving ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <SaveIcon />
                          )
                        }
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          px: 3,
                          fontWeight: 600,
                          backgroundColor: "#16a34a",
                          //border: "1px solid #16a34a",
                          "&:hover": {
                            backgroundColor: "#15803d",
                            borderColor: "#15803d",
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        px: 3,
                        fontWeight: 600,

                        // BORDE DEL BOTÓN EDITAR EN AZUL CORPORATIVO
                        borderColor: "#1e3a8a",
                        color: "#1e3a8a",

                        "&:hover": {
                          borderColor: "#1d4ed8",
                          backgroundColor: "rgba(30, 58, 138, 0.04)",
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <AddFundsModal
        open={isFundsModalOpen}
        onClose={() => setIsFundsModalOpen(false)}
        onAddFunds={handleAddFunds}
        loading={isDepositing}
      />

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Operation completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
