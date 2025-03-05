import { createTheme } from '@mui/material/styles';

const tema = createTheme({
  palette: {
    primary: {
      main: '#369fb8',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffff',
          color: '#369fb8',
          borderRadius: '10px',
        },
        cell: {
          color: '#00000',
        },
        columnHeaders: {  
          backgroundColor: '#FFFF',
          color: '#369fb8',
        },
        footerContainer: {
          backgroundColor: '#FFFF',
        },
      },
    },
  },
});

export default tema;
