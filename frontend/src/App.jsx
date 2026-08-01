import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Core Application Pages
import Dashboard from './pages/Dashboard';
import ReportLostItem from './pages/lost/ReportLostItem';
import MyLostItems from './pages/lost/MyLostItems';
import CommunityLostItems from './pages/lost/CommunityLostItems';
import IFoundSomething from './pages/found/IFoundSomething';
import ReportFoundItem from './pages/found/ReportFoundItem';
import MyFoundItems from './pages/found/MyFoundItems';
import Matches from './pages/Matches';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-items/new"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportLostItem />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-items"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MyLostItems />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community-lost-items"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CommunityLostItems />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/i-found-something"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <IFoundSomething />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/found-items/new"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportFoundItem />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/found-items"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MyFoundItems />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Matches />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Notifications />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
