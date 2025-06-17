// frontend/src/components/ProtectedRoute.jsx (Updated)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireClient = false, requireOwnerOrAdmin = false }) => {
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div 
        className="section gradient-background" 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="radius-shape-1"></div>
        <div className="radius-shape-2"></div>
        <div className="radius-shape-3"></div>
        <div className="radius-shape-4"></div>
        <div className="radius-shape-5"></div>
        <div className="data-shape-1"></div>
        <div className="data-shape-2"></div>
        <div className="data-shape-3"></div>
        <div className="data-shape-4"></div>

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
        className="section gradient-background" 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="radius-shape-1"></div>
        <div className="radius-shape-2"></div>
        <div className="radius-shape-3"></div>
        <div className="radius-shape-4"></div>
        <div className="radius-shape-5"></div>
        <div className="data-shape-1"></div>
        <div className="data-shape-2"></div>
        <div className="data-shape-3"></div>
        <div className="data-shape-4"></div>

        <div className="box has-text-centered">
          <div className="is-size-1 mb-4 has-text-danger">
            <i className="fas fa-ban"></i>
          </div>
          <p className="title is-4">Access Denied</p>
          <p className="subtitle is-6">
            You need administrator privileges to access this page.
          </p>
          <div className="buttons is-centered mt-4">
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
      </div>
    );
  }

  // Check client requirement
  if (requireClient && user?.role?.roleName !== 'client') {
    return (
      <div 
        className="section gradient-background" 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="radius-shape-1"></div>
        <div className="radius-shape-2"></div>
        <div className="radius-shape-3"></div>
        <div className="radius-shape-4"></div>
        <div className="radius-shape-5"></div>
        <div className="data-shape-1"></div>
        <div className="data-shape-2"></div>
        <div className="data-shape-3"></div>
        <div className="data-shape-4"></div>

        <div className="box has-text-centered">
          <div className="is-size-1 mb-4 has-text-warning">
            <i className="fas fa-user-times"></i>
          </div>
          <p className="title is-4">Client Access Required</p>
          <p className="subtitle is-6">
            Only clients can access this page.
          </p>
          <div className="buttons is-centered mt-4">
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
      </div>
    );
  }

  // Check owner or admin requirement
  if (requireOwnerOrAdmin) {
    const targetUserId = parseInt(location.pathname.split('/').pop()); // Get ID from URL
    const currentUserId = user?.userId;
    const isOwner = currentUserId === targetUserId;
    const isAdminUser = isAdmin();

    if (!isAdminUser && !isOwner) {
      return (
        <div 
          className="section gradient-background" 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="radius-shape-1"></div>
          <div className="radius-shape-2"></div>
          <div className="radius-shape-3"></div>
          <div className="radius-shape-4"></div>
          <div className="radius-shape-5"></div>
          <div className="data-shape-1"></div>
          <div className="data-shape-2"></div>
          <div className="data-shape-3"></div>
          <div className="data-shape-4"></div>

          <div className="box has-text-centered">
            <div className="is-size-1 mb-4 has-text-warning">
              <i className="fas fa-user-lock"></i>
            </div>
            <p className="title is-4">Access Denied</p>
            <p className="subtitle is-6">
              You can only edit your own profile or need administrator privileges.
            </p>
            <div className="buttons is-centered mt-4">
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
        </div>
      );
    }
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;