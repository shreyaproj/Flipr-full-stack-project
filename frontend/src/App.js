import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component Imports
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
// Ensure this file exists, or remove the route if you don't have a registration page
import AdminRegister from './pages/AdminRegister'; 

import { authService } from './services/api';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
    
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Frontend */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Auth Routes */}
          <Route 
            path="/admin/login" 
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            } 
          />
          
          {/* Note: If you have AdminRegister.jsx, uncomment the import above 
            and the route below. 
          */}
          <Route 
            path="/admin/register" 
            element={
              <PublicRoute>
                <AdminRegister />
              </PublicRoute>
            } 
          />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;