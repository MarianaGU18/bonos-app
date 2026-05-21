import { Grid, Typography, Paper, Box } from "@mui/material";

export const AboutCards = ({ icon: Icon, value, label }) => (
  <Grid item xs={12} sm={4} md={2}>
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 4,
        bgcolor: "#f8fafc",
        boxShadow: 2,
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 5,
        },
      }}
    >
      <Icon
        sx={{
          fontSize: 40,
          color: "#10b981",
          mb: 1,
        }}
      />
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 800, color: "#0f172a" }}
      >
        {value}
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Paper>
  </Grid>
);
