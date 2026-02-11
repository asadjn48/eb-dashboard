import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Ensure imports are correct
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Team from '@/pages/Team';
import Payroll from '@/pages/Payroll';
import Expenses from '@/pages/Expenses';
import Settings from '@/pages/Settings';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/team/EditEmployee';
import EmployeeProfile from './pages/team/EmployeeProfile';
import Alumni from './pages/Alumni';
import Notes from '@/pages/Notes';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d88c6]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (Fixed)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // FIXED: Added isAuthenticated here
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // If user is already logged in, send them to Dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Project Routes */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<AddProject />} />
        <Route path="projects/edit/:id" element={<EditProject />} />

        {/* Team Routes */}
        <Route path="team" element={<Team />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="team/new" element={<AddEmployee />} />
        <Route path="team/profile/:id" element={<EmployeeProfile />} />
        <Route path="team/edit/:id" element={<EditEmployee />} />

        <Route path="payroll" element={<Payroll />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;