import { Grid, Paper, Typography } from '@mui/material';

export const ContactCards = ({ icon: Icon, title }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ mb: 4 }}>
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: 'center',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          transform: 'scale(1.05)',
          transition: 'transform 0.4s ease-in-out',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Icon color='primary' fontSize='large' />
      <Typography variant='h6'>{title}</Typography>
    </Paper>
  </Grid>
);
