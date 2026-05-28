"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const fontStack =
  "Inter, Manrope, 'Plus Jakarta Sans', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

let theme = createTheme({
  palette: {
    primary: {
      main: "#17212B",
      light: "#2F3B48",
      dark: "#0B1117",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#45606F",
      light: "#6E8795",
      dark: "#263A45",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#27B58A",
      contrastText: "#07100D",
    },
    success: {
      main: "#22A06B",
    },
    info: {
      main: "#3877D6",
    },
    warning: {
      main: "#C98922",
    },
    error: {
      main: "#E5484D",
    },
    text: {
      primary: "#101820",
      secondary: "#667382",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
      subtle: "#F8FAFC",
      elevated: "#EEF2F6",
      dark: "#101820",
    },
    divider: "rgba(16,24,32,0.10)",
    border: {
      light: "rgba(16,24,32,0.10)",
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
    "0 14px 36px rgba(16,24,32,0.10)",
    ...Array(20).fill("0 18px 44px rgba(16,24,32,0.12)"),
  ],

  customShadows: {
    xs: "0 1px 2px rgba(16,24,32,0.04)",
    sm: "0 5px 16px rgba(16,24,32,0.06)",
    md: "0 14px 34px rgba(16,24,32,0.09)",
    lg: "0 24px 58px rgba(16,24,32,0.13)",
    xl: "0 34px 84px rgba(16,24,32,0.16)",
    primary: "0 16px 34px rgba(23,33,43,0.20)",
  },

  gradients: {
    primary: "linear-gradient(145deg, #2F3B48 0%, #101820 100%)",
    dashboard: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
    mint: "linear-gradient(135deg, rgba(39,181,138,0.16), rgba(56,119,214,0.10))",
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
          backgroundColor: "#F5F7FA",
        },
        body: {
          backgroundColor: "#F5F7FA",
          color: "#101820",
          textRendering: "optimizeLegibility",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::selection": {
          backgroundColor: "rgba(39,181,138,0.24)",
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
          border: "1px solid rgba(16,24,32,0.10)",
          backgroundImage: "none",
          transition: "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(16,24,32,0.10)",
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
            boxShadow: "0 12px 28px rgba(16,24,32,0.10)",
          },
        },
        containedPrimary: {
          backgroundColor: "#17212B",
          "&:hover": {
            backgroundColor: "#0B1117",
          },
        },
        outlined: {
          borderColor: "rgba(16,24,32,0.16)",
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
            boxShadow: "0 0 0 4px rgba(39,181,138,0.14)",
          },
        },
        notchedOutline: {
          borderColor: "rgba(16,24,32,0.14)",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          color: "#667382",
          "&.Mui-focused": {
            color: "#17212B",
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
          color: "#667382",
          fontSize: 12,
          fontWeight: 850,
          textTransform: "uppercase",
          letterSpacing: 0,
          backgroundColor: "#F8FAFC",
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
          backgroundColor: "#17212B",
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
          color: "#667382",
          transition: "background-color 180ms ease, color 180ms ease",
          "&.Mui-selected": {
            color: "#17212B",
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
          borderColor: "rgba(16,24,32,0.10)",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export { theme };
