import { useState, useMemo, useEffect } from "react";
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
  Avatar,
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
import { addDays, differenceInDays, differenceInCalendarDays, format } from "date-fns";

// TypeScript types and interfaces
type ZoomLevel = 'year' | 'month' | 'week' | 'day';
type TimeContext = 'past' | 'future' | 'mixed';

interface WorkTypeDistribution {
  installation: number;
  repair: number;
  maintenance: number;
  emergency: number;
}

interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
}

interface ElectricianMetrics {
  totalHours: number;
  utilizationPercent: number;
  workTypeDistribution: WorkTypeDistribution;
  pastHours: number;
  futureHours: number;
  topWorkType: { type: string; percent: number };
  // Viewport-aware metrics
  timeContext: TimeContext;
  viewportHours: number;
  viewportFreeHours: number;
  viewportUtilization: number;
  nextFreeSlot: Date | null;
  isOverloaded: boolean;
  upcomingVacations: VacationPeriod[];
}

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

// Localized metrics labels
const metricsLabels: Record<string, {
  scheduled: string;
  available: string;
  completed: string;
  utilization: string;
  work: string;
  mainly: string;
  nextFree: string;
  upcoming: string;
  vacation: string;
  days: string;
  installation: string;
  repair: string;
  maintenance: string;
  emergency: string;
}> = {
  "en-US": {
    scheduled: "Scheduled",
    available: "Available",
    completed: "Completed",
    utilization: "Utilization",
    work: "work",
    mainly: "Mainly",
    nextFree: "Next available",
    upcoming: "Upcoming",
    vacation: "On leave",
    days: "days",
    installation: "installations",
    repair: "repairs",
    maintenance: "maintenance",
    emergency: "emergencies"
  },
  "de-DE": {
    scheduled: "Geplant",
    available: "Verfügbar",
    completed: "Erledigt",
    utilization: "Auslastung",
    work: "Arbeit",
    mainly: "Hauptsächlich",
    nextFree: "Nächste frei",
    upcoming: "Kommend",
    vacation: "Im Urlaub",
    days: "Tage",
    installation: "Installationen",
    repair: "Reparaturen",
    maintenance: "Wartungen",
    emergency: "Notfälle"
  },
  "fr-FR": {
    scheduled: "Planifié",
    available: "Disponible",
    completed: "Terminé",
    utilization: "Taux d'utilisation",
    work: "travail",
    mainly: "Principalement",
    nextFree: "Prochaine disponibilité",
    upcoming: "À venir",
    vacation: "En congé",
    days: "jours",
    installation: "installations",
    repair: "réparations",
    maintenance: "maintenance",
    emergency: "urgences"
  },
  "es-ES": {
    scheduled: "Programado",
    available: "Disponible",
    completed: "Completado",
    utilization: "Utilización",
    work: "trabajo",
    mainly: "Principalmente",
    nextFree: "Próxima disponibilidad",
    upcoming: "Próximo",
    vacation: "De vacaciones",
    days: "días",
    installation: "instalaciones",
    repair: "reparaciones",
    maintenance: "mantenimiento",
    emergency: "emergencias"
  },
  "it-IT": {
    scheduled: "Programmato",
    available: "Disponibile",
    completed: "Completato",
    utilization: "Utilizzo",
    work: "lavoro",
    mainly: "Principalmente",
    nextFree: "Prossima disponibilità",
    upcoming: "Prossimo",
    vacation: "In ferie",
    days: "giorni",
    installation: "installazioni",
    repair: "riparazioni",
    maintenance: "manutenzione",
    emergency: "emergenze"
  },
  "fi-FI": {
    scheduled: "Varattu",
    available: "Vapaana",
    completed: "Tehty",
    utilization: "Käyttöaste",
    work: "työtä",
    mainly: "Pääasiassa",
    nextFree: "Seuraava vapaa",
    upcoming: "Tulossa",
    vacation: "Lomalla",
    days: "pv",
    installation: "asennuksia",
    repair: "korjauksia",
    maintenance: "huoltoja",
    emergency: "hätätöitä"
  },
  "sv-SE": {
    scheduled: "Schemalagt",
    available: "Tillgänglig",
    completed: "Slutfört",
    utilization: "Utnyttjande",
    work: "arbete",
    mainly: "Huvudsakligen",
    nextFree: "Nästa ledigt",
    upcoming: "Kommande",
    vacation: "På semester",
    days: "dagar",
    installation: "installationer",
    repair: "reparationer",
    maintenance: "underhåll",
    emergency: "nödfall"
  },
  "no-NO": {
    scheduled: "Planlagt",
    available: "Tilgjengelig",
    completed: "Fullført",
    utilization: "Utnyttelse",
    work: "arbeid",
    mainly: "Hovedsakelig",
    nextFree: "Neste ledig",
    upcoming: "Kommende",
    vacation: "På ferie",
    days: "dager",
    installation: "installasjoner",
    repair: "reparasjoner",
    maintenance: "vedlikehold",
    emergency: "nødsituasjoner"
  },
  "da-DK": {
    scheduled: "Planlagt",
    available: "Tilgængelig",
    completed: "Fuldført",
    utilization: "Udnyttelse",
    work: "arbejde",
    mainly: "Hovedsageligt",
    nextFree: "Næste ledige",
    upcoming: "Kommende",
    vacation: "På ferie",
    days: "dage",
    installation: "installationer",
    repair: "reparationer",
    maintenance: "vedligeholdelse",
    emergency: "nødsituationer"
  },
  "nl-NL": {
    scheduled: "Gepland",
    available: "Beschikbaar",
    completed: "Voltooid",
    utilization: "Benutting",
    work: "werk",
    mainly: "Voornamelijk",
    nextFree: "Volgende beschikbaar",
    upcoming: "Aankomend",
    vacation: "Met verlof",
    days: "dagen",
    installation: "installaties",
    repair: "reparaties",
    maintenance: "onderhoud",
    emergency: "noodgevallen"
  },
  "pt-PT": {
    scheduled: "Agendado",
    available: "Disponível",
    completed: "Concluído",
    utilization: "Utilização",
    work: "trabalho",
    mainly: "Principalmente",
    nextFree: "Próxima disponibilidade",
    upcoming: "Próximo",
    vacation: "De férias",
    days: "dias",
    installation: "instalações",
    repair: "reparações",
    maintenance: "manutenção",
    emergency: "emergências"
  },
  "pl-PL": {
    scheduled: "Zaplanowane",
    available: "Dostępne",
    completed: "Ukończone",
    utilization: "Wykorzystanie",
    work: "praca",
    mainly: "Głównie",
    nextFree: "Następna dostępność",
    upcoming: "Nadchodzące",
    vacation: "Na urlopie",
    days: "dni",
    installation: "instalacje",
    repair: "naprawy",
    maintenance: "konserwacje",
    emergency: "nagłe wypadki"
  },
  "ru-RU": {
    scheduled: "Запланировано",
    available: "Доступно",
    completed: "Выполнено",
    utilization: "Загрузка",
    work: "работа",
    mainly: "В основном",
    nextFree: "Следующая свободная",
    upcoming: "Предстоящие",
    vacation: "В отпуске",
    days: "дней",
    installation: "установки",
    repair: "ремонты",
    maintenance: "обслуживание",
    emergency: "аварии"
  }
};

