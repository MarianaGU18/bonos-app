import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/GlobalTheme";
import AppBarGlobal from "./components/AppBarGlobal";
import { AuthProvider } from "./context/AuthContext";
export const metadata = {
  title: "Bonos",
  description: "Bonos Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AuthProvider>
            <AppBarGlobal />
            {children}
          </AuthProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}