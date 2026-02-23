import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MandiPage from "./pages/MandiPage";
import CasesPage from "./pages/CasesPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? "pt-[80px] pb-[90px]" : ""}>
        {children}
      </div>
      {!hideNavbar && <MobileBottomNav />}
    </>
  );
}

export default function App() {
  const [isAuth] = useState(!!localStorage.getItem("isAuthenticated"));

  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
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