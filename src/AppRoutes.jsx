import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateGroupPage from "./pages/CreateGroupPage";
import InputNamesPage from "./pages/InputNamePage";
import FinalResultPage from "./pages/FinalResultPage";
import ShowPage from "./pages/ShowPage";
import CheckResultsPage from "./pages/CheckResultsPage";

const AppRoutes = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_APP_KAKAO_JS_KEY);
      console.log("Kakao SDK initialized");
    }
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <Routes>
        <Route path="/" element={<CreateGroupPage />} />
        <Route path="/inputNames/:groupId" element={<InputNamesPage />} />
        <Route path="/finalResult/:groupId" element={<FinalResultPage />} />
        <Route path="/showResult/:groupId" element={<ShowPage />} />
        <Route path="/checkResults" element={<CheckResultsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
