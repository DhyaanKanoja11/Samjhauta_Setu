import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MandiPage from "./pages/MandiPage";
import CasesPage from "./pages/CasesPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";

export default function App() {
  const [isAuth] = useState(!!localStorage.getItem("isAuthenticated"));

  return (
    <Router>
      <Navbar />

      <div className="pt-16 pb-20">
        <Routes>
          <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/mandi" element={<MandiPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>

      <MobileBottomNav />
    </Router>
  );
}