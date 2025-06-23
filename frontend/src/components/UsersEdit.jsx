// frontend/src/components/UsersEdit.jsx (Complete)
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import Navbar from "./Navbar";

import "../styles/glass-theme.css";

const UsersEdit = () => {
  // ✅ State sesuai dengan field yang ada di UserModel
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("-");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const getUserById = async () => {
      try {
        setUserLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        // ✅ Set semua field dari response
        setEmail(userData.email || "");
        setUsername(userData.username || "");
        setPassword(""); // Kosongkan password untuk security
        setFullName(userData.fullName || "");
        setGender(userData.gender || "-");
        setPhone(userData.phone || "");
        setRoleId(userData.roleId || 3);
        setIsActive(userData.isActive !== undefined ? userData.isActive : true);
      } catch (error) {
        console.log("Error fetching user:", error);
        setError("Failed to load user data. Please try again.");
        setTimeout(() => navigate("/users"), 2000);
      } finally {
        setUserLoading(false);
      }
    };

    const getRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/roles", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const rolesData = await response.json();
        setRoles(rolesData);
      } catch (error) {
        console.log("Error fetching roles:", error);
        setError("Failed to load roles. Please refresh the page.");
      }
    };

    if (id) {
      getUserById();
      getRoles();
    }
  }, [id, navigate]);

  const updateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ Validasi input
      if (!email || !username || !fullName) {
        throw new Error("Please fill all required fields!");
      }

      // ✅ Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address!");
      }

      // ✅ Username validation
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters!");
      }

      // ✅ Password validation (only if provided)
      if (password && password.length < 8) {
        throw new Error("Password must be at least 8 characters!");
      }

      // ✅ Phone validation (only if provided)
      if (phone && !/^[0-9]{10,13}$/.test(phone)) {
        throw new Error("Phone must be 10-13 digits only!");
      }

      // ✅ Prepare update data
      const updateData = {
        email,
        username,
        fullName,
        gender,
        phone: phone || null,
        roleId: parseInt(roleId),
        isActive
      };

      // Only include password if it's provided
      if (password.trim()) {
        updateData.password = password;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      // Success - redirect to users list
      navigate("/users");
    } catch (error) {
      console.log("Error updating user:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current user can edit role and status
  const canEditRole = () => {
    return isAdmin();
  };

  const canEditStatus = () => {
    return isAdmin();
  };

  if (userLoading) {
    return (
      <>
        <Navbar />
        <div className="section gradient-background" style={{ minHeight: '100vh' }}>
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
            <div className="section">
              <div className="container">
                <div className="has-text-centered">
                  <div className="is-size-1 mb-4">
                    <i className="fas fa-spinner fa-spin has-text-primary"></i>
                  </div>
                  <p className="title is-5 text-glass">Loading User Data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="section gradient-background" style={{ minHeight: '100vh' }}>
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
          <div className="section">
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-6-desktop is-8-tablet">
                  {/* Header */}
                  <div className="level mb-5">
                    <div className="level-left">
                      <div className="level-item">
                        <h1 className="title text-glass">
                          <i className="fas fa-user-edit mr-3"></i>
                          Edit {parseInt(id) === user?.userId ? 'Profile' : 'User'}
                        </h1>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <button 
                          className="button is-light"
                          onClick={() => {
                            // Navigate based on user role
                            if (user?.role?.roleName === 'admin') {
                              navigate("/users");
                            } else {
                              navigate("/dashboard");
                            }
                          }}
                          disabled={isLoading}
                        >
                          <span className="icon">
                            <i className="fas fa-arrow-left"></i>
                          </span>
                          <span>Back to Users</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="notification is-danger mb-5">
                      <button className="delete" onClick={() => setError("")}></button>
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <div className="bg-glass" style={{ padding: '2rem', borderRadius: '15px' }}>
                    <form onSubmit={updateUser}>
                      {/* Email Field */}
                      <div className="field">
                        <label className="label table-text-white">Email *</label>
                        <div className="control has-icons-left">
                          <input 
                            className="input" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter email address"
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                          </span>
                        </div>
                      </div>

                      {/* Username Field */}
                      <div className="field">
                        <label className="label table-text-white">Username *</label>
                        <div className="control has-icons-left">
                          <input 
                            className="input" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter username"
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fas fa-user"></i>
                          </span>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="field">
                        <label className="label table-text-white">Password</label>
                        <div className="control has-icons-left">
                          <input 
                            className="input" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Leave blank to keep current password"
                          />
                          <span className="icon is-small is-left">
                            <i className="fas fa-lock"></i>
                          </span>
                        </div>
                        <p className="help table-text-white">Minimum 8 characters (optional)</p>
                      </div>

                      {/* Full Name Field */}
                      <div className="field">
                        <label className="label table-text-white">Full Name *</label>
                        <div className="control has-icons-left">
                          <input 
                            className="input" 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            placeholder="Enter full name"
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fas fa-id-card"></i>
                          </span>
                        </div>
                      </div>

                      {/* Gender Field */}
                      <div className="field">
                        <label className="label table-text-white">Gender</label>
                        <div className="control">
                          <div className="select is-fullwidth">
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                              <option value="-">Not specified</option>
                              <option value="laki-laki">Laki-laki</option>
                              <option value="perempuan">Perempuan</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="field">
                        <label className="label table-text-white">Phone</label>
                        <div className="control has-icons-left">
                          <input 
                            className="input" 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="Phone Number (Optional)"
                            pattern="[0-9]{10,13}"
                          />
                          <span className="icon is-small is-left">
                            <i className="fas fa-phone"></i>
                          </span>
                        </div>
                        <p className="help table-text-white">Numbers only, 10-13 digits (optional)</p>
                      </div>

                      {/* Role Field - Only show if admin */}
                      {canEditRole() && (
                        <div className="field">
                          <label className="label table-text-white">Role *</label>
                          <div className="control">
                            <div className="select is-fullwidth">
                              <select value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value))}>
                                {roles.map((role) => (
                                  <option key={role.roleId} value={role.roleId}>
                                    {role.roleName} - {role.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status Field - Only show if admin */}
                      {canEditStatus() && (
                        <div className="field">
                          <label className="label table-text-white">Status</label>
                          <div className="control">
                            <label className="checkbox table-text-white">
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                              />
                              {" "}User is active
                            </label>
                          </div>
                          <p className="help table-text-white">Uncheck to deactivate user account</p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="field is-grouped is-grouped-right">
                        <div className="control">
                          <button 
                            type="button" 
                            className="button is-light mr-3" 
                            onClick={() => {
                              // Navigate based on user role
                              if (user?.role?.roleName === 'admin') {
                                navigate("/users");
                              } else {
                                navigate("/dashboard");
                              }
                            }}
                            disabled={isLoading}
                          >
                            <span className="icon">
                              <i className="fas fa-times"></i>
                            </span>
                            <span>Cancel</span>
                          </button>
                        </div>
                        <div className="control">
                          <button 
                            type="submit" 
                            className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                            disabled={isLoading}
                          >
                            <span className="icon">
                              <i className="fas fa-save"></i>
                            </span>
                            <span>{isLoading ? 'Updating...' : 'Update Profile'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Info Box */}
                  <div className="bg-glass mt-5" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                    <h4 className="title is-6 table-text-white">
                      <i className="fas fa-info-circle mr-2"></i>
                      Information
                    </h4>
                    <div className="content table-text-white">
                      <ul>
                        <li>Fields marked with * are required</li>
                        <li>User ID cannot be changed</li>
                        <li>Leave password blank to keep current password</li>
                        {!canEditRole() && <li>Only administrators can change user roles</li>}
                        {!canEditStatus() && <li>Only administrators can change user status</li>}
                        {parseInt(id) === user?.userId && (
                          <li><strong>You are editing your own profile</strong></li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersEdit;