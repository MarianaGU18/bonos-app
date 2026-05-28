"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const fontStack =
  "Inter, Manrope, 'Plus Jakarta Sans', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

let theme = createTheme({
  palette: {
    primary: {
      main: "#0B1F3A",
      light: "#1D4E89",
      dark: "#0B1F3A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1D4E89",
      light: "#7FB3D5",
      dark: "#0B1F3A",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#7FB3D5",
      contrastText: "#07100D",
    },
    success: {
      main: "#2E8B57",
    },
    info: {
      main: "#1D4E89",
    },
    warning: {
      main: "#7FB3D5",
    },
    error: {
      main: "#E5484D",
    },
    text: {
      primary: "#1F2937",
      secondary: "#1F2937",
    },
    background: {
      default: "#EEF3F8",
      paper: "#FFFFFF",
      subtle: "#EEF3F8",
      elevated: "#EEF3F8",
      dark: "#0B1F3A",
    },
    divider: "#D8E3EC",
    border: {
      light: "#D8E3EC",
    },
  },

  typography: {
    fontFamily: fontStack,
    titleLogo: {
      fontFamily: fontStack,
      fontWeight: 850,
      letterSpacing: 0,
    },
    h1: {
      fontWeight: 900,
      letterSpacing: 0,
      lineHeight: 0.98,
    },
    h2: {
      fontWeight: 900,
      letterSpacing: 0,
      lineHeight: 1.02,
    },
    h3: {
      fontWeight: 850,
      letterSpacing: 0,
      lineHeight: 1.06,
    },
    h4: {
      fontWeight: 850,
      letterSpacing: 0,
      lineHeight: 1.12,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    subtitle1: {
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
    caption: {
      fontWeight: 750,
      letterSpacing: 0,
    },
    button: {
      textTransform: "none",
      fontWeight: 800,
      letterSpacing: 0,
    },
  },

  shape: {
    borderRadius: 14,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(16,24,32,0.04)",
    "0 2px 8px rgba(16,24,32,0.06)",
    "0 8px 22px rgba(16,24,32,0.08)",
    "0 14px 36px rgba(11,31,58,0.10)",
    ...Array(20).fill("0 18px 44px rgba(11,31,58,0.12)"),
  ],

  customShadows: {
    xs: "0 1px 2px rgba(16,24,32,0.04)",
    sm: "0 5px 16px rgba(16,24,32,0.06)",
    md: "0 14px 34px rgba(16,24,32,0.09)",
    lg: "0 24px 58px rgba(16,24,32,0.13)",
    xl: "0 34px 84px rgba(11,31,58,0.16)",
    primary: "0 16px 34px rgba(11,31,58,0.20)",
  },

  gradients: {
    primary: "linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)",
    dashboard: "linear-gradient(180deg, #EEF3F8 0%, #EEF3F8 100%)",
    mint: "linear-gradient(135deg, rgba(127,179,213,0.16), rgba(29,78,137,0.10))",
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
      md: 4,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
          backgroundColor: "#EEF3F8",
        },
        body: {
          backgroundColor: "#EEF3F8",
          color: "#1F2937",
          textRendering: "optimizeLegibility",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::selection": {
          backgroundColor: "rgba(127,179,213,0.24)",
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #D8E3EC",
          backgroundImage: "none",
          transition: "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #D8E3EC",
          backgroundImage: "none",
          boxShadow: "0 14px 34px rgba(16,24,32,0.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 11,
          paddingBottom: 11,
          fontWeight: 800,
          textTransform: "none",
          boxShadow: "none",
          transition: "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(11,31,58,0.10)",
          },
        },
        containedPrimary: {
          backgroundColor: "#0B1F3A",
          "&:hover": {
            backgroundColor: "#0B1F3A",
          },
        },
        outlined: {
          borderColor: "#D8E3EC",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          transition: "background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
          "&:hover": {
            backgroundColor: "#FFFFFF",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 0 4px rgba(127,179,213,0.14)",
          },
        },
        notchedOutline: {
          borderColor: "#D8E3EC",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          color: "#1F2937",
          "&.Mui-focused": {
            color: "#0B1F3A",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(16,24,32,0.08)",
        },
        head: {
          color: "#1F2937",
          fontSize: 12,
          fontWeight: 850,
          textTransform: "uppercase",
          letterSpacing: 0,
          backgroundColor: "#EEF3F8",
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 52,
        },
        indicator: {
          height: 3,
          borderRadius: 999,
          backgroundColor: "#0B1F3A",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 800,
          borderRadius: 10,
          minHeight: 52,
          color: "#1F2937",
          transition: "background-color 180ms ease, color 180ms ease",
          "&.Mui-selected": {
            color: "#0B1F3A",
            backgroundColor: "rgba(16,24,32,0.05)",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 800,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#D8E3EC",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export { theme };

