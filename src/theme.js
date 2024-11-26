import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#4db6ac",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: "bold",
      fontSize: "2.5rem",
      textAlign: "center",
      color: "#d32f2f",
    },
    h2: {
      fontWeight: "500",
      fontSize: "1.8rem",
      color: "#388e3c",
    },
  },
});

export default theme;
