import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f", // 연말 분위기의 레드
    },
    secondary: {
      main: "#388e3c", // 따뜻한 초록
    },
    background: {
      default: "#f9f5e9", // 따뜻한 배경색
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
