import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateGroupPage from "./pages/CreateGroupPage";
import InputNamesPage from "./pages/InputNamePage";
import FinalResultPage from "./pages/FinalResultPage";
import ShowPage from "./pages/ShowPage";
import CheckResultsPage from "./pages/CheckResultsPage";

const AppRoutes = () => {
  useEffect(() => {
    const checkKakao = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_APP_KAKAO_JS_KEY);
        }
      } else {
        console.warn("Kakao SDK 로드 대기 중...");
        setTimeout(checkKakao, 500);
      }
    };

    checkKakao();
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
