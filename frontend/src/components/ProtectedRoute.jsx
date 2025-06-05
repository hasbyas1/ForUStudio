import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div 
        className="section" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="box has-text-centered">
          <div className="is-size-1 mb-4">
            <i className="fas fa-spinner fa-spin has-text-primary"></i>
          </div>
          <p className="title is-5">Loading...</p>
          <p className="subtitle is-6">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <div 
        className="section" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="box has-text-centered">
          <div className="is-size-1 mb-4 has-text-danger">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="title is-4 has-text-danger">Access Denied</p>
          <p className="subtitle is-6">You don't have permission to access this page.</p>
          <p className="mb-4">This page requires administrator privileges.</p>
          <button 
            className="button is-primary"
            onClick={() => window.history.back()}
          >
            <span className="icon">
              <i className="fas fa-arrow-left"></i>
            </span>
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;