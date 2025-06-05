import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RolesAdd = () => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function saveRole(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Validasi input
      if (!roleName.trim()) {
        alert("Role name is required!");
        setIsLoading(false);
        return;
      }

      const roleData = {
        roleName: roleName.trim().toLowerCase(), // Convert to lowercase
        description: description.trim() || `${roleName} role`, // Default description
      };

      console.log("Sending role data:", roleData);

      await axios.post("http://localhost:5000/roles", roleData);
      
      alert("Role created successfully!");
      navigate("/roles"); // Kembali ke RoleList
    } catch (error) {
      console.log("Error creating role:", error);
      
      // ✅ Handle error response dari backend
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to create role: ${error.response.data.message}`);
      } else {
        alert("Failed to create role. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div 
      className="section" 
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}
    >
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <h1 className="title">Add New Role</h1>
          <form onSubmit={saveRole}>
            {/* Role Name Field */}
            <div className="field">
              <label className="label">Role Name *</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter role name (e.g., manager, staff)"
                  required
                />
              </div>
              <p className="help">Role name will be converted to lowercase</p>
            </div>

            {/* Description Field */}
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter role description (optional)"
                  rows="3"
                />
              </div>
              <p className="help">Optional. If empty, will use default description</p>
            </div>

            {/* Buttons */}
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

          {/* Info */}
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
  );
};

export default RolesAdd;