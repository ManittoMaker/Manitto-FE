import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FinalResultPage from "./pages/FinalResultPage";
import App from "./App";
import ShowPage from "./pages/ShowPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShowPage />} />
        <Route path="/finalResult" element={<FinalResultPage />} />
        <Route path="/makemanitto" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
