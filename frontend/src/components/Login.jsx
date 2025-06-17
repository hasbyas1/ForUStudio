import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ← Import dari contexts

import "../styles/background.css"; // Pastikan Anda memiliki file CSS untuk styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/users", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi input
      if (!formData.email || !formData.password) {
        alert("Please fill all fields!");
        setIsLoading(false);
        return;
      }

      console.log("Login attempt:", { email: formData.email });

      // Gunakan login function dari AuthContext
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        const { user } = result;
        
        // Success message
        alert(`Welcome back, ${user.fullName}!`);
        
        // Redirect ke /users untuk semua user
        navigate("/users", { replace: true });
        
      } else {
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      console.log("Login error:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Login failed: ${error.response.data.message}`);
      } else {
        alert("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password feature coming soon!");
  };

  return (
    <div 
      className="gradient-background" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Floating Shapes */}
      <div className="radius-shape-1"></div>
      <div className="radius-shape-2"></div>
      <div className="radius-shape-3"></div>
      <div className="radius-shape-4"></div>
      <div className="radius-shape-5"></div>
      <div className="data-shape-1"></div>
      <div className="data-shape-2"></div>
      <div className="data-shape-3"></div>
      <div className="data-shape-4"></div>

      <div className="container">
        <div className="columns is-centered">
          <div className="column is-4">
            <div className="box" style={{ borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              {/* Header */}
              <div className="has-text-centered mb-5">
                <h1 className="title is-3 has-text-primary">
                  <span className="icon is-large">
                    <i className="fas fa-user-circle"></i>
                  </span>
                </h1>
                <h2 className="title is-4">Welcome to ForUStudio</h2>
                <p className="subtitle is-6 has-text-grey">Please sign in to your account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="field">
                  <label className="label">Email Address</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                    <span 
                      className="icon is-small is-right is-clickable"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ pointerEvents: 'all', cursor: 'pointer' }}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="field">
                  <div className="level">
                    <div className="level-left">
                      <label className="checkbox">
                        <input type="checkbox" />
                        {" "}Remember me
                      </label>
                    </div>
                    <div className="level-right">
                      <button 
                        type="button"
                        className="button is-text is-small"
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="field">
                  <button 
                    type="submit" 
                    className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                  >
                    <span className="icon">
                      <i className="fas fa-sign-in-alt"></i>
                    </span>
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  </button>
                </div>
              </form>

              {/* Divider */}
              <hr />

              {/* Register Link */}
              <div className="has-text-centered">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="has-text-link has-text-weight-semibold">
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr />

            {/* Quote */}
            <div className="has-text-centered">
              <p style={{color: "black"}}>
                It was designed and made just for U!{" "}
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="notification is-info bg-glass is-light mt-4">
              <p className="has-text-weight-semibold">Demo Credentials:</p>
              <div className="content">
                <p><strong>Admin:</strong></p>
                <p>📧 admin@example.com</p>
                <p>🔑 admin123</p>
                <hr style={{ margin: '0.5rem 0' }} />
                <p><strong>Editor:</strong></p>
                <p>📧 editor@example.com</p>
                <p>🔑 editor123</p>
                <hr style={{ margin: '0.5rem 0' }} />
                <p><strong>Client:</strong></p>
                <p>📧 client@example.com</p>
                <p>🔑 client123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;