import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Paper } from '@mui/material'
import { TimelineCalendar, TimelineItem } from 'mq-timeline-calendar/react'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  // Set up timeline date range - full year view
  const startDate = new Date(2025, 0, 1) // January 1, 2025
  const endDate = new Date(2025, 11, 31) // December 31, 2025

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Timeline Calendar Demo
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            Testing mq-timeline-calendar with Material-UI integration
          </Typography>

          <Paper elevation={3} sx={{ mt: 4, p: 2, height: '600px' }}>
            <TimelineCalendar
              startDate={startDate}
              endDate={endDate}
              height="100%"
              width="100%"
              showNavigation={false}
              theme={{
                colors: {
                  background: '#ffffff',
                  gridLine: '#e0e0e0',
                  gridLinePrimary: '#9e9e9e',
                  headerBackground: '#ffffff',
                  headerText: '#333333',
                  headerBorder: '#d0d0d0',
                },
                fonts: {
                  header: 'Roboto, sans-serif',
                  content: 'Roboto, sans-serif',
                },
                spacing: {
                  headerHeight: 100,
                  headerRowHeight: 50,
                  rowHeight: 80,
                }
              }}
              onViewportChange={(start, end) => {
                console.log('Viewport changed:', start, end)
              }}
              onZoomChange={(pixelsPerMs) => {
                console.log('Zoom level:', pixelsPerMs)
              }}
            >
              <TimelineItem
                startTime={new Date(2025, 2, 1)}
                duration="2 weeks"
                row={0}
              >
                <Box sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">Project Planning</Typography>
                </Box>
              </TimelineItem>

              <TimelineItem
                startTime={new Date(2025, 2, 15)}
                duration="1 month"
                row={1}
              >
                <Box sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">Development Phase</Typography>
                </Box>
              </TimelineItem>

              <TimelineItem
                startTime={new Date(2025, 3, 20)}
                duration="10 days"
                row={2}
              >
                <Box sx={{
                  bgcolor: 'warning.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">Testing & QA</Typography>
                </Box>
              </TimelineItem>

              <TimelineItem
                startTime={new Date(2025, 4, 1)}
                duration="1 week"
                row={3}
              >
                <Box sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">Deployment</Typography>
                </Box>
              </TimelineItem>

              <TimelineItem
                startTime={new Date(2025, 5, 15)}
                duration="3 weeks"
                row={0}
              >
                <Box sx={{
                  bgcolor: 'info.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="body2">Maintenance & Support</Typography>
                </Box>
              </TimelineItem>
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
              <li>Material-UI themed components</li>
              <li>Responsive and smooth animations</li>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
