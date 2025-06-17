import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State untuk mengontrol dropdown
  const [addNewDropdownOpen, setAddNewDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navbarTheme = 'theme-tinted-glass';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = event.target.closest('.custom-dropdown-container');
      if (!isClickInsideDropdown) {
        setAddNewDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  // Handler untuk toggle dropdown Add New  
  const toggleAddNewDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddNewDropdownOpen(!addNewDropdownOpen);
    setUserDropdownOpen(false);
  };

  // Handler untuk toggle dropdown User
  const toggleUserDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
    setAddNewDropdownOpen(false);
  };

  const handleMobileMenuClick = () => {
    setIsActive(false);
    setAddNewDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const excludedPaths = ['/login', '/register'];
  
  if (!isAuthenticated() || excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav 
      className={`navbar navbar-forustudio ${navbarTheme} ${isScrolled ? 'scrolled' : ''}`}
      role="navigation" 
      aria-label="main navigation"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        background: 'transparent',
        height: '64px', // Fixed height untuk navbar
        display: 'flex',
        alignItems: 'center' // Vertical center untuk seluruh navbar
      }}
    >
      <div 
        className="navbar-brand"
        style={{
          display: 'flex',
          alignItems: 'center', // Vertical center untuk brand
          height: '100%'
        }}
      >
        <Link 
          className="navbar-item" 
          to="/users"
          style={{ 
            backgroundColor: 'transparent', 
            background: 'transparent',
            display: 'flex',
            alignItems: 'center', // Vertical center untuk link
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
      </div>

      <div 
        className={`navbar-menu ${isActive ? 'is-active' : ''}`}
        style={{ 
          backgroundColor: 'transparent', 
          background: 'transparent',
          display: 'flex',
          alignItems: 'center', // Vertical center untuk menu
          height: '100%'
        }}
      >
        <div 
          className="navbar-start"
          style={{ 
            backgroundColor: 'transparent', 
            background: 'transparent',
            display: 'flex',
            alignItems: 'center', // Vertical center untuk start items
            height: '100%'
          }}
        >
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

          {isAdmin() && (
            <>
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

              {/* Add New Dropdown - CUSTOM IMPLEMENTATION */}
              <div 
                className="custom-dropdown-container"
                style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <button 
                  className="navbar-item navbar-link custom-dropdown-button"
                  onClick={toggleAddNewDropdown}
                  style={{
                    backgroundColor: addNewDropdownOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    background: addNewDropdownOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
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
                    height: 'auto'
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add New</span>
                  <span 
                    className="icon"
                    style={{
                      marginLeft: '8px',
                      transform: addNewDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                  </span>
                </button>
                
                {/* Dropdown Menu dengan Conditional Rendering */}
                {addNewDropdownOpen && (
                  <div 
                    className="custom-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      minWidth: '200px',
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      marginTop: '8px',
                      zIndex: '9999',
                      overflow: 'hidden'
                    }}
                  >
                    <Link 
                      className="custom-dropdown-item" 
                      to="/users/add"
                      onClick={handleMobileMenuClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s ease',
                        borderRadius: '8px',
                        margin: '4px 8px'
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
                      className="custom-dropdown-item" 
                      to="/roles/add"
                      onClick={handleMobileMenuClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s ease',
                        borderRadius: '8px',
                        margin: '4px 8px'
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
                )}
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
            alignItems: 'center', // Vertical center untuk end items
            height: '100%'
          }}
        >
          {/* User Dropdown - CUSTOM IMPLEMENTATION */}
          <div 
            className="custom-dropdown-container"
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

              </span>
            </button>
            
            {/* User Dropdown Menu dengan Conditional Rendering */}
            {userDropdownOpen && (
              <div 
                className="custom-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  minWidth: '250px',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  marginTop: '8px',
                  zIndex: '9999',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#666' }}>
                    <strong style={{color:"black"}}>Email:</strong> {user?.email}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#666' }}>
                    <strong style={{color:"black"}}>Username:</strong> {user?.username}
                  </p>
                  {user?.phone && (
                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>
                      <strong style={{color:"black"}}>Phone:</strong> {user?.phone}
                    </p>
                  )}
                </div>
                
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '8px',
                    margin: '4px 8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span className="icon" style={{ marginRight: '8px' }}>
                    <i className="fas fa-user-edit"></i>
                  </span>
                  <span>Edit Profile</span>
                </a>
                
                {/* <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '8px',
                    margin: '4px 8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span className="icon" style={{ marginRight: '8px' }}>
                    <i className="fas fa-cog"></i>
                  </span>
                  <span>Settings</span>
                </a> */}
                
                <hr style={{ margin: '8px 0', backgroundColor: 'rgba(0, 0, 0, 0.1)', height: '1px', border: 'none' }} />
                
                <a 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    color: '#ff3860',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '8px',
                    margin: '4px 8px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 56, 96, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span className="icon" style={{ marginRight: '8px' }}>
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