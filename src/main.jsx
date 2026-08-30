import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorBoundary from "./components/ErrorBoundary";
import SeasonalEffect from "./components/SeasonalEffect";
import theme from "./theme";
import AppRoutes from "./AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <SeasonalEffect />
        <AppRoutes />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
