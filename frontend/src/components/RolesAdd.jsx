import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // ✅ Import Navbar

const RolesAdd = () => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const saveRole = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!roleName.trim()) {
        alert("Role name is required!");
        setIsLoading(false);
        return;
      }

      const roleData = {
        roleName: roleName.trim().toLowerCase(),
        description: description.trim() || `${roleName} role`,
      };

      console.log("Creating role with data:", roleData);

      await axios.post("http://localhost:5000/roles", roleData);
      alert("Role created successfully!");
      navigate("/roles");
    } catch (error) {
      console.log("Error creating role:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to create role: ${error.response.data.message}`);
      } else {
        alert("Failed to create role. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Tambahkan Navbar */}
      <div 
        className="section gradient-background" 
        style={{
          minHeight: '100vh'
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

        <div className="columns mt-5 is-centered" style={{ zIndex: 100, position: 'relative' }}>
          <div className="column is-half" style={{ zIndex: 110, position: 'relative' }}>
            <h1 className="title has-text-white">Add New Role</h1>
            <form onSubmit={saveRole} style={{ 
              zIndex: 120, 
              position: 'relative',
            }}>
              <div className="field">
                <label className="label">Role Name</label>
                <div className="control has-icons-left">
                  <input
                    type="text"
                    className="input"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter role name (e.g., admin, editor, client)"
                    required
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user-tag"></i>
                  </span>
                </div>
                <strong className="help" style={{color:"white"}}>Role name will be converted to lowercase automatically</strong>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="control has-icons-left">
                  <textarea
                    className="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter role description (optional)"
                    rows="3"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-info-circle"></i>
                  </span>
                </div>
                <strong className="help" style={{color:"white"}}>If empty, will use default description</strong>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button 
                    type="submit" 
                    className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Save Role'}
                  </button>
                </div>
                <div className="control">
                  <button 
                    type="button" 
                    className="button is-light" 
                    onClick={() => navigate("/roles")}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>

            <div className="notification is-info is-light mt-4">
              <p><strong>Note:</strong></p>
              <ul>
                <li>Role name is required</li>
                <li>Role name will be converted to lowercase automatically</li>
                <li>Description is optional</li>
                <li>Make sure role name is unique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RolesAdd;