// Helper function to extract initials from a name
const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to calculate contrast color (light or dark text) based on background
const getContrastColor = (hexColor: string): string => {
  // Remove the # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Helper function to parse duration strings to milliseconds
const parseDuration = (duration: string): number => {
  const trimmed = duration.trim().toLowerCase();
  const parts = trimmed.split(' ');

  if (parts.length < 2) return 0;

  const value = parseFloat(parts[0]);
  const unit = parts[1];

  if (unit.startsWith('hour')) {
    return value * 60 * 60 * 1000;
  } else if (unit.startsWith('day')) {
    return value * 24 * 60 * 60 * 1000;
  } else if (unit.startsWith('week')) {
    return value * 7 * 24 * 60 * 60 * 1000;
  } else if (unit.startsWith('minute')) {
    return value * 60 * 1000;
  }

  return 0;
};

// Helper function to calculate business hours in a date range (7-17 on weekdays)
const calculateBusinessHours = (start: Date, end: Date): number => {
  let totalHours = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Monday = 1, Friday = 5, Sunday = 0, Saturday = 6
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      totalHours += 10; // 7:00-17:00 = 10 hours
    }
    current.setDate(current.getDate() + 1);
  }

  return totalHours;
};

// Helper function to determine zoom level from viewport dates
const determineZoomLevel = (start: Date, end: Date): ZoomLevel => {
  const days = differenceInCalendarDays(end, start);

  if (days > 180) return 'year';      // 6+ months visible
  if (days > 45) return 'month';      // 45-180 days visible
  if (days > 10) return 'week';       // 10-45 days visible
  return 'day';                       // < 10 days visible
};

