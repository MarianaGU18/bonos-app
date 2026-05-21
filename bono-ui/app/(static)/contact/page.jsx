import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { socialMedia } from "../../constants/contact";

export default function Contact() {
  return (
    // Usamos el layout.pageY para el espaciado vertical general
    <Container sx={{ py: "layout.pageY" }}>
      <Box>
        {/* variant h3 ya maneja automáticamente Nunito, Bold 800 y letterSpacing */}
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>

        <Box>
          {/* El componente Paper por defecto en tu tema ya tiene elevation: 0, */}
          {/* borderRadius: 24, border: '1px solid #e2e8f0' y transición suave */}
          <Paper
            sx={{
              p: "layout.cardPadding", // Consume tu padding responsivo (xs: 3, md: 5)
              boxShadow: "customShadows.md", // Reemplaza el elevation={3} genérico por tu sombra estilizada
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Contenedor del Mapa */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "350px",
                    overflow: "hidden",
                    borderRadius: "16px", // Ajustado a shape.borderRadius (16) para consistencia
                    boxShadow: "customShadows.sm", // Sombra limpia de tu tema
                    border: "1px solid",
                    borderColor: "divider", // Usa tu color central #e2e8f0 en vez de #DDD
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                    }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5395973650224!2d-99.16766452396346!3d19.426120881850117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c6d2d312953f95c!2sPaseo%20de%20la%20Reforma!5e0!3m2!1ses-419!2smx!4v1716315000000!5m2!1ses-419!2smx&loading=lazy"
                    allowFullScreen=""
                    tabIndex={0}
                  />
                </Box>
              </Grid>

              {/* Contenedor de Información de Contacto */}
              <Grid size={{ xs: 12, md: 5 }}>
                {/* h6 ya cuenta con fontWeight 700 gracias al tema */}
                <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                  Contact Information
                </Typography>

                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ color: "primary.main" }}>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Main Address:"
                      secondary="Av. Paseo de la Reforma, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX, México"
                      slotProps={{
                        primary: {
                          variant: "subtitle1",
                          color: "text.primary",
                        },
                        secondary: {
                          variant: "body2",
                          color: "text.secondary",
                        },
                      }}
                    />
                  </ListItem>

                  <Divider />

                  <ListItem disableGutters>
                    <ListItemIcon sx={{ color: "primary.main" }}>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Address:"
                      secondary="info_bonos@bonos.com"
                      slotProps={{
                        primary: {
                          variant: "subtitle1",
                          color: "text.primary",
                        },
                        secondary: {
                          variant: "body2",
                          color: "text.secondary",
                        },
                      }}
                    />
                  </ListItem>

                  <Divider />

                  <ListItem disableGutters>
                    <ListItemIcon sx={{ color: "primary.main" }}>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number:"
                      secondary="01 234 567 890"
                      slotProps={{
                        primary: {
                          variant: "subtitle1",
                          color: "text.primary",
                        },
                        secondary: {
                          variant: "body2",
                          color: "text.secondary",
                        },
                      }}
                    />
                  </ListItem>
                </List>

                {/* Redes Sociales */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" }, // Centrado en móvil, alineado a la izquierda en escritorio
                    gap: 1,
                  }}
                >
                  {socialMedia.map((media, index) => (
                    <IconButton
                      key={index}
                      color="primary"
                      sx={{
                        transition: "all 0.25s ease", // Sincronizado con el tiempo de tus botones globales
                        "&:hover": {
                          backgroundColor: "rgba(11, 60, 93, 0.08)", // 8% de opacidad de tu color primario en lugar de un azul estático
                          color: media.hoverColor,
                          transform: "translateY(-3px)", // Efecto "float" idéntico a tus botones del tema
                        },
                      }}
                    >
                      <media.icon />
                    </IconButton>
                  ))}
                </Box>

                {/* Botón para abrir en Google Maps */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LocationOnIcon />}
                  href="https://www.google.com/maps/place/Paseo+de+la+Reforma/@19.4261209,-99.1676645,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1ff35f5bd1563:0x6c6d2d312953f95c!8m2!3d19.4261209!4d-99.1650896!16s%2Fg%2F1223t18c?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 3, width: "100%", py: 1.5, borderRadius: 3 }}
                >
                  Abrir en Google Maps
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
