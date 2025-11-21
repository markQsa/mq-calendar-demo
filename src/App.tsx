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
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { PaletteMode } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import {
  TimelineCalendar,
  TimelineItem,
  TimelineRowGroup,
  TimelineRow,
  TimelinePinpoint,
  TimelinePinpointGroup,
  enUS,
  deDE,
  frFR,
  esES,
  itIT,
  fiFI,
  svSE,
  noNO,
  daDK,
  nlNL,
  ptPT,
  plPL,
  ruRU,
} from "mq-timeline-calendar/react";
import type { CalendarLocale } from "mq-timeline-calendar/react";
import electriciansData from "./electricians-data.json";
import notificationsData from "./notifications-data.json";
import logo from "./assets/logo.svg";

// Use built-in locales from the library
const locales: Record<string, CalendarLocale> = {
  "en-US": enUS,
  "de-DE": deDE,
  "fr-FR": frFR,
  "es-ES": esES,
  "it-IT": itIT,
  "fi-FI": fiFI,
  "sv-SE": svSE,
  "no-NO": noNO,
  "da-DK": daDK,
  "nl-NL": nlNL,
  "pt-PT": ptPT,
  "pl-PL": plPL,
  "ru-RU": ruRU,
};

// Notification types mapping with icons and colors
const notificationTypesMap: Record<string, { icon: typeof NotificationsIcon; color: string; label: string }> = {
  notification: { icon: NotificationsIcon, color: "#2196f3", label: "General Notification" },
  warning: { icon: WarningIcon, color: "#ff9800", label: "Warning" },
  info: { icon: InfoIcon, color: "#03a9f4", label: "Information" },
  success: { icon: CheckCircleIcon, color: "#4caf50", label: "Success" },
  error: { icon: ErrorIcon, color: "#f44336", label: "Error" },
  announcement: { icon: AnnouncementIcon, color: "#9c27b0", label: "Announcement" },
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

  // Set up timeline date range - memoized to prevent re-creation on every render
  const startDate = useMemo(() => new Date(2024, 0, 1), []);
  const endDate = useMemo(() => new Date(2026, 11, 31), []);

  // Define availability hours: 7:00-17:00 on weekdays (Mon-Fri)
  const availabilityConfig = {
    simple: {
      weekdays: [{ start: "07:00", end: "17:00" }],
      weekends: [], // No availability on weekends
    },
    availableStyle: {
      backgroundColor: themeMode === "dark"
        ? "rgba(76, 175, 80, 0.05)"
        : "rgba(76, 175, 80, 0.03)",
    },
    unavailableStyle: {
      backgroundColor: themeMode === "dark"
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(0, 0, 0, 0.05)",
    },
  };

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

  // Helper function for aggregated type styles (for aggregated view bars)
  const getAggregatedTypeStyle = (type: string) => {
    const style = getWorkOrderStyle(type);
    return {
      backgroundColor: style.bgcolor,
      color: "white"
    };
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="MQ Timeline Calendar Logo"
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography variant="h4" component="h1">
                  Electricians Work Order Schedule
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Managing 10 electricians with work orders, vacations, and sick leaves (2024-2026)
                </Typography>
              </Box>
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
                  <MenuItem value="de-DE">Deutsch (German)</MenuItem>
                  <MenuItem value="fr-FR">Français (French)</MenuItem>
                  <MenuItem value="es-ES">Español (Spanish)</MenuItem>
                  <MenuItem value="it-IT">Italiano (Italian)</MenuItem>
                  <MenuItem value="fi-FI">Suomi (Finnish)</MenuItem>
                  <MenuItem value="sv-SE">Svenska (Swedish)</MenuItem>
                  <MenuItem value="no-NO">Norsk (Norwegian)</MenuItem>
                  <MenuItem value="da-DK">Dansk (Danish)</MenuItem>
                  <MenuItem value="nl-NL">Nederlands (Dutch)</MenuItem>
                  <MenuItem value="pt-PT">Português (Portuguese)</MenuItem>
                  <MenuItem value="pl-PL">Polski (Polish)</MenuItem>
                  <MenuItem value="ru-RU">Русский (Russian)</MenuItem>
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
              minZoom="5 years" // Maximum time span to display
              maxZoom="3 hours" // Minimum time span to display
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
              currentTimeLineWidth={1}
              locale={locales[selectedLocale]}
              availability={availabilityConfig}
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
                {/* Notification Row */}
                <TimelineRow
                  id="notifications"
                  label=""
                  rowCount={1}
                  collapsible={false}
                >
                  <TimelinePinpointGroup clusterSize={32} pinpointLineLength={40} row={0}>
                    {notificationsData.notifications.map((notification) => {
                      const typeInfo = notificationTypesMap[notification.type];
                      const IconComponent = typeInfo.icon;
                      return (
                        <TimelinePinpoint
                          key={notification.id}
                          id={notification.id}
                          time={notification.time}
                          color={typeInfo.color}
                          size={32}
                          lineLength={40}
                          alignment="top"
                          onClick={(timestamp, data) => {
                            console.log("Notification clicked:", data);
                          }}
                          data={notification}
                        >
                          <Tooltip
                            title={
                              <Box>
                                <Typography variant="caption" fontWeight="bold">
                                  {typeInfo.label}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {notification.message}
                                </Typography>
                              </Box>
                            }
                            arrow
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: typeInfo.color,
                                borderRadius: "50%",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                  transition: "transform 0.2s",
                                },
                              }}
                            >
                              <IconComponent
                                sx={{
                                  color: "white",
                                  fontSize: 18,
                                }}
                              />
                            </Box>
                          </Tooltip>
                        </TimelinePinpoint>
                      );
                    })}
                  </TimelinePinpointGroup>
                </TimelineRow>

                {electriciansData.electricians.map((electrician) => (
                  <TimelineRow
                    key={electrician.id}
                    id={`electrician-${electrician.id}`}
                    label={electrician.name}
                    rowCount={1}

                    collapsible={true}
                    defaultExpanded={true}
                    aggregation={{
                      enabled: true,
                      threshold: "2 months",
                      granularity: "dynamic",
                      minItemsForAggregation: 50
                    }}
                    getAggregatedTypeStyle={getAggregatedTypeStyle}
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
                            draggable={true}
                            type={order.type}
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
              How to Navigate:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li><strong>Scroll horizontally:</strong> Use mouse wheel or trackpad (hold Shift if page has vertical scroll)</li>
              <li><strong>Zoom in/out:</strong> Hold Ctrl (Windows) or Cmd (Mac) + mouse wheel</li>
              <li><strong>Navigate by time:</strong> Click on time headers (day, week, month, etc.) to jump to that time period</li>
              <li><strong>Expand/collapse rows:</strong> Click on electrician names</li>
              <li><strong>View details:</strong> Hover over work order bars to see information</li>
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>10 electricians with individual work schedules</li>
              <li>10,300+ work orders spanning 3 years (2024-2026)</li>
              <li>Smart aggregation: Switches to summary view when viewing 2+ months</li>
              <li>Multiple order types: Installation, Repair, Maintenance, Emergency</li>
              <li>Realistic scheduling: primarily weekdays 7-17, some weekend work</li>
              <li>33 vacation periods and 16 sick leaves across all staff</li>
              <li>Visual availability hours: 7:00-17:00 on weekdays (Mon-Fri)</li>
              <li>Collapsible rows for each electrician</li>
              <li>Notification pinpoints: {notificationsData.notifications.length} notifications with 6 different icon types</li>
              <li>Interactive notifications with tooltips and click events</li>
              <li>Automatic clustering of notifications when zoomed out</li>
              <li>Dark and light theme support</li>
              <li>Multi-language support (13 languages)</li>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
