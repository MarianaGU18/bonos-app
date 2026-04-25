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
    <Container maxWidth="xl">
      <Grid container spacing={4} alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ padding: { xs: 0, md: "0 0 0 100px" } }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Our Story
          </Typography>
          <Box
            sx={{
              borderBottom: "4px solid red",
              width: "50px",
              mb: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: "text.light",
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            consectetur vel dolor id ultrices. Proin a magna at mi pretium
            pulvinar in eu enim. Nulla vel lacus lectus. Donec at venenatis
            augue. Nam vitae purus placerat, hendrerit nisl id, finibus magna.
            Etiam pharetra gravida ornare. Donec sagittis, ipsum in egestas
            egestas, dui lorem sollicitudin justo, ut ullamcorper velit neque eu
            velit. Ut et fringilla elit.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.light",
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            Mauris augue augue, auctor a blandit ac, convallis eget neque.
            Curabitur in ante ante. Nullam laoreet tempus erat at ornare. In
            nisl nisi, dapibus eget facilisis sit amet, commodo quis nibh.
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            alt="Our Story Image"
            width={500}
            height={300}
            priority
            style={{
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 6,
          mb: 8,
          background: "linear-gradient(to right, #E3F2FD, #BBDEFB)",
          py: 8,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Our Global reach
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "text.light",
            fontSize: "1.1rem",
            mb: 2,
          }}
        >
          Our company is a leader in the industry, providing top-notch services
          and products to clients around the world.
        </Typography>
        <Box
          sx={{
            borderBottom: "4px solid red",
            width: "50px",
            mb: 4,
            mx: "auto",
          }}
        />
      </Box>
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
