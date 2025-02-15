import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CherryBlossom from "./components/CherryBlossom";
import theme from "./theme";
import AppRoutes from "./AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CherryBlossom />
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
