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
        birthdate: user.birthdate || "",
      });
    }
  }, [user]);

  const balance = useMemo(() => user?.balance ?? 0, [user?.balance]);

  const handleAddFunds = async (amount) => {
    if (!user || !user.id) {
      setError("User not found. Cannot add funds.");
      return;
    }

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
        birthdate: user.birthdate,
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
        bgcolor: "#f8fafc",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          pt: 5,
          pb: 5,

          px: {
            xs: 2,
            sm: 3,
            md: 6,
            lg: 8,
          },
        }}
      >
        {/* HERO SECTION */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,

            fontFamily: "'Poppins', sans-serif",

            letterSpacing: "-1px",

            color: "#0f172a",

            mb: 4,
          }}
        >
          My Profile
        </Typography>

        <Grid container spacing={5}>
          {/* LEFT SIDEBAR */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 4,

                borderRadius: 5,

                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

                border: "1px solid",
                borderColor: "grey.200",

                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",

                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
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

                    border: "5px solid white",

                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",

                    bgcolor: "white",
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

                <Divider sx={{ width: "100%" }} />

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

                {/* BALANCE CARD */}
                <Box
                  sx={{
                    width: "100%",

                    py: 2,
                    px: 2.5,

                    borderRadius: 3,

                    background:
                      "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",

                    color: "white",

                    textAlign: "center",

                    boxShadow: "0 6px 16px rgba(34,197,94,0.22)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      opacity: 0.8,
                      letterSpacing: 1,
                    }}
                  >
                    CURRENT BALANCE
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mt: 0.5,
                      fontSize: {
                        xs: "1.8rem",
                        md: "2rem",
                      },
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(balance)}
                  </Typography>
                </Box>

                {/* BUTTON */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1,

                    borderRadius: 2.5,

                    fontWeight: 600,

                    textTransform: "none",

                    fontSize: "0.95rem",

                    boxShadow: 2,

                    transition: "0.25s ease",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 5,
                    },
                  }}
                  onClick={() => setIsFundsModalOpen(true)}
                >
                  Add Funds
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* LEFT SIDEBAR */}

          {/* RIGHT CONTENT */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },

                borderRadius: 5,

                border: "1px solid",
                borderColor: "grey.200",

                backgroundColor: "white",

                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",

                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
                },
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  mb: 3,

                  borderBottom: 1,
                  borderColor: "divider",

                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                  },
                }}
              >
                <Tab label="Personal Data" />
                <Tab label="Transaction History" />
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
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </TabPanel>

              {/* TRANSACTION HISTORY */}
              <TabPanel value={tabValue} index={1}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Transaction History
                </Typography>

                <Typography color="text.secondary">
                  Your transaction history will be displayed here.
                </Typography>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <AddFundsModal
        open={isFundsModalOpen}
        onClose={() => setIsFundsModalOpen(false)}
        onAddFunds={handleAddFunds}
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
