"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Tabs,
  Tab,
  TextField,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deepOrange } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";

function ProfilePageContent() {
  const { user, updateUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    const formattedBirthdate = user?.birthdate
      ? new Date(user.birthdate).toISOString().split("T")[0]
      : "";
    setEditedUser({ ...user, birthdate: formattedBirthdate });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedUser(null);
  };

  const handleSave = async () => {
    console.log("Saving user data:", editedUser);
    await updateUser(editedUser);
    setIsEditMode(false);
    setEditedUser(null);
    setSnackbar({ open: true, message: "Changes saved successfully." });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const email = user?.email ?? "loading...";
  const role = user?.role ?? "USER";

  const getRoleChip = (role) => {
    switch (role) {
      case "ADMIN":
        return <Chip label="Administrator" color="error" variant="filled" />;
      case "COLABORADOR":
        return <Chip label="Contributor" color="primary" variant="filled" />;
      default:
        return <Chip label="User" color="success" variant="filled" />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 16px",
                  bgcolor: deepOrange[500],
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 90 }} />
              </Avatar>
              <Typography variant="h5" component="div">
                {user?.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {email}
              </Typography>
              {getRoleChip(role)}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="settings tabs"
              >
                <Tab label="Personal Data" />
                <Tab label="Transaction History" disabled />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Your Personal Data</Typography>
                {!isEditMode && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              <Typography sx={{ mt: 2, mb: 3 }} color="text.secondary">
                Manage your personal information here.
              </Typography>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                value={(isEditMode ? editedUser?.name : user?.name) || ""}
                onChange={handleFormChange}
                sx={{ mb: 3 }}
                disabled={!isEditMode}
              />
              <TextField
                label="Last Name"
                name="lastname"
                fullWidth
                value={
                  (isEditMode ? editedUser?.lastname : user?.lastname) || ""
                }
                onChange={handleFormChange}
                sx={{ mb: 3 }}
                disabled={!isEditMode}
              />
              <TextField
                label="Maternal Last Name"
                name="maternallast"
                fullWidth
                value={
                  (isEditMode
                    ? editedUser?.maternallast
                    : user?.maternallast) || ""
                }
                onChange={handleFormChange}
                sx={{ mb: 3 }}
                disabled={!isEditMode}
              />
              <TextField
                label="Date of Birth"
                name="birthdate"
                type="date"
                fullWidth
                value={
                  (isEditMode
                    ? editedUser?.birthdate
                    : user?.birthdate
                      ? new Date(user.birthdate).toISOString().split("T")[0]
                      : "") || ""
                }
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                helperText="We use this to verify you are over 18 years old."
                disabled={!isEditMode}
              />
              {isEditMode && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="text" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}></TabPanel>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}

function ProtectedProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null; // O un spinner de carga
  }

  return <ProfilePageContent />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default ProtectedProfilePage;
