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
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deepOrange } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

function AccountDetailsTab() {
  const { user, updateUser, authFetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    lastname: "",
    maternallast: "",
    birthdate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Pre-fill the form with the current user data when editing starts
    setFormState({
      name: user?.name ?? "",
      lastname: user?.lastname ?? "",
      maternallast: user?.maternallast ?? "",
      birthdate: user?.birthdate?.split("T")[0] ?? "",
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // No need to reset formState, it will be overwritten on the next edit click.
  };

  const handleSaveClick = async () => {
    try {
      const response = await authFetch(`/auth/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const newUserData = { ...user, ...updatedUser };

        updateUser(newUserData);

        setIsEditing(false);
      } else {
        console.error("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Account Details</Typography>
      <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
        Here you can manage your account information.
      </Typography>

      {!isEditing ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={user?.name ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={user?.lastname ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mother's Last Name"
                value={user?.maternallast ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Birthdate"
                value={user?.birthdate?.split("T")[0] ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={user?.email ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            sx={{ mt: 3 }}
          >
            Edit Profile
          </Button>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                value={formState.name}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastname"
                label="Last Name"
                value={formState.lastname}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="maternallast"
                label="Mother's Last Name"
                value={formState.maternallast}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="birthdate"
                label="Birthdate"
                type="date"
                value={formState.birthdate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={user?.email ?? ""}
                InputProps={{ readOnly: true }}
                variant="filled"
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

function ProfilePageContent() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
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
                {`${user?.name ?? ""} ${user?.lastname ?? ""}`.trim()}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {user?.email}
              </Typography>
              {getRoleChip(user?.role)}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Account Settings" />
                <Tab label="Security" />
                <Tab label="Notifications" disabled />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <AccountDetailsTab />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6">Security Options</Typography>
              <Typography sx={{ mt: 2 }}>
                Here you will be able to change your password and manage
                two-factor authentication (2FA).
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                disabled
                sx={{ mt: 3 }}
              >
                Change Password
              </Button>
              <Alert severity="info" sx={{ mt: 2 }}>
                This functionality will be implemented in a future update.
              </Alert>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function ProtectedProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <ProfilePageContent />;
}

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default ProtectedProfilePage;
