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

  // Set up timeline date range - full year view
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 11, 31); // December 31, 2025

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
                Timeline Calendar Demo
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="text.secondary"
              >
                Testing mq-timeline-calendar with Material-UI integration
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
                <TimelineRow
                  id="line-a"
                  label="Row 1"
                  rowCount={1}
                  collapsible={true}
                  defaultExpanded={true}
                >
                  <TimelineItem
                    startTime="2025-11-18 08:00"
                    duration="18 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 1</Typography>
                    </Box>
                  </TimelineItem>

                  <TimelineItem
                    startTime="2025-11-19 09:00"
                    duration="18 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 2</Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem
                    startTime="2025-11-20 10:00"
                    duration="18 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 2</Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem
                    startTime="2025-11-21 11:00"
                    duration="22 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 2</Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem
                    startTime="2025-11-22 12:00"
                    duration="6 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 2</Typography>
                    </Box>
                  </TimelineItem>
                  <TimelineItem
                    startTime="2025-11-22 22:00"
                    duration="12 hours"
                    row={0}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">Task 2</Typography>
                    </Box>
                  </TimelineItem>
                </TimelineRow>
              </TimelineRowGroup>
            </TimelineCalendar>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Scroll horizontally with mouse wheel</li>
              <li>Zoom in/out with Ctrl/Cmd + Mouse wheel</li>
              <li>Multiple timeline items across different rows</li>
              <li>Dark and light theme support with instant switching</li>
              <li>Localization support - switch between 5 languages</li>
              <li>Material-UI themed components</li>
              <li>Responsive and smooth animations</li>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
