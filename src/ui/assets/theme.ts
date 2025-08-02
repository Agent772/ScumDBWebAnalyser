// not used but here if swith to mui in future
import { createTheme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f7b801',
    },
    secondary: {
      main: '#4f58a6',
    },
    error: {
      main: '#f04747',
    },
    success: {
      main: '#43b581',
    },
  },
})
theme = responsiveFontSizes(theme)
export { theme };