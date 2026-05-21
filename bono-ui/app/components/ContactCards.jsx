import { Grid, Paper, Typography } from "@mui/material";

export const ContactCards = ({ icon: Icon, title }) => (
  <Grid item xs={12} sm={6} md={3} sx={{ mb: 4 }}>
    <Paper
      sx={{
        p: 4,
        borderRadius: 5,
        textAlign: "center",
        bgcolor: "#f8fafc",
        boxShadow: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 5,
        },
      }}
    >
      <Icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
        {title}
      </Typography>
    </Paper>
  </Grid>
);
