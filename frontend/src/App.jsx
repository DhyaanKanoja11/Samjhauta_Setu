import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MandiPage from './pages/MandiPage';
import CasesPage from './pages/CasesPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/common/Navbar';

function PrivateRoute({ children }) {
  const auth = localStorage.getItem('isAuthenticated');
  return auth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuth = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      {isAuth && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/mandi" element={<PrivateRoute><MandiPage /></PrivateRoute>} />
        <Route path="/cases" element={<PrivateRoute><CasesPage /></PrivateRoute>} />
        <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
