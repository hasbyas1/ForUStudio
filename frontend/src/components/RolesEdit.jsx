import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar"; // ✅ Import Navbar

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

  // ✅ Loading state dengan Navbar
  if (roleLoading) {
    return (
      <>
        <Navbar />
        <div 
          className="gradient-background" 
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

          <div className="columns mt-5 is-centered">
            <div className="column is-half">
              <div className="bg-glass has-text-centered" style={{ padding: '2rem', margin: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <i className="fas fa-spinner fa-spin fa-lg text-glass"></i>
                  <p className="title is-5 text-glass">Loading role data...</p>
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
      <Navbar /> {/* ✅ Tambahkan Navbar */}
      <div 
        className="gradient-background" 
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
            <h1 className="title has-text-white">Edit Role</h1>
            <form onSubmit={updateRole} style={{ 
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
                    placeholder="Enter role name"
                    required
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user-tag"></i>
                  </span>
                </div >
                <strong className="help" style={{color:"white"}}>Role name will be converted to lowercase automatically</strong>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="control has-icons-left">
                  <textarea
                    className="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter role description"
                    rows="3"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-info-circle"></i>
                  </span>
                </div>
              </div>

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
          </div>
        </div>
      </div>
    </>
  );
};

export default RolesEdit;