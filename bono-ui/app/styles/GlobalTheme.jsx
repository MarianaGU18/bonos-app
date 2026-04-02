'use client';

import { createTheme } from "@mui/material";

//funcion tipo arrow
export const theme = createTheme({
    //paleta de colores de la aplicacion
    palette: {
        primary: {
            main: "#0B3C5D",
            scontrastText: '#FFFFFF',

        },
        secondary: {
            main: "#328CC1",
            contrastText: '#FFFFFF',

        },
        text: {
            primary: '#0B3C5D',
            secondary: '#4A5568',
        },

        background: {
            default: '#F4F6F8',
            paper: '#FFFFFF',
        },
        accent: {
            main: '#D9B310',
        },
        error: {
            main: "#ef4444",
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h4: {
        fontWeight: 700,
        },
        h5: {
        fontWeight: 600,
        },
        h6: {
        fontWeight: 600,
        },
    },
});