// Helper function to determine time context from viewport dates
const determineTimeContext = (start: Date, end: Date): TimeContext => {
  const now = new Date();
  const isPast = end < now;
  const isFuture = start > now;

  if (isPast) return 'past';
  if (isFuture) return 'future';
  return 'mixed';
};

// Helper function to calculate metrics for an electrician
const calculateElectricianMetrics = (
  electricianId: number,
  workOrders: typeof electriciansData.workOrders,
  startDate: Date,
  endDate: Date,
  viewportStart?: Date,
  viewportEnd?: Date
): ElectricianMetrics => {
  const currentDate = new Date();

  // Use viewport dates if provided, otherwise use full date range
  const calcStart = viewportStart ?? startDate;
  const calcEnd = viewportEnd ?? endDate;
  const timeContext = viewportStart && viewportEnd ? determineTimeContext(viewportStart, viewportEnd) : 'mixed';

  // Filter work orders for this electrician (excluding vacation and sick leave)
  const relevantOrders = workOrders.filter(
    order => order.electricianId === electricianId &&
    order.type !== 'vacation' &&
    order.type !== 'sick'
  );

  // Filter viewport-specific work orders
  const viewportOrders = relevantOrders.filter(order => {
    const orderStart = new Date(order.startTime);
    const orderEnd = new Date(orderStart.getTime() + parseDuration(order.duration));
    return orderStart < calcEnd && orderEnd > calcStart;
  });

  // Get vacation/sick leave periods in viewport
  const viewportVacations = workOrders.filter(order => {
    const orderStart = new Date(order.startTime);
    const orderEnd = new Date(orderStart.getTime() + parseDuration(order.duration));
    return order.electricianId === electricianId &&
           (order.type === 'vacation' || order.type === 'sick') &&
           orderStart < calcEnd && orderEnd > calcStart;
  }).map(order => ({
    start: new Date(order.startTime),
    end: new Date(new Date(order.startTime).getTime() + parseDuration(order.duration)),
    days: parseDuration(order.duration) / (1000 * 60 * 60 * 24)
  }));

  // Calculate total hours
  let totalHours = 0;
  let pastHours = 0;
  let futureHours = 0;
  const typeHours: WorkTypeDistribution = {
    installation: 0,
    repair: 0,
    maintenance: 0,
    emergency: 0
  };

  relevantOrders.forEach(order => {
    const hours = parseDuration(order.duration) / (1000 * 60 * 60);
    totalHours += hours;

    // Past vs future
    const orderDate = new Date(order.startTime);
    if (orderDate < currentDate) {
      pastHours += hours;
    } else {
      futureHours += hours;
    }

    // Type distribution
    if (order.type === 'installation') typeHours.installation += hours;
    else if (order.type === 'repair') typeHours.repair += hours;
    else if (order.type === 'maintenance') typeHours.maintenance += hours;
    else if (order.type === 'emergency') typeHours.emergency += hours;
  });

  // Calculate utilization
  const availableHours = calculateBusinessHours(startDate, endDate);
  const utilizationPercent = availableHours > 0 ? (totalHours / availableHours) * 100 : 0;

  // Calculate work type distribution (percentages)
  const workTypeDistribution: WorkTypeDistribution = {
    installation: totalHours > 0 ? (typeHours.installation / totalHours) * 100 : 0,
    repair: totalHours > 0 ? (typeHours.repair / totalHours) * 100 : 0,
    maintenance: totalHours > 0 ? (typeHours.maintenance / totalHours) * 100 : 0,
    emergency: totalHours > 0 ? (typeHours.emergency / totalHours) * 100 : 0,
  };

  // Find top work type
  let topWorkType = { type: 'installation', percent: workTypeDistribution.installation };
  if (workTypeDistribution.repair > topWorkType.percent) {
    topWorkType = { type: 'repair', percent: workTypeDistribution.repair };
  }
  if (workTypeDistribution.maintenance > topWorkType.percent) {
    topWorkType = { type: 'maintenance', percent: workTypeDistribution.maintenance };
  }
  if (workTypeDistribution.emergency > topWorkType.percent) {
    topWorkType = { type: 'emergency', percent: workTypeDistribution.emergency };
  }

  // Calculate viewport-specific metrics
  let viewportHours = 0;
  viewportOrders.forEach(order => {
    viewportHours += parseDuration(order.duration) / (1000 * 60 * 60);
  });

  const viewportAvailableHours = calculateBusinessHours(calcStart, calcEnd);
  const viewportUtilization = viewportAvailableHours > 0 ? (viewportHours / viewportAvailableHours) * 100 : 0;
  const viewportFreeHours = Math.max(0, viewportAvailableHours - viewportHours);
  const isOverloaded = viewportUtilization > 100;

  return {
    totalHours: Math.round(totalHours),
    utilizationPercent: Math.round(utilizationPercent),
    workTypeDistribution,
    pastHours: Math.round(pastHours),
    futureHours: Math.round(futureHours),
    topWorkType,
    // Viewport-aware metrics
    timeContext,
    viewportHours: Math.round(viewportHours),
    viewportFreeHours: Math.round(viewportFreeHours),
    viewportUtilization: Math.round(viewportUtilization),
    nextFreeSlot: null, // Will be calculated by findNextFreeSlot later
    isOverloaded,
    upcomingVacations: viewportVacations
  };
};

