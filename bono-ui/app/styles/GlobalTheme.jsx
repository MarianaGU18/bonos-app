"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#0B3C5D",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#1976d2",
      contrastText: "#FFFFFF",
    },

    accent: {
      main: "#D9B310",
    },

    success: {
      main: "#16a34a",
    },

    error: {
      main: "#ef4444",
    },

    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },

    background: {
      default: "#ffffff",

      paper: "#ffffff",

      subtle: "#f8fafc",

      elevated: "#f1f5f9",

      dark: "#0f172a",
    },

    divider: "#e2e8f0",

    border: {
      light: "#e2e8f0",
    },
  },

  typography: {
    fontFamily: "Nunito, sans-serif",

    titleLogo: {
      fontFamily: "Nunito, sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },

    h3: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },

    h4: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    subtitle1: {
      fontWeight: 600,
    },

    body1: {
      lineHeight: 1.7,
    },

    body2: {
      lineHeight: 1.6,
    },

    caption: {
      fontWeight: 700,
      letterSpacing: "0.08em",
    },

    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 16,
  },

  shadows: [
    "none",

    "0 1px 2px rgba(15,23,42,0.04)",

    "0 2px 8px rgba(15,23,42,0.06)",

    "0 6px 18px rgba(15,23,42,0.08)",

    "0 10px 30px rgba(15,23,42,0.10)",

    ...Array(20).fill("0 10px 30px rgba(15,23,42,0.10)"),
  ],

  customShadows: {
    xs: "0 1px 2px rgba(15,23,42,0.04)",

    sm: "0 2px 8px rgba(15,23,42,0.06)",

    md: "0 10px 30px rgba(15,23,42,0.08)",

    lg: "0 20px 45px rgba(15,23,42,0.12)",

    xl: "0 25px 60px rgba(15,23,42,0.16)",

    primary: `
      0 10px 30px rgba(11,60,93,0.18)
    `,
  },

  gradients: {
    primary: `
      linear-gradient(
        135deg,
        #0B3C5D 0%,
        #174B73 100%
      )
    `,

    dashboard: `
      linear-gradient(
        180deg,
        #f8fafc 0%,
        #eef2f7 100%
      )
    `,
  },

  layout: {
    pageX: {
      xs: 2,
      md: 4,
    },

    pageY: 5,

    sectionGap: 4,

    cardPadding: {
      xs: 3,
      md: 5,
    },
  },

  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      variants: [
        {
          props: { variant: "dashboard" },

          style: {
            borderRadius: 24,

            border: "1px solid #e2e8f0",

            backgroundImage: "none",

            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          },
        },

        {
          props: { variant: "section" },

          style: {
            borderRadius: 20,

            border: "1px solid #e2e8f0",

            backgroundImage: "none",
          },
        },
      ],

      styleOverrides: {
        root: {
          borderRadius: 24,

          border: "1px solid #e2e8f0",

          backgroundImage: "none",

          transition: "all 0.25s ease",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,

          paddingTop: 12,

          paddingBottom: 12,

          fontWeight: 700,

          textTransform: "none",

          boxShadow: "0 6px 18px rgba(15,23,42,0.08)",

          transition: "transform 0.25s ease, box-shadow 0.25s ease",

          "&:hover": {
            transform: "translateY(-2px)",

            boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,

          backgroundColor: "#ffffff",

          transition: "all 0.2s ease",

          "&:hover": {
            backgroundColor: "#ffffff",
          },

          "&.Mui-focused": {
            backgroundColor: "#ffffff",
          },
        },

        notchedOutline: {
          borderColor: "#e2e8f0",
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 56,
        },

        indicator: {
          height: 4,

          borderRadius: 999,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",

          fontWeight: 700,

          borderRadius: 12,

          minHeight: 56,

          transition: "all 0.2s ease",

          "&.Mui-selected": {
            backgroundColor: "rgba(11,60,93,0.05)",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          fontWeight: 700,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,

          border: "1px solid #e2e8f0",

          boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e2e8f0",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export { theme };
