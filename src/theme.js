import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ED4264",
    },
    secondary: {
      main: "#ffd2e5",
    },
  },
  typography: {
    fontFamily: "Nanum Gothic",
    h1: {
      fontWeight: "bold",
      fontSize: "2.5rem",
      textAlign: "center",
      color: "#d32f2f",
      fontFamily: "Gaegu",
    },
    h2: {
      fontWeight: "500",
      fontSize: "1.8rem",
      color: "#388e3c",
      fontFamily: "Gaegu",
    },
    h3: {
      fontFamily: "Gaegu",
    },
    h4: {
      fontFamily: "Gaegu",
    },
    h5: {
      fontFamily: "Gaegu",
    },
    h6: {
      fontFamily: "Gaegu",
      fontSize: "1.5rem",
    },
  },
});

export default theme;
