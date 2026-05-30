"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";

const colors = {
  ink: "#0B1F3A",
  graphite: "#1D4E89",
  muted: "#1F2937",
  soft: "#EEF3F8",
  panel: "#FFFFFF",
  line: "#D8E3EC",
  green: "#2E8B57",
  teal: "#7FB3D5",
  amber: "#7FB3D5",
  blue: "#1D4E89",
};

const heroMetrics = [
  { label: "Cartera monitoreada", value: "$1.29M" },
  { label: "Rendimiento YTD", value: "6.45%" },
  { label: "Bonos activos", value: "18" },
];

const signalRows = [
  { label: "CETES 28", rate: "10.82%", move: "+0.18" },
  { label: "CETES 91", rate: "10.64%", move: "+0.11" },
  { label: "Liquidez", rate: "Alta", move: "T+0" },
];

const valueItems = [
  {
    title: "Claridad antes de ejecutar",
    body: "Rendimiento, plazo, liquidez y exposicion conviven en una lectura unica para tomar decisiones sin saltar entre pantallas.",
    icon: <QueryStatsOutlinedIcon />,
  },
  {
    title: "Operacion guiada",
    body: "El flujo de compra, venta y seguimiento prioriza lo que el usuario necesita revisar antes de comprometer capital.",
    icon: <CompareArrowsOutlinedIcon />,
  },
  {
    title: "Cartera viva",
    body: "Saldos, instrumentos y movimientos se presentan como una mesa de control continua, no como reportes aislados.",
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
];

const modules = [
  {
    eyebrow: "Mercado",
    title: "Valuacion CETES",
    body: "Calcula precios y rendimiento usando referencias de mercado para comparar oportunidades por plazo.",
    icon: <AutoGraphOutlinedIcon />,
    accent: colors.blue,
  },
  {
    eyebrow: "Portafolio",
    title: "Balance y efectivo",
    body: "Revisa capital disponible, posicion invertida y valor total sin perder contexto de movimiento.",
    icon: <AccountBalanceWalletOutlinedIcon />,
    accent: colors.green,
  },
  {
    eyebrow: "Analitica",
    title: "Evolucion visual",
    body: "Entiende el comportamiento de la cartera por periodos y detecta cambios relevantes con rapidez.",
    icon: <InsightsOutlinedIcon />,
    accent: colors.teal,
  },
  {
    eyebrow: "Control",
    title: "Riesgo y vencimientos",
    body: "Organiza vencimientos, liquidez y exposicion por plazo para mantener una estrategia disciplinada.",
    icon: <ShieldOutlinedIcon />,
    accent: colors.amber,
  },
];

const trustItems = [
  ["Acceso protegido", "Autenticacion y rutas privadas para cuidar la informacion de inversion."],
  ["Trazabilidad", "Movimientos y transacciones vinculados a la cartera del usuario."],
  ["Escalable", "Arquitectura preparada para sumar nuevos instrumentos de renta fija."],
];

function SectionHeader({ eyebrow, title, body, align = "left", maxWidth = 760 }) {
  return (
    <Box
      sx={{
        maxWidth,
        mx: align === "center" ? "auto" : 0,
        textAlign: align,
      }}
    >
      <Typography
        sx={{
          color: colors.teal,
          fontSize: 12,
          fontWeight: 850,
          letterSpacing: 0,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h2"
        sx={{
          mt: 1.4,
          color: colors.ink,
          fontSize: { xs: 34, md: 50 },
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        {title}
      </Typography>
      {body && (
        <Typography
          sx={{
            mt: 2,
            color: colors.muted,
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.7,
          }}
        >
          {body}
        </Typography>
      )}
    </Box>
  );
}

function DashboardPreview() {
  return (
    <Box
      sx={{
        width: "min(100%, 560px)",
        ml: { lg: "auto" },
        p: { xs: 1.2, sm: 1.5 },
        borderRadius: "18px",
        bgcolor: "rgba(255,255,255,0.76)",
        border: "1px solid rgba(255,255,255,0.58)",
        boxShadow: "0 30px 80px rgba(17,24,32,0.24)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Box
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "#0B1F3A",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 2,
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <Box>
            <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>
              Mesa de cartera
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: { xs: 27, sm: 34 }, lineHeight: 1, fontWeight: 900 }}>
              $1,295,000
            </Typography>
          </Box>
          <Chip
            label="+2.84% hoy"
            sx={{
              height: 30,
              borderRadius: "12px",
              color: "#D7F8EA",
              bgcolor: "rgba(36,160,111,0.18)",
              border: "1px solid rgba(36,160,111,0.34)",
              fontWeight: 850,
            }}
          />
        </Stack>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              height: 182,
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
              bgcolor: "#16202B",
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
              `,
              backgroundSize: "42px 42px",
            }}
          >
            {[32, 58, 44, 78, 66, 96, 86, 124, 112].map((height, index) => (
              <Box
                key={height + index}
                sx={{
                  position: "absolute",
                  left: `${8 + index * 10}%`,
                  bottom: 26,
                  width: { xs: 12, sm: 16 },
                  height,
                  borderRadius: "4px 4px 0 0",
                  bgcolor: index % 3 === 0 ? colors.teal : index % 3 === 1 ? colors.green : colors.blue,
                  opacity: 0.86,
                }}
              />
            ))}
            <Box
              sx={{
                position: "absolute",
                left: "8%",
                right: "8%",
                top: "34%",
                height: 2,
                bgcolor: "#F5CF79",
                transform: "skewY(-7deg)",
              }}
            />
          </Box>

          <Box
            sx={{
              mt: 1.4,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 1,
            }}
          >
            {heroMetrics.map((metric) => (
              <Box
                key={metric.label}
                sx={{
                  p: 1.4,
                  borderRadius: "12px",
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minHeight: 82,
                }}
              >
                <Typography sx={{ color: "rgba(255,255,255,0.52)", fontSize: 12 }}>
                  {metric.label}
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#fff", fontSize: 22, fontWeight: 900 }}>
                  {metric.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function SignalStrip() {
  return (
    <Box
      sx={{
        mx: { xs: 2, md: 4 },
        mt: { xs: -3, md: -5 },
        position: "relative",
        zIndex: 3,
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr repeat(3, 1fr)" },
            borderRadius: "18px",
            border: `1px solid ${colors.line}`,
            bgcolor: "rgba(255,255,255,0.92)",
            boxShadow: "0 22px 55px rgba(17,24,32,0.10)",
            overflow: "hidden",
            backdropFilter: "blur(16px)",
          }}
        >
          <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#0B1F3A", color: "#fff" }}>
            <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.62)" }}>
              Senales para decidir
            </Typography>
            <Typography sx={{ mt: 0.8, fontWeight: 900, fontSize: 24, lineHeight: 1.1 }}>
              Rendimiento, plazo y liquidez en primer plano.
            </Typography>
          </Box>
          {signalRows.map((row) => (
            <Box
              key={row.label}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderLeft: { md: `1px solid ${colors.line}` },
                borderTop: { xs: `1px solid ${colors.line}`, md: 0 },
              }}
            >
              <Typography sx={{ color: colors.muted, fontSize: 13, fontWeight: 750 }}>
                {row.label}
              </Typography>
              <Stack direction="row" alignItems="end" spacing={1.2} sx={{ mt: 1 }}>
                <Typography sx={{ color: colors.ink, fontSize: 31, lineHeight: 1, fontWeight: 900 }}>
                  {row.rate}
                </Typography>
                <Typography sx={{ color: colors.green, fontSize: 13, fontWeight: 850 }}>
                  {row.move}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.soft,
        color: colors.ink,
        overflow: "hidden",
      }}
    >
      <Box
        id="inicio"
        sx={{
          position: "relative",
          minHeight: { xs: "880px", md: "760px", lg: "min(900px, 100vh)" },
          display: "flex",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <Image
          src="/about.png"
          alt="Mesa de analisis financiero en Mexico"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(90deg, rgba(8,12,16,0.92) 0%, rgba(8,12,16,0.76) 42%, rgba(8,12,16,0.34) 100%),
              linear-gradient(180deg, rgba(8,12,16,0.34) 0%, rgba(8,12,16,0.24) 64%, rgba(246,247,249,1) 100%)
            `,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, pt: { xs: 14, md: 12 }, pb: { xs: 11, md: 12 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.95fr 1.05fr" },
              gap: { xs: 5, lg: 7 },
              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                label="Fixed income operating system"
                sx={{
                  mb: 2.6,
                  height: 32,
                  borderRadius: "12px",
                  color: "#EEF3F8",
                  bgcolor: "rgba(36,160,111,0.18)",
                  border: "1px solid rgba(36,160,111,0.36)",
                  fontWeight: 850,
                }}
              />
              <Typography
                component="h1"
                sx={{
                  maxWidth: 780,
                  fontSize: { xs: 46, sm: 64, md: 82 },
                  lineHeight: 0.94,
                  fontWeight: 950,
                  letterSpacing: 0,
                }}
              >
                Renta fija con lectura institucional.
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 620,
                  color: "rgba(255,255,255,0.76)",
                  fontSize: { xs: 17, md: 20 },
                  lineHeight: 1.65,
                }}
              >
                NeoInvest centraliza analisis, operacion y seguimiento
                de bonos para que cada decision tenga contexto, disciplina y
                velocidad.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 4 }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 3,
                    py: 1.35,
                    borderRadius: "12px",
                    bgcolor: "#fff",
                    color: colors.ink,
                    boxShadow: "0 20px 45px rgba(0,0,0,0.24)",
                    "&:hover": { bgcolor: "#EEF2F5" },
                  }}
                >
                  Crear cuenta
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  endIcon={<KeyboardArrowRightIcon />}
                  sx={{
                    px: 3,
                    py: 1.35,
                    borderRadius: "12px",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.34)",
                    bgcolor: "rgba(255,255,255,0.08)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.58)",
                      bgcolor: "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  Entrar
                </Button>
              </Stack>
            </Box>

            <DashboardPreview />
          </Box>
        </Container>
      </Box>

      <SignalStrip />

      <Container maxWidth="xl">
        <Box
          id="valor"
          sx={{
            py: { xs: 9, md: 13 },
            scrollMarginTop: "110px",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.82fr 1.18fr" },
            gap: { xs: 4, lg: 7 },
            alignItems: "start",
          }}
        >
          <SectionHeader
            eyebrow="Valor del producto"
            title="De datos dispersos a una decision clara."
            body="La pagina ahora prioriza el recorrido real de un usuario nuevo: entender que hace la plataforma, ver como reduce friccion y encontrar rapidamente el camino para entrar o registrarse."
          />

          <Box sx={{ display: "grid", gap: 1.4 }}>
            {valueItems.map((item, index) => (
              <Paper
                key={item.title}
                sx={{
                  p: { xs: 2.4, md: 3 },
                  borderRadius: "18px",
                  border: `1px solid ${colors.line}`,
                  bgcolor: index === 0 ? colors.ink : colors.panel,
                  color: index === 0 ? "#fff" : colors.ink,
                  boxShadow: index === 0 ? "0 24px 55px rgba(17,24,32,0.18)" : "none",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2.2} alignItems={{ sm: "flex-start" }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      flex: "0 0 auto",
                      color: index === 0 ? "#EEF3F8" : colors.green,
                      bgcolor: index === 0 ? "rgba(255,255,255,0.08)" : "rgba(36,160,111,0.10)",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 900, letterSpacing: 0 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.9,
                        color: index === 0 ? "rgba(255,255,255,0.66)" : colors.muted,
                        lineHeight: 1.7,
                      }}
                    >
                      {item.body}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box
          id="modulos"
          sx={{
            py: { xs: 8, md: 12 },
            scrollMarginTop: "110px",
          }}
        >
          <SectionHeader
            eyebrow="Funcionalidades"
            title="Modulos ordenados por tarea, no por menu."
            body="El usuario entiende primero que puede analizar, operar, monitorear y controlar. Despues decide a que pantalla entrar."
            align="center"
          />

          <Box
            sx={{
              mt: { xs: 4, md: 6 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 1.5,
            }}
          >
            {modules.map((item) => (
              <Paper
                key={item.title}
                sx={{
                  p: 2.6,
                  minHeight: 275,
                  borderRadius: "18px",
                  border: `1px solid ${colors.line}`,
                  bgcolor: colors.panel,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 18px 42px rgba(17,24,32,0.05)",
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    color: item.accent,
                    bgcolor: `${item.accent}14`,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ mt: 3, color: item.accent, fontSize: 12, fontWeight: 850, textTransform: "uppercase" }}>
                  {item.eyebrow}
                </Typography>
                <Typography sx={{ mt: 0.8, color: colors.ink, fontSize: 23, lineHeight: 1.08, fontWeight: 900 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ mt: 1.4, color: colors.muted, lineHeight: 1.65 }}>
                  {item.body}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box
          id="confianza"
          sx={{
            py: { xs: 8, md: 12 },
            scrollMarginTop: "110px",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
            gap: { xs: 4, lg: 7 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              minHeight: { xs: 430, md: 520 },
              borderRadius: "18px",
              overflow: "hidden",
              position: "relative",
              bgcolor: colors.ink,
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 28px 70px rgba(17,24,32,0.18)",
            }}
          >
            <Image
              src="/about.png"
              alt="Pantallas con analitica financiera"
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(17,24,32,0.10) 0%, rgba(17,24,32,0.74) 100%)",
              }}
            />
            <Box sx={{ position: "absolute", left: { xs: 18, md: 28 }, right: { xs: 18, md: 28 }, bottom: { xs: 18, md: 28 } }}>
              <Box
                sx={{
                  p: { xs: 2.2, md: 2.8 },
                  maxWidth: 510,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <SpeedOutlinedIcon sx={{ color: "#EEF3F8" }} />
                  <Typography sx={{ fontWeight: 900 }}>Lectura rapida, criterio profundo</Typography>
                </Stack>
                <Typography sx={{ mt: 1.2, color: "rgba(255,255,255,0.70)", lineHeight: 1.65 }}>
                  La interfaz reduce ruido visual y conserva los indicadores que sostienen una decision financiera.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <SectionHeader
              eyebrow="Confianza"
              title="Controles visibles para operar con tranquilidad."
              body="La confianza no depende de llenar la pantalla de mensajes. Depende de mostrar seguridad, trazabilidad y estado justo donde el usuario decide."
            />
            <Stack spacing={1.2} sx={{ mt: 3.5 }}>
              {trustItems.map(([title, body]) => (
                <Box
                  key={title}
                  sx={{
                    p: 2,
                    borderRadius: "18px",
                    bgcolor: "#fff",
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  <Stack direction="row" spacing={1.3} alignItems="flex-start">
                    <CheckCircleOutlineIcon sx={{ mt: 0.2, color: colors.green, fontSize: 22 }} />
                    <Box>
                      <Typography sx={{ color: colors.ink, fontWeight: 900 }}>{title}</Typography>
                      <Typography sx={{ mt: 0.4, color: colors.muted, fontSize: 14, lineHeight: 1.55 }}>
                        {body}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          id="operacion"
          sx={{
            py: { xs: 8, md: 12 },
            scrollMarginTop: "110px",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "18px",
              bgcolor: colors.ink,
              color: "#fff",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "0.92fr 1.08fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Box>
              <Typography sx={{ color: "#EEF3F8", fontSize: 12, fontWeight: 850, textTransform: "uppercase" }}>
                Operacion en Mexico
              </Typography>
              <Typography sx={{ mt: 1.4, maxWidth: 620, fontSize: { xs: 33, md: 49 }, lineHeight: 1.03, fontWeight: 900 }}>
                Plataforma digital para inversionistas que necesitan orden.
              </Typography>
              <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.68)", fontSize: 17, lineHeight: 1.72 }}>
                Operacion remota, soporte centralizado y una base preparada para
                instrumentos gubernamentales y corporativos.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.2,
              }}
            >
              {[
                [<LocationOnOutlinedIcon key="location" />, "Mexico", "Seguimiento remoto"],
                [<ShieldOutlinedIcon key="shield" />, "Seguridad", "Rutas protegidas"],
                [<LockOutlinedIcon key="lock" />, "Custodia", "Transparencia visual"],
              ].map(([icon, title, body]) => (
                <Box
                  key={title}
                  sx={{
                    p: 2.2,
                    minHeight: 150,
                    borderRadius: "18px",
                    bgcolor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <Box sx={{ color: "#EEF3F8", display: "grid", placeItems: "center", width: 34, height: 34 }}>
                    {icon}
                  </Box>
                  <Typography sx={{ mt: 2, color: "#fff", fontWeight: 900 }}>{title}</Typography>
                  <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.58)", fontSize: 13 }}>
                    {body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: "center",
          }}
        >
          <SectionHeader
            eyebrow="Siguiente paso"
            title="Convierte tu cartera en un sistema de decisiones."
            body="Empieza con una cuenta o entra directamente a tu dashboard si ya formas parte de NeoInvest."
            align="center"
            maxWidth={820}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 3.2,
                py: 1.35,
                borderRadius: "12px",
                bgcolor: colors.ink,
                color: "#fff",
                "&:hover": { bgcolor: colors.graphite },
              }}
            >
              Crear cuenta
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              sx={{
                px: 3.2,
                py: 1.35,
                borderRadius: "12px",
                color: colors.graphite,
                borderColor: colors.line,
                bgcolor: "#fff",
              }}
            >
              Ya tengo acceso
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}


