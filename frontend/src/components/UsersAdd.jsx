import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/background.css"; // Pastikan Anda memiliki file CSS untuk styling
import "../styles/navbar.css"; // Pastikan Anda memiliki file CSS untuk styling

const UsersAdd = () => {
  // ✅ Update state sesuai dengan UsersModel
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("-"); // Default sesuai model
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(3); // Default client
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch roles saat komponen dimount
  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setRoles(response.data);
      } catch (error) {
        console.log("Error fetching roles:", error);
        alert("Failed to load roles. Please refresh the page.");
      }
    };

    getRoles();
  }, []);

  // ✅ Function untuk submit form - ubah dari saveUser
  async function saveUser(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Validasi input
      if (!email || !username || !password || !fullName) {
        alert("Please fill all required fields!");
        setIsLoading(false);
        return;
      }

      // ✅ Prepare data sesuai dengan UsersModel
      const userData = {
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        gender,
        roleId: parseInt(roleId),
      };

      // ✅ Tambahkan phone jika diisi
      if (phone.trim()) {
        userData.phone = phone.trim();
      }

      console.log("Sending user data:", userData);

      // ✅ Kirim request ke backend
      await axios.post("http://localhost:5000/users", userData);
      
      alert("User created successfully!");
      navigate("/users"); // Kembali ke UserList
    } catch (error) {
      console.log("Error creating user:", error);
      
      // ✅ Handle error response dari backend
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to create user: ${error.response.data.message}`);
      } else {
        alert("Failed to create user. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar/>
      <div
        className="gradient-background"
          style={{
          minHeight: '100vh'
        }}
      >
        <div className="radius-shape-1"></div>
        <div className="radius-shape-2"></div>
        <div className="radius-shape-3"></div>
        <div className="radius-shape-4"></div>
        <div className="radius-shape-5"></div>
        <div className="data-shape-1"></div>
        <div className="data-shape-2"></div>
        <div className="data-shape-3"></div>
        <div className="data-shape-4"></div>
        
        <div className="columns mt-5 is-centered" style={{ zIndex: 100, position: 'relative' }}>
          <div className="column is-half" style={{ zIndex: 110, position: 'relative' }}>
            <h1 className="title has-text-white">Add New User</h1>
            <form onSubmit={saveUser} style={{ 
              zIndex: 120, 
              position: 'relative',
            }}>
              {/* Email Field */}
              <div className="field">
                <label className="label">Email *</label>
                <div className="control">
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="field">
                <label className="label">Username *</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (3-50 characters)"
                    minLength={3}
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="field">
                <label className="label">Password *</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 8 characters)"
                    minLength={8}
                    maxLength={100}
                    required
                  />
                </div>
                <strong className="help" style={{color:"white"}}>Password must be at least 8 characters long</strong>
              </div>

              {/* Full Name Field - Ganti dari "Name" */}
              <div className="field">
                <label className="label">Full Name *</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    minLength={3}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              {/* Gender Field - Update options */}
              <div className="field">
                <label className="label">Gender</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="-">Not Specified</option>
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Phone Field - Tambahan baru */}
              <div className="field">
                <label className="label">Phone</label>
                <div className="control">
                  <input
                    type="tel"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number (10-13 digits, optional)"
                    pattern="[0-9]{10,13}"
                  />
                </div>
                <strong className="help" style={{color:"white"}}>Optional. Numbers only, 10-13 digits</strong>
              </div>

              {/* Role Field - Tambahan baru */}
              <div className="field">
                <label className="label">Role *</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select 
                      value={roleId} 
                      onChange={(e) => setRoleId(parseInt(e.target.value))}
                      required
                    >
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName} - {role.description}
                          </option>
                        ))
                      ) : (
                        <option value="">Loading roles...</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons - Update dengan loading state */}
              <div className="field is-grouped">
                <div className="control">
                  <button 
                    type="submit" 
                    className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Save'}
                  </button>
                </div>
                <div className="control">
                  <button 
                    type="button" 
                    className="button is-light" 
                    onClick={() => navigate("/users")}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>

            {/* Required Fields Info */}
            <div className="notification is-info is-light mt-4">
              <p><strong>Note:</strong></p>
              <ul>
                <li>Fields marked with * are required</li>
                <li>User ID will be generated automatically</li>
                <li>Default role is Client if not specified</li>
                <li>User will be active by default</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersAdd;