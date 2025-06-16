import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Register attempt:", formData);
      
      // Simulate API call
      setTimeout(() => {
        alert("Registration successful! Please login.");
        navigate("/login");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="background-radial-gradient">
      {/* Floating Shapes Background */}
      <div className="radius-shape-1"></div>
      <div className="radius-shape-2"></div>
      <div className="radius-shape-3"></div>
      <div className="radius-shape-4"></div>
      <div className="radius-shape-5"></div>
      <div className="data-shape-1"></div>
      <div className="data-shape-2"></div>
      <div className="data-shape-3"></div>
      <div className="data-shape-4"></div>

      <div className="content-wrapper">
        <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6-tablet is-5-desktop">
                
                {/* Welcome Header */}
                <div className="has-text-centered mb-6">
                  <div className="mb-4">
                    <span className="icon is-large text-glass">
                      <i className="fas fa-user-plus fa-3x"></i>
                    </span>
                  </div>
                  <h1 className="title is-3 text-glass">Join ForUStudio</h1>
                  <p className="subtitle is-6 text-glass-subtitle">Create your account to get started</p>
                </div>

                {/* Register Form */}
                <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                  <form onSubmit={handleSubmit}>
                    {/* Username & Email Row */}
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label text-glass">Username</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="text"
                              name="username"
                              placeholder="Username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-user"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label text-glass">Email</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="email"
                              name="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-envelope"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="field">
                      <label className="label text-glass">Full Name</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          name="fullName"
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-id-card"></i>
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="field">
                      <label className="label text-glass">Phone (Optional)</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="tel"
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-phone"></i>
                        </span>
                      </div>
                    </div>

                    {/* Password Row */}
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label text-glass">Password</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-lock"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label text-glass">Confirm Password</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="password"
                              name="confirmPassword"
                              placeholder="Confirm password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-lock"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Register Button */}
                    <div className="field">
                      <div className="control">
                        <button
                          type="submit"
                          className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                          disabled={isLoading}
                        >
                          <span className="icon">
                            <i className="fas fa-user-plus"></i>
                          </span>
                          <span>Create Account</span>
                        </button>
                      </div>
                    </div>

                    {/* Login Link */}
                    <div className="has-text-centered mt-4">
                      <p className="text-glass-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-glass-subtitle">
                          <strong>Sign in here</strong>
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="has-text-centered pb-4">
          <p className="text-glass-muted">
            <small>
              ForUStudio © 2024 | Video Editing Freelancing Platform
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;