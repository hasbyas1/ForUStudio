import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ 
  title = "ForUStudio", 
  showUserMenu = true, 
  currentUser = null,
  variant = "default" // default, green, purple, orange, dark
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk menentukan apakah link aktif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Fungsi logout
  const handleLogout = () => {
    // Add your logout logic here
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login');
    }
  };

  // Fungsi untuk mendapatkan kelas navbar berdasarkan variant
  const getNavbarClass = () => {
    switch(variant) {
      case 'green':
        return 'navbar-gradient-green';
      case 'purple':
        return 'navbar-gradient-purple';
      case 'orange':
        return 'navbar-gradient-orange';
      case 'dark':
        return 'navbar-gradient-dark';
      default:
        return 'navbar-gradient';
    }
  };

  return (
    <nav className={`navbar is-fixed-top ${getNavbarClass()}`} role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        {/* Logo/Brand */}
        <Link className="navbar-item" to="/users">
          <span className="text-glass">
            <strong>
              <i className="fas fa-video mr-2"></i>
              {title}
            </strong>
          </span>
        </Link>

        {/* Mobile burger menu */}
        <button
          className={`navbar-burger burger ${isMenuOpen ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ border: 'none', background: 'transparent' }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
        {/* Left side navigation */}
        <div className="navbar-start">
          <Link 
            className={`navbar-item text-glass ${isActiveLink('/users') ? 'has-background-white-bis' : ''}`}
            to="/users"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="icon">
              <i className="fas fa-users"></i>
            </span>
            <span>Users</span>
          </Link>

          <Link 
            className={`navbar-item text-glass ${isActiveLink('/roles') ? 'has-background-white-bis' : ''}`}
            to="/roles"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="icon">
              <i className="fas fa-user-tag"></i>
            </span>
            <span>Roles</span>
          </Link>

          {/* Dropdown for Projects (future feature) */}
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link text-glass">
              <span className="icon">
                <i className="fas fa-project-diagram"></i>
              </span>
              <span>Projects</span>
            </a>
            <div className="navbar-dropdown">
              <a className="navbar-item">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>New Project</span>
              </a>
              <a className="navbar-item">
                <span className="icon">
                  <i className="fas fa-list"></i>
                </span>
                <span>All Projects</span>
              </a>
              <hr className="navbar-divider" />
              <a className="navbar-item">
                <span className="icon">
                  <i className="fas fa-archive"></i>
                </span>
                <span>Archived</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right side navigation */}
        <div className="navbar-end">
          {/* Theme Switcher */}
          <div className="navbar-item">
            <div className="buttons">
              <button 
                className="button is-small is-transparent text-glass"
                title="Default Theme"
                onClick={() => window.location.reload()}
              >
                🔵
              </button>
              <button 
                className="button is-small is-transparent text-glass"
                title="Green Theme"
                onClick={() => {/* Add theme switching logic */}}
              >
                🟢
              </button>
              <button 
                className="button is-small is-transparent text-glass"
                title="Purple Theme"
                onClick={() => {/* Add theme switching logic */}}
              >
                🟣
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="navbar-item">
            <button className="button is-transparent text-glass" title="Notifications">
              <span className="icon">
                <i className="fas fa-bell"></i>
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
                <span>{currentUser?.username || 'User'}</span>
              </button>

              <div className="navbar-dropdown is-right">
                <Link className="navbar-item" to="/profile">
                  <span className="icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <span>Profile</span>
                </Link>
                
                <Link className="navbar-item" to="/settings">
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  <span>Settings</span>
                </Link>
                
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;