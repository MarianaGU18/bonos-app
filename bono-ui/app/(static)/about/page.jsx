"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { AboutCards } from "../../components/AboutCards";
import SettingsIcon from "@mui/icons-material/Settings";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PublicIcon from "@mui/icons-material/Public";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";

export default function About() {
  return (
    <Container maxWidth="xl" sx={{ pt: 6 }}>
      {/* Mantenemos el contenedor principal con alineación al centro */}
      <Grid container spacing={4} alignItems="center">
        {/* Bloque de Texto (Izquierda) */}
        <Grid
          size={{ xs: 12, md: 6 }}
          // Mantenemos tu padding exacto para lograr la estructura de la imagen
          sx={{ padding: { xs: 0, md: "0 0 0 100px" } }}
        >
          {/* h3 toma la fuente Nunito, peso 800 y tracking de tu tema */}
          <Typography variant="h3" gutterBottom sx={{ color: "text.primary" }}>
            Our Story
          </Typography>

          {/* Línea decorativa roja exacta de tu diseño original */}
          <Box
            sx={{
              borderBottom: "4px solid red",
              width: "50px",
              mb: 4, // Un margen sutil antes del texto como se ve en la captura
            }}
          />

          {/* Usamos 'text.secondary' que mapea a tu color Slate (#64748b) */}
          {/* Dejamos que 'body1' aplique el line-height: 1.7 de tu tema para máxima legibilidad */}
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              mb: 3,
            }}
          >
            Founded with a vision to transform the global technological
            landscape, our journey is defined by continuous innovation and an
            unwavering commitment to excellence. From day one, we have dedicated
            ourselves to developing robust solutions that not only solve our
            clients current challenges but also prepare them for the demands of
            tomorrow.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            Through strategic partnerships and a results-driven approach, we
            have evolved from a local initiative into a trusted benchmark for
            industry leaders, driving sustainable growth across every market we
            touch.
          </Typography>
        </Grid>

        {/* Bloque de Imagen (Derecha) */}
        <Grid
          size={{ xs: 12, md: 6 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Mantenemos el contenedor de la imagen idéntico para no alterar su tamaño ni posición */}
          <Box
            sx={{
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Tu sombra suave exacta de la captura
              borderRadius: "4px", // Bordes rectos/sutiles según se aprecia en la foto
              overflow: "hidden",
              display: "flex",
            }}
          >
            <Image
              src="/about.png"
              alt="Our Story Image"
              width={500}
              height={300}
              priority
              style={{
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Sección Inferior (Banner Global Reach) */}
      {/* Mantenemos tu flujo estructural pero llamando a la paleta centralizada */}
      <Box
        sx={{
          //mt: 8,
          //mb: 8,
          background: (theme) => theme.gradients.dashboard, // Tu gradiente suave del tema
          py: 8,
          borderRadius: "24px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Our Global reach
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
            mb: 2,
          }}
        >
          Connecting markets, optimizing processes, and breaking down borders.
          Supported by our advanced infrastructure and a global team of experts,
          we deliver world-class services to clients around the globe, ensuring
          operational continuity and scalability wherever they need us.
        </Typography>
        {/*<Box
          sx={{
            borderBottom: "4px solid red",
            width: "50px",
            mb: 4,
            mx: "auto",
          }}
        />*/}
      </Box>

      {/* Sección de Tarjetas Métricas */}
      <Grid container spacing={4} justifyContent="center">
        <AboutCards icon={SettingsIcon} value="25k" label="Reliable Services" />
        <AboutCards
          icon={LightbulbIcon}
          value="50+"
          label="Advanced technology"
        />
        <AboutCards
          icon={BusinessIcon}
          value="40M"
          label="Innovative solutions"
        />
        <AboutCards
          icon={HandshakeIcon}
          value="95%"
          label="Trusted by industry leaders"
        />
        <AboutCards icon={GroupIcon} value="100%" label="Customer focus" />
        <AboutCards icon={PublicIcon} value="150" label="Global Presence" />
      </Grid>
    </Container>
  );
}
