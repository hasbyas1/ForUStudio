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
        <div className="section gradient-background" style={{minHeight: '100vh'}}>
          <div className="column is-fluid">
            <div className="notification is-info">
              <p>Loading role data...</p>
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
        className="section gradient-background" 
        style={{
          minHeight: '100vh'
        }}
      >
        <div className="container">
          <div className="column is-half is-offset-one-quarter">
            <h1 className="title has-text-white">Edit Role</h1>
            
            <form onSubmit={updateRole} className="box">
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
                </div>
                <p className="help">Role name will be converted to lowercase automatically</p>
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