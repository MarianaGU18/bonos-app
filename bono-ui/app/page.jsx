"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mt={10} mb={10}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Invest in Bonds with Confidence and Ease
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Start investing today and grow your money securely.
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/register"
            sx={{ mr: 2 }}
          >
            CREATE AN ACCOUNT
          </Button>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/login"
          >
            SIGN IN
          </Button>
        </Box>
      </Box>

      {/* BENEFITS */}
      <Box mb={10}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Why Invest with Us?
        </Typography>

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">🔒 Security</Typography>
                <Typography color="text.secondary">
                  Your investments are protected and regulated for your peace of
                  mind.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">📈 Returns</Typography>
                <Typography color="text.secondary">
                  Get steady returns with low risk and a promising future.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">⚡ Ease of Use</Typography>
                <Typography color="text.secondary">
                  Invest in minutes from any device, quickly and easily.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* HOW TO START */}
      <Box mb={10}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          How to Start Investing
        </Typography>

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">1. Register</Typography>
                <Typography color="text.secondary">
                  Create your account in just a few minutes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">2. Explore</Typography>
                <Typography color="text.secondary">
                  Discover the available investment options.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">3. Invest</Typography>
                <Typography color="text.secondary">
                  Select a bond and start investing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA FINAL */}
      <Box textAlign="center" mb={10}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Investing?
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/register"
        >
          CREATE AN ACCOUNT NOW
        </Button>
      </Box>
    </Container>
  );
}
