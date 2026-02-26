import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MandiPage from "./pages/MandiPage";
import CasesPage from "./pages/CasesPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

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
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("isAuthenticated")
  );

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 Listen for auth updates
  useEffect(() => {
    const updateAuth = () => {
      setIsAuth(!!localStorage.getItem("isAuthenticated"));
    };

    window.addEventListener("auth-update", updateAuth);
    return () => window.removeEventListener("auth-update", updateAuth);
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Router>
      <LayoutWrapper>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mandi" element={<MandiPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}