import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/GlobalTheme";
import AppBarGlobal from "./components/AppBarGlobal";
import Footer from "./components/Footer";

import ClientAuthProvider from "./context/ClientAuthProvider";

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

          <ClientAuthProvider>
            <AppBarGlobal />
            {children}
            <Footer />
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
