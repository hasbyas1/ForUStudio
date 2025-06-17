import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  // Fungsi untuk menentukan apakah link aktif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Fungsi logout sederhana tanpa auth context
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored data
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
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
          
          {/* Projects menu (disabled for now) */}
          <span className="navbar-item text-glass" style={{ opacity: 0.5 }}>
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
                className="button is-small text-glass"
                title="Default Theme (Blue)"
                style={{ background: 'linear-gradient(45deg, #2c8fff, #1080bc)', border: 'none', color: 'white' }}
                onClick={() => window.location.reload()}
              >
                🔵
              </button>
              <button 
                className="button is-small text-glass"
                title="Green Theme"
                style={{ background: 'linear-gradient(45deg, #00c851, #00a63f)', border: 'none', color: 'white' }}
                onClick={() => alert('Green theme - Update variant prop to "green"')}
              >
                🟢
              </button>
              <button 
                className="button is-small text-glass"
                title="Purple Theme"
                style={{ background: 'linear-gradient(45deg, #9c27b0, #673ab7)', border: 'none', color: 'white' }}
                onClick={() => alert('Purple theme - Update variant prop to "purple"')}
              >
                🟣
              </button>
            </div>
          </div>

          {/* Notifications (mock) */}
          <div className="navbar-item">
            <button className="button is-transparent text-glass" title="Notifications">
              <span className="icon">
                <i className="fas fa-user-circle"></i>
              </span>
              <span className="tag is-danger is-small">3</span>
            </button>
          </div>

          {/* User Menu */}
          {showUserMenu && (
            <div className={`navbar-item has-dropdown ${isUserDropdownOpen ? 'is-active' : ''}`}>
              <button
                className="navbar-link text-glass"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{ border: 'none', background: 'transparent' }}
              >
                <span className="icon">
                  <i className="fas fa-user-circle"></i>
                </span>
                <span>{currentUser?.username || 'Admin'}</span>
              </button>

              <div className="navbar-dropdown is-right">
                <div className="navbar-item">
                  <span className="icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <span>Profile (Coming Soon)</span>
                </div>
                
                <div className="navbar-item">
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  <span>Settings (Coming Soon)</span>
                </div>
                
                <hr className="navbar-divider" />
                
                <button 
                  className="navbar-item"
                  onClick={handleLogout}
                  style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}
                >
                  <span className="icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  <span>Logout</span>
                </button>
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
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;