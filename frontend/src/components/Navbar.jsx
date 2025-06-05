import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleBurger = () => {
    setIsActive(!isActive);
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated()) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/users">
          <span className="icon-text">
            <span className="icon">
              <i className="fas fa-users"></i>
            </span>
            <span className="has-text-weight-bold">User Management</span>
          </span>
        </Link>

        <a
          role="button"
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={toggleBurger}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link 
            className={`navbar-item ${isCurrentPath('/users') ? 'is-active' : ''}`} 
            to="/users"
            onClick={() => setIsActive(false)}
          >
            <span className="icon">
              <i className="fas fa-users"></i>
            </span>
            <span>Users</span>
          </Link>

          {isAdmin() && (
            <>
              <Link 
                className={`navbar-item ${isCurrentPath('/roles') ? 'is-active' : ''}`} 
                to="/roles"
                onClick={() => setIsActive(false)}
              >
                <span className="icon">
                  <i className="fas fa-user-tag"></i>
                </span>
                <span>Roles</span>
              </Link>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add New</span>
                </a>
                <div className="navbar-dropdown">
                  <Link 
                    className="navbar-item" 
                    to="/users/add"
                    onClick={() => setIsActive(false)}
                  >
                    <span className="icon">
                      <i className="fas fa-user-plus"></i>
                    </span>
                    <span>Add User</span>
                  </Link>
                  <Link 
                    className="navbar-item" 
                    to="/roles/add"
                    onClick={() => setIsActive(false)}
                  >
                    <span className="icon">
                      <i className="fas fa-plus-circle"></i>
                    </span>
                    <span>Add Role</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              <span className="icon">
                <i className="fas fa-user-circle"></i>
              </span>
              <span>{user?.fullName || 'User'}</span>
              <span className={`tag is-small ml-2 ${
                user?.role?.roleName === 'admin' ? 'is-danger' :
                user?.role?.roleName === 'editor' ? 'is-warning' :
                'is-info'
              }`}>
                {user?.role?.roleName || 'client'}
              </span>
            </a>
            <div className="navbar-dropdown is-right">
              <div className="navbar-item">
                <div className="content">
                  <p className="is-size-7 has-text-grey">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="is-size-7 has-text-grey">
                    <strong>Username:</strong> {user?.username}
                  </p>
                  {user?.phone && (
                    <p className="is-size-7 has-text-grey">
                      <strong>Phone:</strong> {user?.phone}
                    </p>
                  )}
                </div>
              </div>
              <hr className="navbar-divider" />
              <a className="navbar-item" href="#" onClick={(e) => e.preventDefault()}>
                <span className="icon">
                  <i className="fas fa-user-edit"></i>
                </span>
                <span>Edit Profile</span>
              </a>
              <a className="navbar-item" href="#" onClick={(e) => e.preventDefault()}>
                <span className="icon">
                  <i className="fas fa-cog"></i>
                </span>
                <span>Settings</span>
              </a>
              <hr className="navbar-divider" />
              <a className="navbar-item" onClick={handleLogout}>
                <span className="icon">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;