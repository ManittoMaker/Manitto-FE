import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Snowfall from "react-snowfall";
import theme from "./theme";
import AppRoutes from "./AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snowfall color="white" snowflakeCount={100} />
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
