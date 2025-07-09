import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes, Route,
    Link,
    Navigate,
    useLocation
} from 'react-router-dom';
import Appointments from './components/Appointments';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import Login from './components/Login';
import './index.css';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('hms_admin_logged_in') === 'true';
    const location = useLocation();
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

const App = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isLinkActive = (path) =>
        window.location.pathname === path;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('hms_admin_logged_in');
        window.location.href = '/login';
    };

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            {/* Logo and Title */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold text-xl">🏥</span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-white text-xl md:text-2xl font-bold">
                                        HMS
                </h1>
                                    <p className="text-blue-100 text-sm hidden sm:block">
                                        Hospital Management System
                                    </p>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isMobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-8 items-center">
                            <Link
                                to="/appointments"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isLinkActive('/appointments')
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'text-white hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                    📅 Appointments
                            </Link>
                            <Link
                                to="/doctors"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isLinkActive('/doctors')
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'text-white hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                    👨‍⚕️ Doctors
                            </Link>
                            <Link
                                to="/patients"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isLinkActive('/patients')
                                            ? 'bg-white text-blue-600 shadow-md'
                                            : 'text-white hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                    👥 Patients
                            </Link>
                                {/* Logout button if logged in */}
                                {localStorage.getItem('hms_admin_logged_in') === 'true' && (
                                    <button
                                        onClick={handleLogout}
                                        className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                )}
                </nav>
                        </div>

                        {/* Mobile Navigation */}
                        {isMobileMenuOpen && (
                            <div className="md:hidden pb-4">
                                <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-700 rounded-lg">
                                    <Link
                                        to="/appointments"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                                            isLinkActive('/appointments')
                                                ? 'bg-white text-blue-600'
                                                : 'text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        📅 Appointments
                                    </Link>
                                    <Link
                                        to="/doctors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                                            isLinkActive('/doctors')
                                                ? 'bg-white text-blue-600'
                                                : 'text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        👨‍⚕️ Doctors
                                    </Link>
                                    <Link
                                        to="/patients"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                                            isLinkActive('/patients')
                                                ? 'bg-white text-blue-600'
                                                : 'text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        👥 Patients
                                    </Link>
                                    {/* Logout button if logged in */}
                                    {localStorage.getItem('hms_admin_logged_in') === 'true' && (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full mt-2 px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                        <Route path="/" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                        <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
                        <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-6 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-gray-300 text-sm">
                                © 2024 Hospital Management System. Built with React & Node.js
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
