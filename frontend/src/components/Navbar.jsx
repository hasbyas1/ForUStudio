
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';

const navbarTheme = 'theme-tinted-glass';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileMenuClick = () => {
    setIsActive(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const isCurrentPath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav 
      className={`navbar navbar-forustudio ${navbarTheme} ${isScrolled ? 'scrolled' : ''}`}
      role="navigation" 
      aria-label="main navigation"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        background: 'transparent',
        height: '64px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="navbar-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Link 
          className="navbar-item" 
          to="/dashboard"
          style={{ 
            backgroundColor: 'transparent', 
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <span className="icon-text">
            <span className="icon">
              <i className="fas fa-cube"></i>
            </span>
            <span className="has-text-weight-bold">ForUStudio</span>
          </span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={() => setIsActive(!isActive)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white'
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div 
        className={`navbar-menu ${isActive ? 'is-active' : ''}`}
        style={{ 
          backgroundColor: 'transparent', 
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <div 
          className="navbar-start"
          style={{ 
            backgroundColor: 'transparent', 
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {/* Dashboard Link */}
          <Link 
            className={`navbar-item ${isCurrentPath('/dashboard') ? 'is-active' : ''}`} 
            to="/dashboard"
            onClick={handleMobileMenuClick}
            style={{ 
              backgroundColor: 'transparent', 
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <span className="icon">
              <i className="fas fa-tachometer-alt"></i>
            </span>
            <span>Dashboard</span>
          </Link>

          {/* Projects Link */}
          <Link 
            className={`navbar-item ${isCurrentPath('/projects') ? 'is-active' : ''}`} 
            to="/projects"
            onClick={handleMobileMenuClick}
            style={{ 
              backgroundColor: 'transparent', 
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <span className="icon">
              <i className="fas fa-project-diagram"></i>
            </span>
            <span>Projects</span>
          </Link>


          {/* Admin-only Links */}
          {isAdmin() && (
            <>
              {/* Users Link */}
              <Link 
                className={`navbar-item ${isCurrentPath('/users') ? 'is-active' : ''}`} 
                to="/users"
                onClick={handleMobileMenuClick}
                style={{ 
                  backgroundColor: 'transparent', 
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <span className="icon">
                  <i className="fas fa-users"></i>
                </span>
                <span>Users</span>
              </Link>
              <Link 
                className={`navbar-item ${isCurrentPath('/roles') ? 'is-active' : ''}`} 
                to="/roles"
                onClick={handleMobileMenuClick}
                style={{ 
                  backgroundColor: 'transparent', 
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <span className="icon">
                  <i className="fas fa-user-tag"></i>
                </span>
                <span>Roles</span>
              </Link>

              {/* Admin Quick Actions Dropdown */}
              <div 
                className="navbar-item has-dropdown is-hoverable"
                style={{ 
                  backgroundColor: 'transparent', 
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <a 
                  className="navbar-link"
                  style={{
                    backgroundColor: 'transparent',
                    background: 'transparent',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Quick Add</span>
                </a>
                <div 
                  className="navbar-dropdown"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <Link 
                    className="navbar-item"
                    to="/users/add"
                    onClick={handleMobileMenuClick}
                    style={{
                      color: '#2c3e50',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="icon" style={{ marginRight: '8px' }}>
                      <i className="fas fa-user-plus"></i>
                    </span>
                    <span>Add User</span>
                  </Link>
                  <Link 
                    className="navbar-item"
                    to="/roles/add"
                    onClick={handleMobileMenuClick}
                    style={{
                      color: '#2c3e50',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="icon" style={{ marginRight: '8px' }}>
                      <i className="fas fa-plus-circle"></i>
                    </span>
                    <span>Add Role</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div 
          className="navbar-end"
          style={{ 
            backgroundColor: 'transparent', 
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {/* User Dropdown */}
          <div 
            className="custom-dropdown-container"
            ref={dropdownRef}
            style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <button 
              className="navbar-item navbar-link custom-dropdown-button"
              onClick={toggleUserDropdown}
              style={{
                backgroundColor: userDropdownOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                background: userDropdownOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                margin: '0 4px',
                padding: '0.5rem 0.75rem',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto'
              }}
            >
              <span className="icon">
                <i className="fas fa-user-circle"></i>
              </span>
              <span>{user?.fullName || 'User'}</span>
              <span className={`tag is-small ${
                user?.role?.roleName === 'admin' ? 'is-danger' :
                user?.role?.roleName === 'editor' ? 'is-warning' :
                'is-info'
              }`}>
                {user?.role?.roleName || 'client'}
              </span>
              <span 
                className="icon"
                style={{
                  transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <i className="fas fa-chevron-down"></i>
              </span>
            </button>

            {/* Custom Dropdown Menu */}
            {userDropdownOpen && (
              <div 
                className="custom-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '8px',
                  minWidth: '200px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 9999,
                  overflow: 'hidden'
                }}
              >
                {/* User Info Header */}
                <div 
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <p style={{ margin: '0', fontWeight: '600', color: '#2c3e50' }}>
                    {user?.fullName}
                  </p>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0.5rem 0' }}>
                  <Link
                    to="/profile"
                    className="custom-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleMobileMenuClick();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      color: '#2c3e50',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="icon">
                      <i className="fas fa-user-cog"></i>
                    </span>
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="custom-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleMobileMenuClick();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      color: '#2c3e50',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="icon">
                      <i className="fas fa-tachometer-alt"></i>
                    </span>
                    <span>Dashboard</span>
                  </Link>

                  <div style={{ height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.1)', margin: '0.5rem 0' }}></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
      </div>
    </nav>
  );
};

export default Navbar;