import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Century Gothic',
    h4: {
      fontWeight: 'bolder',
      fontSize: '5em',

    },
    button: {
      fontWeight: 600,
      fontSize: '1.8em',
    },
  },

  palette: {
    background: {
      default: '#F5F5DC', 
  
    },
    primary: {
      main: '#800000',
    },
    secondary:{
      main: '#C3FDB8'
    },
    info: {
      main: '#7575CF'
    },
    warning: {
      main: '#560319'
    },
    success: {
      main: '#8686AF'
    }

  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#F5F5DC', 
      },
    }}
  />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

