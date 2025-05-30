import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Changes } from './pages/Changes';
import { Stats } from './pages/Stats';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2563eb', // Professional blue
            light: '#60a5fa',
            dark: '#1d4ed8',
          },
          secondary: {
            main: '#7c3aed', // Professional purple
            light: '#a78bfa',
            dark: '#5b21b6',
          },
          background: {
            default: darkMode ? '#0f172a' : '#f8fafc',
            paper: darkMode ? '#1e293b' : '#ffffff',
          },
          success: {
            main: '#059669', // Professional green
            light: '#34d399',
            dark: '#047857',
          },
          error: {
            main: '#dc2626', // Professional red
            light: '#f87171',
            dark: '#b91c1c',
          },
          warning: {
            main: '#d97706', // Professional orange
            light: '#fbbf24',
            dark: '#b45309',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
          subtitle1: {
            fontWeight: 500,
          },
          subtitle2: {
            fontWeight: 500,
          },
          button: {
            fontWeight: 500,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 6,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/changes" element={<Changes />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}; 