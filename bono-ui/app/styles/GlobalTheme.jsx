'use client';

import { createTheme } from "@mui/material";

//funcion tipo arrow
/*export const theme = createTheme({
    //paleta de colores de la aplicacion

    titleStyle : {
        fontFamily: "Poppins,sans-serif",
        fontWeight: 700,
        letterSpacing: "0.2rem",
    },*/

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0B3C5D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#d6e2ea",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#0B3C5D",
      secondary: "#4A5568",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    accent: {
            main: '#D9B310',
        },
    error: {
      main: "#ef4444",
    },
  },

  typography: {
    fontFamily: "Nunito, sans-serif",

    // estilo personalizado para tu logo/título
    titleLogo: {
      fontFamily: "Nunito, sans-serif",
      fontWeight: 800,
      letterSpacing: "0.05rem",
    },

    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
});
