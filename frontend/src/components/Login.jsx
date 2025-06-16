import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Login attempt:", { email, password, rememberMe });
      
      // Simulate API call - replace with real authentication
      setTimeout(() => {
        // Mock successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', email.split('@')[0]);
        
        alert("Login successful!");
        navigate("/users");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
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
              <div className="column is-5-tablet is-4-desktop">
                
                {/* Welcome Header */}
                <div className="has-text-centered mb-6">
                  <div className="mb-4">
                    <span className="icon is-large text-glass">
                      <i className="fas fa-user-circle fa-3x"></i>
                    </span>
                  </div>
                  <h1 className="title is-3 text-glass">Welcome Back</h1>
                  <p className="subtitle is-6 text-glass-subtitle">Please sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                  <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="field">
                      <label className="label text-glass">Email Address</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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

                    {/* Password Input */}
                    <div className="field">
                      <label className="label text-glass">Password</label>
                      <div className="control has-icons-left has-icons-right">
                        <input
                          className="input"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                        <span 
                          className="icon is-small is-right"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="field">
                      <div className="level">
                        <div className="level-left">
                          <label className="checkbox text-glass">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              style={{ marginRight: '0.5rem' }}
                            />
                            Remember me
                          </label>
                        </div>
                        <div className="level-right">
                          <a href="#" className="text-glass-subtitle" onClick={(e) => { e.preventDefault(); alert('Forgot password feature coming soon!'); }}>
                            Forgot Password?
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <div className="field">
                      <div className="control">
                        <button
                          type="submit"
                          className={`button is-success is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                          disabled={isLoading}
                        >
                          <span className="icon">
                            <i className="fas fa-sign-in-alt"></i>
                          </span>
                          <span>Sign In</span>
                        </button>
                      </div>
                    </div>

                    {/* Register Link */}
                    <div className="has-text-centered mt-4">
                      <p className="text-glass-muted">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-glass-subtitle">
                          <strong>Create one here</strong>
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>

                {/* Demo Credentials */}
                <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                  <h5 className="title is-6 text-glass">Demo Credentials:</h5>
                  
                  <div className="content">
                    <div className="mb-3">
                      <strong className="text-glass">Admin:</strong>
                      <div className="text-glass-muted">
                        <p>📧 admin@example.com</p>
                        <p>🔑 admin123</p>
                      </div>
                    </div>
                    
                    <hr style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    
                    <div className="mb-3">
                      <strong className="text-glass">Editor:</strong>
                      <div className="text-glass-muted">
                        <p>📧 editor@example.com</p>
                        <p>🔑 editor123</p>
                      </div>
                    </div>
                    
                    <hr style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    
                    <div>
                      <strong className="text-glass">Client:</strong>
                      <div className="text-glass-muted">
                        <p>📧 client@example.com</p>
                        <p>🔑 client123</p>
                      </div>
                    </div>
                  </div>
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

export default Login;