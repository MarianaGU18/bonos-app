import { TextField, Button } from "@mui/material";

export function StyledTextField({ sx, ...props }) {
  return (
    <TextField
      fullWidth
      margin="dense"
      variant="outlined"
      required
      sx={{
        mb: 1.5,
        "& .MuiOutlinedInput-root": {
          minHeight: 54,
          borderRadius: "12px",
          bgcolor: "#F8FAFC",
          transition: "background-color 160ms ease, box-shadow 160ms ease",
          "& fieldset": {
            borderColor: "rgba(16,24,32,0.14)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(16,24,32,0.28)",
          },
          "&.Mui-focused": {
            bgcolor: "#FFFFFF",
            boxShadow: "0 0 0 4px rgba(39,181,138,0.14)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#27B58A",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#667382",
          fontWeight: 700,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#17212B",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export function PrimaryButton({ sx, ...props }) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{
        mt: 2,
        mb: 1,
        py: 1.45,
        borderRadius: "12px",
        bgcolor: "#17212B",
        color: "#FFFFFF",
        boxShadow: "0 16px 30px rgba(16,24,32,0.18)",
        "&:hover": {
          bgcolor: "#0B1117",
          boxShadow: "0 18px 36px rgba(16,24,32,0.22)",
        },
        ...sx,
      }}
      {...props}
    />
  );
}
