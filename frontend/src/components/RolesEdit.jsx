import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const RolesEdit = () => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getRoleById = async () => {
      try {
        setRoleLoading(true);
        const response = await axios.get(`http://localhost:5000/roles/${id}`);
        const role = response.data;

        setRoleName(role.roleName || "");
        setDescription(role.description || "");
      } catch (error) {
        console.log("Error fetching role:", error);
        alert("Failed to load role data. Please try again.");
        navigate("/roles");
      } finally {
        setRoleLoading(false);
      }
    };

    if (id) {
      getRoleById();
    }
  }, [id, navigate]);

  const updateRole = async (e) => {
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
        roleName: roleName.trim().toLowerCase(),
        description: description.trim() || `${roleName} role`,
      };

      console.log("Updating role with data:", roleData);

      await axios.put(`http://localhost:5000/roles/${id}`, roleData);
      alert("Role updated successfully!");
      navigate("/roles");
    } catch (error) {
      console.log("Error updating role:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to update role: ${error.response.data.message}`);
      } else {
        alert("Failed to update role. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Loading state saat mengambil data role
  if (roleLoading) {
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
            <div className="notification is-white has-text-centered">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <i className="fas fa-spinner fa-spin fa-lg"></i>
                <p className="title is-5">Loading role data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <h1 className="title">Edit Role</h1>
          <form onSubmit={updateRole}>
            {/* Role Name Field */}
            <div className="field">
              <label className="label">Role Name *</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter role name"
                  required
                  disabled={roleName === 'admin'} // Protect admin role name
                />
              </div>
              {roleName === 'admin' && (
                <p className="help has-text-warning">Admin role name cannot be changed</p>
              )}
            </div>

            {/* Description Field */}
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter role description"
                  rows="3"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="field is-grouped">
              <div className="control">
                <button 
                  type="submit" 
                  className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Role'}
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
              <li>Admin role name cannot be changed for security</li>
              <li>Changing role name may affect users with this role</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesEdit;