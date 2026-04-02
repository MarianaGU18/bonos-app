import { Grid, Typography } from '@mui/material';

export const AboutCards = ({ icon: Icon, value, label }) => (
  <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: 'center' }}>
    <Icon
      sx={{
        fontSize: 40,
        color: 'text.light',
        mb: 1,
      }}
    />
    <Typography variant='h4' align='center'>
      {value}
    </Typography>
    <Typography variant='subtitle1' align='center' sx={{ color: 'text.light' }}>
      {label}
    </Typography>
  </Grid>
);
