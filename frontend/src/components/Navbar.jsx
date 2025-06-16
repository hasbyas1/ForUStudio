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

          {/* Projects menu (disabled for now) */}
          <span className="navbar-item text-glass" style={{ opacity: 0.5 }}>
            <span className="icon">
              <i className="fas fa-project-diagram"></i>
            </span>
            <span>Projects</span>
            <span className="tag is-small is-warning ml-2">Soon</span>
          </span>
        </div>

        {/* Right side navigation */}
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;