import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MandiPage from './pages/MandiPage';
import CasesPage from './pages/CasesPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
// Note: SignupPage is removed since OTP handles both login and registration
import Navbar from './components/common/Navbar';

// 1. The Route Bouncer (Your existing logic, kept perfectly intact)
function PrivateRoute({ children }) {
  const auth = localStorage.getItem('isAuthenticated');
  return auth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // 2. React State for Navbar visibility
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('isAuthenticated'));

  // 3. Listen for Login/Logout events to show/hide Navbar instantly
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(!!localStorage.getItem('isAuthenticated'));
    };

    // Listen for custom storage events
    window.addEventListener('auth-update', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-update', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <Router>
      {/* Navbar only shows if isAuth state is true */}
      {isAuth && <Navbar />}
      
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect old signup attempts to our unified OTP Login page */}
        <Route path="/signup" element={<Navigate to="/login" replace />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/mandi" element={<PrivateRoute><MandiPage /></PrivateRoute>} />
        <Route path="/cases" element={<PrivateRoute><CasesPage /></PrivateRoute>} />
        <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        {/* --- DEFAULT ROUTE --- */}
        {/* Smart redirect: If logged in go to dashboard, else go to login */}
        <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
