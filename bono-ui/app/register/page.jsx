"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { StyledTextField, PrimaryButton } from "../components/FormComponents";

const benefits = [
  {
    title: "Save and manage your bonds",
    description: "Keep all your financial assets in one organized place.",
  },
  {
    title: "Track performance over time",
    description: "Visualize your portfolio growth with clear charts.",
  },
  {
    title: "Access financial reports",
    description: "Download detailed statements for your records.",
  },
];

const steps = ["Account Information", "Completed"];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el formulario
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [maternallast, setMaternallast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, lastname, maternallast, email, password);
      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleRegister}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <StyledTextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <StyledTextField
              label="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            <StyledTextField
              label="Maternal Last Name"
              value={maternallast}
              onChange={(e) => setMaternallast(e.target.value)}
              required
            />
            <StyledTextField
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <StyledTextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Register"}
            </PrimaryButton>
          </form>
        );
      case 1:
        return (
          <Box textAlign="center">
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Registration Complete!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Your account has been successfully created.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left side - Benefits */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight={700}>
                Why do you need an account?
              </Typography>

              <List sx={{ mt: 2 }}>
                {benefits.map((benefit) => (
                  <ListItem key={benefit.title} disablePadding sx={{ mb: 3 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                      <CheckCircleIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, fontSize: "1.1rem" }}
                        >
                          {benefit.title}
                        </Typography>
                      }
                      secondary={benefit.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Right side - Form */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {getStepContent(activeStep)}

                {activeStep === 0 && (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        underline="hover"
                        sx={{ color: "secondary.main", fontWeight: 600 }}
                      >
                        Login
                      </Link>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
