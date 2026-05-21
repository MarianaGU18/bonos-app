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
  Stepper,
  Step,
  StepLabel,
  Container,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

import { StyledTextField, PrimaryButton } from "../components/FormComponents";

const benefits = [
  {
    title: "Save and manage your bonds",
    description: "Keep all your financial assets in one organized place.",
    icon: <ShieldOutlinedIcon />,
  },
  {
    title: "Track performance over time",
    description: "Visualize your portfolio growth with clear charts.",
    icon: <TrendingUpIcon />,
  },
  {
    title: "Access financial reports",
    description: "Download detailed statements for your records.",
    icon: <InsightsOutlinedIcon />,
  },
];

const steps = ["Account Information", "Completed"];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [maternallast, setMaternallast] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = () => setActiveStep((p) => p + 1);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        lastname,
        maternallast,
        birthdate,
        email,
        password,
      });

      handleNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",

        background: `
          radial-gradient(circle at top left, rgba(25,118,210,0.08), transparent 20%),
          radial-gradient(circle at bottom right, rgba(15,23,42,0.06), transparent 25%),
          ${theme.palette.background.default}
        `,
      })}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6} alignItems="center">
          {/* LEFT SIDE */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: 800,
                color: theme.palette.text.primary,
                mb: 2,
                lineHeight: 1.1,
              })}
            >
              Start building your investment portfolio.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 5, maxWidth: 500 }}
            >
              Join Bonos and manage your CETES, fixed income assets, and
              portfolio analytics in one secure platform.
            </Typography>

            <Stack spacing={3}>
              {benefits.map((b) => (
                <Card
                  key={b.title}
                  elevation={0}
                  sx={(theme) => ({
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: "background.subtle",
                    transition: "all 0.2s ease",

                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: theme.shadows[3],
                    },
                  })}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(25,118,210,0.12)",
                          color: "primary.main",
                        }}
                      >
                        {b.icon}
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            mb: 0.5,
                          }}
                        >
                          {b.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {b.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={(theme) => ({
                borderRadius: 5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
                backdropFilter: "blur(10px)",
                transition: "all 0.25s ease",

                "&:hover": {
                  boxShadow: theme.shadows[4],
                },
              })}
            >
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "text.primary",
                      mb: 1,
                    }}
                  >
                    Create Account
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Get started with your financial dashboard
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* NO TOCO FORM NI LÓGICA */}
                {activeStep === 0 ? (
                  <form onSubmit={handleRegister}>
                    {error && (
                      <Box
                        sx={{
                          mb: 3,
                        }}
                      >
                        <Typography color="error.main">{error}</Typography>
                      </Box>
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
                      label="Date of Birth"
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />

                    <StyledTextField
                      label="Email Address"
                      type="email"
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

                    <Box sx={{ mt: 3 }}>
                      <PrimaryButton type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Create Account"}
                      </PrimaryButton>
                    </Box>
                  </form>
                ) : (
                  <Box textAlign="center" py={3}>
                    <CheckCircleIcon
                      sx={{ fontSize: 72, color: "success.main", mb: 2 }}
                    />

                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      Registration Complete
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() => router.push("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
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