// Helper function to find next available free slot for an electrician
const findNextFreeSlot = (
  electricianId: number,
  workOrders: typeof electriciansData.workOrders,
  fromDate: Date,
  toDate: Date,
  minDurationHours: number = 2
): Date | null => {
  // Get all work orders and absences for this electrician
  const allOrders = workOrders
    .filter(o => o.electricianId === electricianId)
    .map(o => ({
      start: new Date(o.startTime),
      end: new Date(new Date(o.startTime).getTime() + parseDuration(o.duration)),
      isAbsence: o.type === 'vacation' || o.type === 'sick'
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const minDurationMs = minDurationHours * 60 * 60 * 1000;
  const current = new Date(Math.max(fromDate.getTime(), new Date().getTime()));

  // Check each business day
  while (current <= toDate) {
    const dayOfWeek = current.getDay();

    // Only check weekdays (Monday = 1, Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayStart = new Date(current);
      dayStart.setHours(7, 0, 0, 0);
      const dayEnd = new Date(current);
      dayEnd.setHours(17, 0, 0, 0);

      // Check if the whole day is blocked by absence
      const hasAbsence = allOrders.some(order =>
        order.isAbsence &&
        order.start <= dayStart &&
        order.end >= dayEnd
      );

      if (!hasAbsence) {
        // Find gaps in this day
        let checkTime = new Date(dayStart);

        for (const order of allOrders) {
          // Skip if order is not on this day
          if (order.start.toDateString() !== current.toDateString()) continue;

          // Check gap before this order
          const gapDuration = order.start.getTime() - checkTime.getTime();
          if (gapDuration >= minDurationMs) {
            return checkTime; // Found a free slot!
          }

          // Move check time to end of this order
          checkTime = new Date(Math.max(checkTime.getTime(), order.end.getTime()));
        }

        // Check remaining time at end of day
        const gapDuration = dayEnd.getTime() - checkTime.getTime();
        if (gapDuration >= minDurationMs) {
          return checkTime;
        }
      }
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return null; // No free slots found
};

// Helper function to get utilization color
const getUtilizationColor = (percent: number, themeMode: PaletteMode): string => {
  if (percent >= 80) return themeMode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)';
  if (percent >= 50) return themeMode === 'dark' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.1)';
  return themeMode === 'dark' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(244, 67, 54, 0.1)';
};

// MetricsDisplay component - shows adaptive metrics based on zoom level
const MetricsDisplay: React.FC<{
  metrics: ElectricianMetrics | undefined;
  zoomLevel: ZoomLevel;
  themeMode: PaletteMode;
  locale: string;
}> = ({ metrics, zoomLevel, themeMode, locale }) => {
  if (!metrics) return null;

  const bgColor = getUtilizationColor(metrics.viewportUtilization, themeMode);
  const { timeContext } = metrics;
  const labels = metricsLabels[locale] || metricsLabels["en-US"];

  // Year view: Different info based on time context
  if (zoomLevel === 'year') {
    if (timeContext === 'future') {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.scheduled} {metrics.viewportHours}h | {labels.available} {metrics.viewportFreeHours}h
          {metrics.isOverloaded && <span> ⚠</span>}
        </Box>
      );
    } else if (timeContext === 'past') {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.completed} {metrics.viewportHours}h | {labels.utilization} {metrics.viewportUtilization}%
        </Box>
      );
    } else {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {metrics.viewportHours}h {labels.work} | {labels.utilization} {metrics.viewportUtilization}%
        </Box>
      );
    }
  }

  // Month view: Add context-specific details
  if (zoomLevel === 'month') {
    if (timeContext === 'future') {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.scheduled} {metrics.viewportHours}h | {labels.available} {metrics.viewportFreeHours}h
          {metrics.isOverloaded && <span> ⚠</span>}
          {metrics.upcomingVacations.length > 0 && <span> | {labels.vacation} {Math.round(metrics.upcomingVacations.reduce((sum, v) => sum + v.days, 0))} {labels.days}</span>}
        </Box>
      );
    } else if (timeContext === 'past') {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.completed} {metrics.viewportHours}h | {labels.utilization} {metrics.viewportUtilization}% | {labels.mainly} {labels[metrics.topWorkType.type as keyof typeof labels]}
        </Box>
      );
    } else {
      return (
        <Box sx={{ fontSize: '0.65rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {metrics.viewportHours}h {labels.work} | {labels.utilization} {metrics.viewportUtilization}% | {labels.mainly} {labels[metrics.topWorkType.type as keyof typeof labels]}
        </Box>
      );
    }
  }

  // Week/Day view: Detailed context-specific info
  if (zoomLevel === 'week' || zoomLevel === 'day') {
    if (timeContext === 'future') {
      return (
        <Box sx={{ fontSize: '0.6rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.scheduled} {metrics.viewportHours}h | {labels.available} {metrics.viewportFreeHours}h
          {metrics.isOverloaded && <span style={{ color: 'red' }}> ⚠ {labels.utilization} {metrics.viewportUtilization}%</span>}
          {metrics.nextFreeSlot && <span> | {labels.nextFree}: {format(metrics.nextFreeSlot, 'dd.MM HH:mm')}</span>}
        </Box>
      );
    } else if (timeContext === 'past') {
      return (
        <Box sx={{ fontSize: '0.6rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.completed} {metrics.viewportHours}h | {labels.utilization} {metrics.viewportUtilization}% | {labels.repair} {Math.round(metrics.workTypeDistribution.repair)}% {labels.installation} {Math.round(metrics.workTypeDistribution.installation)}%
        </Box>
      );
    } else {
      // Mixed: showing both past and future
      return (
        <Box sx={{ fontSize: '0.6rem', color: 'text.secondary', bgcolor: bgColor, px: 0.5, py: 0.15, borderRadius: 0.5 }}>
          {labels.completed} {metrics.pastHours}h | {labels.upcoming} {metrics.futureHours}h
          {metrics.nextFreeSlot && <span> | {labels.nextFree}: {format(metrics.nextFreeSlot, 'dd.MM HH:mm')}</span>}
        </Box>
      );
    }
  }

  // Default fallback
  return null;
};

function App() {
  // State for theme mode and selected locale
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const [selectedLocale, setSelectedLocale] = useState<string>("en-US");

  // State for zoom level and electrician metrics
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');
  const [electricianMetrics, setElectricianMetrics] = useState<Map<number, ElectricianMetrics>>(new Map());

  // State for viewport dates
  const [viewportDates, setViewportDates] = useState<{start: Date, end: Date} | null>(null);

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
  const startDate = useMemo(() => addDays(new Date(), -9), []);
  const endDate = useMemo(() => addDays(new Date(), 1), []);

  // Calculate metrics for all electricians
  useEffect(() => {
    const metrics = new Map<number, ElectricianMetrics>();

    electriciansData.electricians.forEach(electrician => {
      // Use viewport dates if available, otherwise use full date range
      const viewportStart = viewportDates?.start;
      const viewportEnd = viewportDates?.end;

      let electricianMetric = calculateElectricianMetrics(
        electrician.id,
        electriciansData.workOrders,
        startDate,
        endDate,
        viewportStart,
        viewportEnd
      );

      // Calculate next free slot for future/mixed contexts
      if (viewportStart && viewportEnd) {
        const timeContext = determineTimeContext(viewportStart, viewportEnd);
        if (timeContext === 'future' || timeContext === 'mixed') {
          const nextFree = findNextFreeSlot(
            electrician.id,
            electriciansData.workOrders,
            viewportStart,
            viewportEnd
          );
          electricianMetric = { ...electricianMetric, nextFreeSlot: nextFree };
        }
      }

      metrics.set(electrician.id, electricianMetric);
    });

    setElectricianMetrics(metrics);
  }, [startDate, endDate, viewportDates]);

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
            sx={{ mt: 2, p: 0, height: "1200px" }}
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
                const viewportDuration = end.getTime() - start.getTime();
                const viewportDays = viewportDuration / (1000 * 60 * 60 * 24);
                const twoMonthsMs = 60 * 24 * 60 * 60 * 1000; // ~2 months
                console.log("Viewport changed:", start, end);
                console.log(`  Duration: ${viewportDays.toFixed(0)} days`);
                console.log(`  Aggregation will show if: duration > ${(twoMonthsMs / (1000 * 60 * 60 * 24)).toFixed(0)} days AND items >= 50`);
                console.log(`  Aggregation active:`, viewportDuration > twoMonthsMs);
                const newZoomLevel = determineZoomLevel(start, end);
                setZoomLevel(newZoomLevel);
                setViewportDates({ start, end });
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

                {electriciansData.electricians.map((electrician) => {
                  // Get all orders for this electrician
                  const electricianOrders = electriciansData.workOrders.filter(
                    (order) => order.electricianId === electrician.id
                  );

                  return (
                    <TimelineRow
                      key={electrician.id}
                      id={`electrician-${electrician.id}`}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Avatar
                            sx={{
                              bgcolor: electrician.color,
                              color: getContrastColor(electrician.color),
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(electrician.name)}
                          </Avatar>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{electrician.name}</Typography>
                            <MetricsDisplay
                              metrics={electricianMetrics.get(electrician.id)}
                              zoomLevel={zoomLevel}
                              themeMode={themeMode}
                              locale={selectedLocale}
                            />
                          </Box>
                        </Box>
                      }
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
                      items={electricianOrders}
                      renderItem={(order) => {
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
                      }}
                    />
                  );
                })}
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
              <li>Circular avatars: Color-coded with initials for each electrician</li>
              <li>Zoom-adaptive metrics: Shows different information density based on zoom level (year/month/week/day)</li>
              <li>Viewport-aware analytics: Displays past performance (completed hours, utilization) or future planning (scheduled hours, available capacity, next free slots) based on viewed time period</li>
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
