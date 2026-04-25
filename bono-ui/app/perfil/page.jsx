"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

export default function Perfil() {
  return (
    <React.Fragment>
      <CssBaseline />

      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          sx={{
            width: 280,
            bgcolor: "primary.main",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/*Perfil*/}
          <Card
            sx={{
              borderRadius: 0,
              boxShadow: "none",
              p: 2,
            }}
          >
            <CardContent sx={{ textAlign: "left" }}>
              <Avatar
                src="/profile.svg"
                alt="Mariana Gomez"
                sx={{
                  mx: "auto",
                  mb: 2,
                  width: 100,
                  height: 100,
                  bgcolor: "secondary.main",
                }}
              >
                U
              </Avatar>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Mariana Gomez
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                admin@gmail.com
              </Typography>

              <Typography variant="body1" mb={3}>
                Aquí puedes poner una pequeña descripción del usuario.
              </Typography>

              <Button variant="contained" fullWidth>
                Editar perfil
              </Button>
            </CardContent>
          </Card>
          <Divider />
        </Box>

        <Box item xs={12} md={9} sx={{ p: 3 }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Panel principal
          </Typography>

          <Typography variant="body1" gutterBottom>
            Aquí puedes configurar los detalles de tu cuenta, cambiar tu
            contraseña y gestionar tus preferencias.
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
}
