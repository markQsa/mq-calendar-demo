import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material'
import { TimelineCalendar } from 'mq-timeline-calendar'

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Timeline Calendar Test
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Testing mq-timeline-calendar component
          </Typography>
          <Box sx={{ mt: 4 }}>
            <TimelineCalendar />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
