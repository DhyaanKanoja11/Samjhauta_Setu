import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // Check if the user is logged in (either via OTP or as a Guest)
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // If they are NOT logged in, redirect them instantly to the Login page ("/")
    // 'replace' prevents them from clicking the back button to return to the protected page
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If they ARE logged in, render whatever page they were trying to go to
    return <Outlet />;
}
