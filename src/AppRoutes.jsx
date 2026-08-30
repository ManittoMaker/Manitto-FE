import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateGroupPage from "./pages/CreateGroupPage";
import InputNamesPage from "./pages/InputNamePage";
import FinalResultPage from "./pages/FinalResultPage";
import ShowPage from "./pages/ShowPage";
import CheckResultsPage from "./pages/CheckResultsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Footer from "./components/Footer.jsx";
import { Box } from "@mui/material";
import { analytics } from "./firebase/firebase.js";
import { logEvent } from "firebase/analytics";
import { useEffect } from "react";

const AppRoutes = () => {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view");
    }
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        justifyContent="space-between"
      >
        <Box component="main" flexGrow={1}>
          <Routes>
            <Route path="/" element={<CreateGroupPage />} />
            <Route path="/inputNames/:groupId" element={<InputNamesPage />} />
            <Route path="/finalResult/:groupId" element={<FinalResultPage />} />
            <Route path="/showResult/:groupId" element={<ShowPage />} />
            <Route path="/checkResults" element={<CheckResultsPage />} />
            {/* 잘못된 주소는 404 안내 화면으로 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
};

export default AppRoutes;
