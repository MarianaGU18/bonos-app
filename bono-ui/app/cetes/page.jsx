"use client";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function CetesSelector() {
  const [cete, setCete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dias, setDias] = useState(28);

  const handleChange = (event) => {
    setDias(event.target.value);
  };

  useEffect(() => {
    const fetchCete = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/cetes/precio?dias=${dias}`,
        );
        const data = await response.json();
        setCete(data);
      } catch (error) {
        console.error("Error fetching Cete data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCete();
  }, [dias]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Evaluar Cetes
      </Typography>

      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="dias-label">Plazo</InputLabel>
          <Select
            labelId="dias-label"
            value={dias}
            label="Plazo"
            onChange={handleChange}
          >
            <MenuItem value={28}>28 días</MenuItem>
            <MenuItem value={91}>91 días</MenuItem>
            <MenuItem value={182}>182 días</MenuItem>
            <MenuItem value={364}>364 días</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography sx={{ mt: 2 }}>Seleccionaste: {dias} días</Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {cete && !loading && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">VN: {cete.vn}</Typography>
          <Typography variant="h6">Tasa: {cete.tasa}%</Typography>
          <Typography variant="h6">Plazo: {cete.plazo} días</Typography>
          <Typography variant="h6">Precio: {cete.precio.toFixed(2)}</Typography>
        </Box>
      )}
    </Container>
  );
}
