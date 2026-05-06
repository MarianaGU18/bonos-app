import { TextField, Button } from "@mui/material";

export function StyledTextField(props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      required
      {...props}
    />
  );
}

export function PrimaryButton(props) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{ mt: 3, mb: 2, py: 1.5 }}
      {...props}
    />
  );
}
