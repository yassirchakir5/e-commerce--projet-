import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../component/form/navbar/Navbar';
import LoginForm from '../component/form/LoginForm';
import Sidebar from '../component/sidebar/Sidebar';
import Boutiques from '../pages/Boutiques';
import Products from '../pages/Products';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Vendors from '../pages/Vendors';
import Orders from '../pages/Orders';
import Settings from '../pages/Settings';

const ProtectedLayout = ({ isAuthenticated, onLogout, children }) => {
  const location = useLocation(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <main className="main-content" key={location.pathname}>
        <div className="page-transition-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

const AppRoutes = ({ isAuthenticated, onLoginSuccess, onLogout }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <>
              <Navbar />
              <LoginForm onLoginSuccess={onLoginSuccess} />
            </>
          )
        }
      />

      <Route
        path="/boutiques"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Boutiques />
          </ProtectedLayout>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Products />
          </ProtectedLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Users />
          </ProtectedLayout>
        }
      />
      <Route
        path="/vendors"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Vendors />
          </ProtectedLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Orders />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
            <Settings />
          </ProtectedLayout>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;