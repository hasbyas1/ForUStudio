import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "../styles/background.css"; // Pastikan Anda memiliki file CSS untuk styling

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "-",
    phone: "",
    roleId: 3 // Default client role
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();

  // Fetch roles
  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setRoles(response.data);
      } catch (error) {
        console.log("Error fetching roles:", error);
      }
    };
    getRoles();
  }, []);

  // Check password match
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'roleId' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi input
      if (!formData.email || !formData.username || !formData.password || !formData.fullName) {
        alert("Please fill all required fields!");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        alert("Password must be at least 8 characters long!");
        setIsLoading(false);
        return;
      }

      // Prepare data
      const userData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        roleId: formData.roleId
      };

      // Add phone if provided
      if (formData.phone.trim()) {
        userData.phone = formData.phone.trim();
      }

      console.log("Register attempt:", { ...userData, password: "***" });

      // Send registration request
      await axios.post("http://localhost:5000/auth/register", userData);
      
      alert("Registration successful! Please login with your credentials.");
      navigate("/login");
    } catch (error) {
      console.log("Registration error:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="section gradient-background" 
      style={{
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-6">
            <div className="box" style={{ borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              {/* Header */}
              <div className="has-text-centered mb-5">
                <h1 className="title is-3 has-text-primary">
                  <span className="icon is-large">
                    <i className="fas fa-user-plus"></i>
                  </span>
                </h1>
                <h2 className="title is-4">Create Account</h2>
                <p className="subtitle is-6 has-text-grey">Join us today! It's quick and easy.</p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="columns is-multiline">
                  {/* Email Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Email Address *</label>
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
                  </div>

                  {/* Username Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Username *</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          minLength={3}
                          maxLength={50}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full Name Field */}
                  <div className="column is-12">
                    <div className="field">
                      <label className="label">Full Name *</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          minLength={3}
                          maxLength={100}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-id-card"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Password *</label>
                      <div className="control has-icons-left has-icons-right">
                        <input
                          className="input"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          minLength={8}
                          maxLength={100}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-lock"></i>
                        </span>
                        <span 
                          className="icon is-small is-right is-clickable"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ pointerEvents: 'all' }}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                      </div>
                      <p className="help">At least 8 characters</p>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Confirm Password *</label>
                      <div className="control has-icons-left has-icons-right">
                        <input
                          className={`input ${formData.confirmPassword && !passwordMatch ? 'is-danger' : formData.confirmPassword && passwordMatch ? 'is-success' : ''}`}
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-lock"></i>
                        </span>
                        <span 
                          className="icon is-small is-right is-clickable"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ pointerEvents: 'all' }}
                        >
                          <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                      </div>
                      {formData.confirmPassword && !passwordMatch && (
                        <p className="help is-danger">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  {/* Gender Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Gender</label>
                      <div className="control has-icons-left">
                        <div className="select is-fullwidth">
                          <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="-">Not Specified</option>
                            <option value="laki-laki">Laki-laki</option>
                            <option value="perempuan">Perempuan</option>
                          </select>
                        </div>
                        <span className="icon is-small is-left">
                          <i className="fas fa-venus-mars"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="column is-6">
                    <div className="field">
                      <label className="label">Phone Number</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number (optional)"
                          value={formData.phone}
                          onChange={handleChange}
                          pattern="[0-9]{10,13}"
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-phone"></i>
                        </span>
                      </div>
                      <p className="help">Optional, 10-13 digits</p>
                    </div>
                  </div>

                  {/* Role Field */}
                  <div className="column is-12">
                    <div className="field">
                      <label className="label">Account Type</label>
                      <div className="control has-icons-left">
                        <div className="select is-fullwidth">
                          <select name="roleId" value={formData.roleId} onChange={handleChange}>
                            {roles.map((role) => (
                              <option key={role.roleId} value={role.roleId}>
                                {role.roleName.charAt(0).toUpperCase() + role.roleName.slice(1)} - {role.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="icon is-small is-left">
                          <i className="fas fa-user-tag"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="field">
                  <label className="checkbox">
                    <input type="checkbox" required />
                    {" "}I agree to the{" "}
                    <a href="#" className="has-text-link">Terms and Conditions</a>
                    {" "}and{" "}
                    <a href="#" className="has-text-link">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="field">
                  <button 
                    type="submit" 
                    className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading || !passwordMatch}
                  >
                    <span className="icon">
                      <i className="fas fa-user-plus"></i>
                    </span>
                    <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                  </button>
                </div>
              </form>

              {/* Divider */}
              <hr />

              {/* Login Link */}
              <div className="has-text-centered">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="has-text-link has-text-weight-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;