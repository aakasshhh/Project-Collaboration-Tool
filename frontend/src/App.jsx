import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TeamPage from './pages/TeamPage';
import ProjectPage from './pages/ProjectPage';
import HomePage from './pages/HomePage';

import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040b2c] via-[#0a0f2f] to-[#03071b]">
      <Navbar />

      <div className="container mx-auto pt-20"> 
        <Routes>

          {/* Landing */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <HomePage />
            }
          />

          {/* Auth */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/teams/:teamId"
            element={
              <PrivateRoute>
                <TeamPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/projects/:projectId"
            element={
              <PrivateRoute>
                <ProjectPage />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}
