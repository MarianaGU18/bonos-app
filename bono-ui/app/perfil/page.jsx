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
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";

/* =========================
   TOKENS LOCALES (TEMPORAL)
========================= */
const ui = {
  card: {
    bgcolor: "background.paper",
    borderRadius: 1.5, // 24px, consistente con el override de MuiPaper
    boxShadow: 2,
    border: "2px solid",
    borderColor: "primary.main",
    transition: "0.2s ease",
  },

  hoverLift: {
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 5,
    },
  },

  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1, // 16px
      backgroundColor: "background.paper",

      "& fieldset": {
        borderColor: "primary.light",
      },
      "&:hover fieldset": {
        borderColor: "text.secondary",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
      },
    },
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    if (!user || isDepositing) return;

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

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdatePassword = async () => {
    if (
      !passwordData.newPassword ||
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setError("Passwords do not match or are empty.");
      return;
    }
    try {
      setIsSaving(true);
      // Simulación de guardado
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
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

        background: `
        linear-gradient(
          180deg,
          #f8fafc 0%,
          #eef2f7 100%
        )
      `,

        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Box maxWidth="1400px" mx="auto">
          <Grid container spacing={4}>
            {/* ================= SIDEBAR ================= */}
            <Grid item xs={12} lg={3}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: "75vh",

                  position: "sticky",
                  top: 24,

                  overflow: "hidden",

                  bgcolor: "background.paper",

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 6,

                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* HEADER */}
                <Box
                  sx={{
                    p: 4,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Avatar
                    src="/profile.svg"
                    sx={{
                      width: 120,
                      height: 120,

                      mx: "auto",
                      mb: 3,

                      border: "4px solid rgba(255,255,255,0.9)",

                      boxShadow: `
                      0 10px 30px rgba(0,0,0,0.18)
                    `,
                    }}
                  />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    {user.name} {user.lastname}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.75)",
                      mt: 1,
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                {/* CONTENT */}
                <Stack
                  spacing={4}
                  sx={{
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        letterSpacing: 1,
                      }}
                    >
                      Role
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                      }}
                    >
                      {user.role}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: "4px solid",
                      borderColor: "secondary.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        letterSpacing: 1,
                      }}
                    >
                      Birthdate
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                      {formData.birthdate || "Not specified"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: "4px solid",
                      borderColor: "accent.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        letterSpacing: 1,
                      }}
                    >
                      Email
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>{user.email}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* ================= CONTENT ================= */}
            <Grid item xs={12} lg={9}>
              {/* HEADER */}
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  My Profile
                </Typography>

                <Typography color="text.secondary">
                  View and manage your personal information
                </Typography>
              </Box>

              {/* MAIN CONTENT */}
              <Paper
                elevation={0}
                sx={{
                  p: {
                    xs: 3,
                    md: 5,
                  },

                  borderRadius: 6,

                  border: "1px solid",
                  borderColor: "divider",

                  bgcolor: "background.paper",
                }}
              >
                {/* TABS */}
                <Tabs
                  value={tabValue}
                  onChange={(e, v) => setTabValue(v)}
                  sx={{
                    mb: 5,

                    borderBottom: "1px solid",
                    borderColor: "divider",

                    "& .MuiTabs-indicator": {
                      height: 4,
                      borderRadius: 999,
                    },

                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 700,
                      minHeight: 56,
                      borderRadius: 3,
                      transition: "all 0.2s ease",
                    },

                    "& .Mui-selected": {
                      color: "primary.main",
                      bgcolor: "rgba(11,60,93,0.05)",
                    },
                  }}
                >
                  <Tab
                    icon={<PersonIcon fontSize="small" />}
                    iconPosition="start"
                    label="General Info"
                  />

                  <Tab
                    icon={<ShieldIcon fontSize="small" />}
                    iconPosition="start"
                    label="Security"
                  />
                </Tabs>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 4,
                      borderRadius: 3,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* ================= TAB 1 ================= */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Profile Details
                    </Typography>

                    <Typography color="text.secondary">
                      Update your personal information and profile data.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="First Name"
                        name="name"
                        value={formData.name}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        fullWidth
                        sx={ui.input}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Last Name"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        fullWidth
                        sx={ui.input}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mother Last Name"
                        name="maternallast"
                        value={formData.maternallast}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        fullWidth
                        sx={ui.input}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Birthdate"
                        name="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        fullWidth
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                        sx={ui.input}
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
                        <Button variant="outlined" onClick={handleCancelEdit}>
                          Cancel
                        </Button>

                        <Button
                          variant="contained"
                          startIcon={
                            isSaving ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <SaveIcon />
                            )
                          }
                          onClick={handleSaveProfile}
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Box>
                </TabPanel>

                {/* ================= TAB 2 ================= */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Security Settings
                    </Typography>

                    <Typography color="text.secondary">
                      Manage your password and account security.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="password"
                        label="Current Password"
                        fullWidth
                        sx={ui.input}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        type="password"
                        label="New Password"
                        fullWidth
                        sx={ui.input}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleUpdatePassword}
                        disabled={isSaving}
                        startIcon={
                          isSaving ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : null
                        }
                      >
                        {isSaving ? "Updating..." : "Update Password"}
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* ================= TAB 3 ================= */}
                <TabPanel value={tabValue} index={2}>
                  <Stack spacing={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,

                        borderRadius: 4,

                        border: "1px solid",
                        borderColor: "divider",

                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Currency
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Current currency: MXN
                      </Typography>

                      <Button variant="outlined" size="small">
                        Change Currency
                      </Button>
                    </Paper>
                  </Stack>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>

          {/* MODALS */}
          <AddFundsModal
            open={isFundsModalOpen}
            onClose={() => setIsFundsModalOpen(false)}
            onAddFunds={handleAddFunds}
            loading={isDepositing}
          />

          {/* ALERT */}
          <Snackbar
            open={showSuccessAlert}
            autoHideDuration={5000}
            onClose={() => setShowSuccessAlert(false)}
          >
            <Alert severity="success">Operation completed successfully!</Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
}
