import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB'
    },
    secondary: {
      main: '#4F46E5'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569'
    },
    success: {
      main: '#16A34A'
    },
    error: {
      main: '#DC2626'
    }
  },

  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h5: {
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },

  shape: {
    borderRadius: 10
  }
});

export default theme;
