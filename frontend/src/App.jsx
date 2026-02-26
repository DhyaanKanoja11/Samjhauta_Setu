import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MandiPage from "./pages/MandiPage";
import CasesPage from "./pages/CasesPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import VoiceAssistant from "./components/dashboard/VoiceAssistant";
import FullScreenLoader from "./components/common/FullScreenLoader";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Navbar />}

      <div
        className={
          !hideLayout
            ? "pt-[90px] pb-[110px] min-h-screen"
            : "min-h-screen"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          {children}
        </div>
      </div>

      {!hideLayout && <MobileBottomNav />}
      {!hideLayout && <VoiceAssistant />}
    </>
  );
}

export default function App() {
  const [isAuth] = useState(
    !!localStorage.getItem("isAuthenticated")
  );

  const [loading, setLoading] = useState(true);

  // 🔥 Initial App Loader (Professional feel)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Smooth intro

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route
            path="/"
            element={
              isAuth ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/mandi" element={<MandiPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 🔥 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}