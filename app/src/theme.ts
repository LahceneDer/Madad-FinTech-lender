import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d9', // A professional blue for fintech
    },
    success: {
      main: '#4caf50', // Green for success messages
      light: '#e8f5e9', // Light green for the result card background
      contrastText: '#000', // Black text for readability
    },
    background: {
      default: '#f5f7fa', // Light gray background for the app
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase text on buttons
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;