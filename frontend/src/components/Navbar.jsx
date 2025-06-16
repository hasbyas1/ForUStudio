import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
          aria-expanded={isActive}
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

              {/* Add New Dropdown Menu */}
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

              {/* Projects menu (disabled for now) */}
              <span className="navbar-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <span className="icon">
                  <i className="fas fa-project-diagram"></i>
                </span>
                <span>Projects</span>
                <span className="tag is-small is-warning ml-2">Soon</span>
              </span>
            </>
          )}
        </div>
        
        <div className="navbar-end">
          {/* Theme Switcher Buttons */}
          <div className="navbar-item">
            <div className="buttons">
              <button 
                className="button is-small"
                title="Default Theme (Blue)"
                style={{ 
                  background: 'linear-gradient(45deg, #2c8fff, #1080bc)', 
                  border: 'none', 
                  color: 'white' 
                }}
                onClick={() => window.location.reload()}
              >
                🔵
              </button>
              <button 
                className="button is-small"
                title="Green Theme"
                style={{ 
                  background: 'linear-gradient(45deg, #00c851, #00a63f)', 
                  border: 'none', 
                  color: 'white' 
                }}
                onClick={() => alert('Green theme - Update variant prop to "green"')}
              >
                🟢
              </button>
              <button 
                className="button is-small"
                title="Purple Theme"
                style={{ 
                  background: 'linear-gradient(45deg, #9c27b0, #673ab7)', 
                  border: 'none', 
                  color: 'white' 
                }}
                onClick={() => alert('Purple theme - Update variant prop to "purple"')}
              >
                🟣
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="navbar-item">
            <button className="button is-transparent" title="Notifications">
              <span className="icon">
                <i className="fas fa-bell"></i>
              </span>
              <span className="tag is-danger is-small">3</span>
            </button>
          </div>

          {/* User Menu */}
          <div className="navbar-item has-dropdown is-hoverable">
            <a 
              className="navbar-link"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <span className="icon">
                <i className="fas fa-user-circle"></i>
              </span>
              <span>{user?.fullName || user?.username || 'User'}</span>
              <span className={`tag is-small ml-2 ${
                user?.role?.roleName === 'admin' ? 'is-danger' :
                user?.role?.roleName === 'editor' ? 'is-warning' :
                'is-info'
              }`}>
                {user?.role?.roleName || 'client'}
              </span>
            </a>
            
            <div className="navbar-dropdown is-right">
              {/* User Info */}
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
              
              {/* Profile Actions */}
              <Link 
                className="navbar-item" 
                to="/profile"
                onClick={() => setIsActive(false)}
              >
                <span className="icon">
                  <i className="fas fa-user-edit"></i>
                </span>
                <span>Edit Profile</span>
              </Link>
              
              <Link 
                className="navbar-item" 
                to="/settings"
                onClick={() => setIsActive(false)}
              >
                <span className="icon">
                  <i className="fas fa-cog"></i>
                </span>
                <span>Settings</span>
              </Link>
              
              <hr className="navbar-divider" />
              
              {/* Logout */}
              <button 
                className="navbar-item"
                onClick={handleLogout}
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  width: '100%', 
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span className="icon">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;