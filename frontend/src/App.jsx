import { useState } from "react";
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

import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import GlobalChatbot from "./components/global/GlobalChatbot";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {/* Top Navbar */}
      {!hideLayout && <Navbar />}

      {/* Main Content */}
      <div
        className={
          !hideLayout
            ? "pt-[90px] pb-[100px] min-h-screen"
            : "min-h-screen"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {!hideLayout && <MobileBottomNav />}

      {/* Global Chatbot Overlay */}
      {!hideLayout && <GlobalChatbot />}
    </>
  );
}

export default function App() {
  const [isAuth] = useState(
    !!localStorage.getItem("isAuthenticated")
  );

  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route
            path="/"
            element={
              isAuth ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="/mandi" element={<MandiPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}