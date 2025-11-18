import { useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Stack,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { PaletteMode } from "@mui/material";
import {
  TimelineCalendar,
  TimelineItem,
  TimelineRowGroup,
  TimelineRow,
} from "mq-timeline-calendar/react";
import type { CalendarLocale } from "mq-timeline-calendar/react";
import electriciansData from "./electricians-data.json";

// Define available locales
const locales: Record<string, CalendarLocale> = {
  "en-US": {
    monthsShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    monthsFull: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysFull: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    weekAbbr: "W",
    am: "AM",
    pm: "PM",
  },
  "fi-FI": {
    monthsShort: [
      "Tammi",
      "Helmi",
      "Maalis",
      "Huhti",
      "Touko",
      "Kesä",
      "Heinä",
      "Elo",
      "Syys",
      "Loka",
      "Marras",
      "Joulu",
    ],
    monthsFull: [
      "Tammikuu",
      "Helmikuu",
      "Maaliskuu",
      "Huhtikuu",
      "Toukokuu",
      "Kesäkuu",
      "Heinäkuu",
      "Elokuu",
      "Syyskuu",
      "Lokakuu",
      "Marraskuu",
      "Joulukuu",
    ],
    weekdaysShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    weekdaysFull: [
      "Sunnuntai",
      "Maanantai",
      "Tiistai",
      "Keskiviikko",
      "Torstai",
      "Perjantai",
      "Lauantai",
    ],
    weekAbbr: "Vko",
    am: "AM",
    pm: "PM",
  },
  "es-ES": {
    monthsShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    monthsFull: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    weekdaysFull: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    weekAbbr: "S",
    am: "AM",
    pm: "PM",
  },
  "de-DE": {
    monthsShort: [
      "Jan",
      "Feb",
      "Mär",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],
    monthsFull: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    weekdaysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    weekdaysFull: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    weekAbbr: "W",
    am: "AM",
    pm: "PM",
  },
  "fr-FR": {
    monthsShort: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    monthsFull: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    weekdaysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    weekdaysFull: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    weekAbbr: "S",
    am: "AM",
    pm: "PM",
  },
};

function App() {
  // State for theme mode and selected locale
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const [selectedLocale, setSelectedLocale] = useState<string>("en-US");

  // Create theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#dc004e",
          },
        },
      }),
    [themeMode]
  );

  // Set up timeline date range - from 2024 to 2026
  const startDate = new Date(2024, 0, 1); // January 1, 2024
  const endDate = new Date(2026, 11, 31); // December 31, 2026

  // Helper function to get work order style based on type
  const getWorkOrderStyle = (type: string) => {
    switch (type) {
      case "installation":
        return { bgcolor: themeMode === "dark" ? "#1565c0" : "#1976d2", label: "Installation" };
      case "repair":
        return { bgcolor: themeMode === "dark" ? "#c62828" : "#d32f2f", label: "Repair" };
      case "maintenance":
        return { bgcolor: themeMode === "dark" ? "#2e7d32" : "#388e3c", label: "Maintenance" };
      case "emergency":
        return { bgcolor: themeMode === "dark" ? "#d84315" : "#e64a19", label: "Emergency" };
      case "vacation":
        return { bgcolor: themeMode === "dark" ? "#7b1fa2" : "#9c27b0", label: "Vacation" };
      case "sick":
        return { bgcolor: themeMode === "dark" ? "#616161" : "#757575", label: "Sick Leave" };
      default:
        return { bgcolor: themeMode === "dark" ? "#424242" : "#9e9e9e", label: "Other" };
    }
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  const handleLocaleChange = (event: SelectChangeEvent) => {
    setSelectedLocale(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Electricians Work Order Schedule
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="text.secondary"
              >
                Managing 10 electricians with work orders, vacations, and sick leaves (2024 - 2026)
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  id="theme-select"
                  value={themeMode}
                  label="Theme"
                  onChange={handleThemeChange}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="locale-select-label">Language</InputLabel>
                <Select
                  labelId="locale-select-label"
                  id="locale-select"
                  value={selectedLocale}
                  label="Language"
                  onChange={handleLocaleChange}
                >
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="fi-FI">Suomi (Finnish)</MenuItem>
                  <MenuItem value="es-ES">Español (Spanish)</MenuItem>
                  <MenuItem value="de-DE">Deutsch (German)</MenuItem>
                  <MenuItem value="fr-FR">Français (French)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Paper
            elevation={themeMode ? 1 : 3}
            sx={{ mt: 2, p: 0, height: "600px" }}
          >
            <TimelineCalendar
              startDate={startDate}
              endDate={endDate}
              height="100%"
              minZoom="1000 years" // Maximum time span to display
              maxZoom="100 milliseconds" // Minimum time span to display
              width="100%"
              styles={{
                root: {
                  borderRadius: "4px",
                  border: themeMode === "dark" ? "1px solid" : "none",
                  borderColor: theme.palette.divider,
                },
              }}
              showCurrentTime={true}
              showNavigation={false}
              locale={locales[selectedLocale]}
              theme={{
                colors: {
                  background: themeMode === "dark" ? "#121212" : "#ffffff",
                  gridLine: themeMode === "dark" ? "#424242" : "#e0e0e0",
                  gridLinePrimary: themeMode === "dark" ? "#616161" : "#9e9e9e",
                  headerBackground:
                    themeMode === "dark" ? "#1e1e1e" : "#ffffff",
                  headerText: themeMode === "dark" ? "#e0e0e0" : "#333333",
                  headerBorder: themeMode === "dark" ? "#424242" : "#d0d0d0",
                  currentTimeLine: theme.palette.success.main,
                },
                fonts: {
                  header: "Roboto, sans-serif",
                  content: "Roboto, sans-serif",
                },
              }}
              onViewportChange={(start, end) => {
                console.log("Viewport changed:", start, end);
              }}
              onZoomChange={(pixelsPerMs) => {
                console.log("Zoom level:", pixelsPerMs);
              }}
            >
              <TimelineRowGroup>
                {electriciansData.electricians.map((electrician) => (
                  <TimelineRow
                    key={electrician.id}
                    id={`electrician-${electrician.id}`}
                    label={electrician.name}
                    rowCount={1}
                    collapsible={true}
                    defaultExpanded={true}
                  >
                    {electriciansData.workOrders
                      .filter((order) => order.electricianId === electrician.id)
                      .map((order) => {
                        const style = getWorkOrderStyle(order.type);
                        return (
                          <TimelineItem
                            key={order.id}
                            startTime={order.startTime}
                            duration={order.duration}
                            row={0}
                          >
                            <Box
                              sx={{
                                bgcolor: style.bgcolor,
                                color: "white",
                                p: 1,
                                borderRadius: 1,
                                overflow: "hidden",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                cursor: "pointer",
                                "&:hover": {
                                  opacity: 0.9,
                                },
                              }}
                              title={`${order.title}\n${order.location || ""}\n${order.id}`}
                            >
                              <Typography variant="caption" fontWeight="bold" noWrap>
                                {order.title}
                              </Typography>
                              {order.location && (
                                <Typography variant="caption" noWrap sx={{ opacity: 0.9 }}>
                                  {order.location}
                                </Typography>
                              )}
                            </Box>
                          </TimelineItem>
                        );
                      })}
                  </TimelineRow>
                ))}
              </TimelineRowGroup>
            </TimelineCalendar>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Work Order Legend:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label="Installation"
                sx={{ bgcolor: "#1976d2", color: "white" }}
                size="small"
              />
              <Chip
                label="Repair"
                sx={{ bgcolor: "#d32f2f", color: "white" }}
                size="small"
              />
              <Chip
                label="Maintenance"
                sx={{ bgcolor: "#388e3c", color: "white" }}
                size="small"
              />
              <Chip
                label="Emergency"
                sx={{ bgcolor: "#e64a19", color: "white" }}
                size="small"
              />
              <Chip
                label="Vacation"
                sx={{ bgcolor: "#9c27b0", color: "white" }}
                size="small"
              />
              <Chip
                label="Sick Leave"
                sx={{ bgcolor: "#757575", color: "white" }}
                size="small"
              />
            </Stack>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>10 electricians with individual work schedules</li>
              <li>10,300+ work orders spanning 3 years (2024-2026)</li>
              <li>Constant workload: minimum 3 days per week per electrician</li>
              <li>Multiple order types: Installation, Repair, Maintenance, Emergency</li>
              <li>Realistic scheduling: primarily weekdays 7-17, some weekend work</li>
              <li>33 vacation periods and 16 sick leaves across all staff</li>
              <li>No work scheduled during vacation or sick leave periods</li>
              <li>Scroll horizontally with mouse wheel</li>
              <li>Zoom in/out with Ctrl/Cmd + Mouse wheel</li>
              <li>Collapsible rows for each electrician</li>
              <li>Dark and light theme support</li>
              <li>Multi-language support (5 languages)</li>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
