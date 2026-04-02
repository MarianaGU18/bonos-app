'use client'

import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const benefits = [
  { title: 'Save and manage your bonds', description: 'Keep all your financial assets in one organized place.' },
  { title: 'Track performance over time', description: 'Visual representations of your portfolio growth.' },
  { title: 'Access financial reports', description: 'Download detailed statements for your records.' },
];

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          
          {/* LOGIN UP */}

          {/* Left side - Benefits */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight={700}>
                Why do you need an account?
              </Typography>

              <List sx={{ mt: 2 }}>
                {benefits.map((benefit) => (
                  <ListItem key={benefit.title} disablePadding sx={{ mb: 3 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <CheckCircleIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
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
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Get Started Now
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your free account today
                  </Typography>
                </Box>

                <form onSubmit={handleRegister}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    required
                    variant="outlined"
                    placeholder="you@example.com"
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                    Submit
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        href="/login"
                        underline="hover"
                        sx={{ color: 'secondary.main', fontWeight: 600 }}
                      >
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}