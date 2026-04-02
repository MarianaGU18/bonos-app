

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/GlobalTheme";
import AppBarGlobal from "./components/AppBarGlobal";

//npm install @mui/material-nextjs @emotion/cache @emotion/server
//https://mui.com/material-ui/integrations/nextjs/?srsltid=AfmBOoqB_yMs5rsM9V-g_ET0LEVt_kgIEcRLc9nt-Ue2L_4TqG7gIS8r
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
            <AppBarGlobal />
            {children}
      </ThemeProvider> 
    </body>
  </html>
  );
}