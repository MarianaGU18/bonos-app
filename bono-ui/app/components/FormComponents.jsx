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
          bgcolor: "#EEF3F8",
          transition: "background-color 160ms ease, box-shadow 160ms ease",
          "& fieldset": {
            borderColor: "#D8E3EC",
          },
          "&:hover fieldset": {
            borderColor: "rgba(16,24,32,0.28)",
          },
          "&.Mui-focused": {
            bgcolor: "#FFFFFF",
            boxShadow: "0 0 0 4px rgba(127,179,213,0.14)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#7FB3D5",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#1F2937",
          fontWeight: 700,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#0B1F3A",
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
        bgcolor: "#0B1F3A",
        color: "#FFFFFF",
        boxShadow: "0 16px 30px rgba(16,24,32,0.18)",
        "&:hover": {
          bgcolor: "#0B1F3A",
          boxShadow: "0 18px 36px rgba(16,24,32,0.22)",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

