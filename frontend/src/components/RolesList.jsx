import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/background.css"; // Import your CSS styles
import "../styles/navbar.css"; // Import your CSS styles

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRoles();
  }, []);

  async function getRoles() {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(response.data);
    } catch (error) {
      console.log("Error fetching roles:", error);
      alert("Failed to load roles. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteRole = async (id, roleName) => {
    if (window.confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/roles/${id}`);
        alert("Role deleted successfully!");
        getRoles();
      } catch (error) {
        console.log("Error deleting role:", error);
        if (error.response && error.response.status === 400) {
          alert("Cannot delete role. There are users assigned to this role.");
        } else {
          alert("Failed to delete role. Please try again.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar/>
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
                  <p className="title is-5 text-glass">Loading roles...</p>
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
      <Navbar/>
      <div
        className="gradient-background"
        style={{
          minHeight: '100vh'
        }}
      >
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
          <div className="section">
            <div className="column is-fluid">
              {/* Header dengan glass effect */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title text-glass">
                      <i className="fas fa-user-tag mr-3"></i>
                      Roles Management
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Link to="/users" className="button is-light mr-3">
                      <span className="icon">
                        <i className="fas fa-arrow-left"></i>
                      </span>
                      <span>Back to Users</span>
                    </Link>
                  </div>
                  <div className="level-item">
                    <Link to="/roles/add" className="button is-success">
                      <span className="icon">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span>Add New Role</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Info total roles */}
              <div className="bg-glass mb-4" style={{ padding: '1rem' }}>
                <p className="text-glass">
                  Total Roles: <strong>{roles.length}</strong>
                </p>
              </div>

              {/* Table dengan glass effect */}
              <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="table is-fullwidth is-hoverable" style={{
                    backgroundColor: 'transparent',
                    color: '#e2e8f0'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                        <th className="text-glass">No</th>
                        <th className="text-glass">Role ID</th>
                        <th className="text-glass">Role Name</th>
                        <th className="text-glass">Description</th>
                        <th className="text-glass">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.length > 0 ? (
                        roles.map((role, index) => (
                          <tr key={role.roleId} style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
                          }}>
                            <td className="text-glass">{index + 1}</td>
                            <td>
                              <span className="tag is-primary">{role.roleId}</span>
                            </td>
                            <td>
                              <span className={`tag is-medium ${
                                role.roleName === 'admin' ? 'is-danger' : 
                                role.roleName === 'editor' ? 'is-warning' : 
                                'is-info'
                              }`}>
                                {role.roleName}
                              </span>
                            </td>
                            <td className="text-glass">{role.description}</td>
                            <td>
                              <div className="buttons">
                                <Link 
                                  to={`/roles/edit/${role.roleId}`} 
                                  className="button is-small is-info"
                                  title="Edit Role"
                                >
                                  <span className="icon">
                                    <i className="fas fa-edit"></i>
                                  </span>
                                </Link>
                                <button 
                                  onClick={() => deleteRole(role.roleId, role.roleName)} 
                                  className="button is-small is-danger"
                                  title="Delete Role"
                                  disabled={role.roleName === 'admin'}
                                >
                                  <span className="icon">
                                    <i className="fas fa-trash"></i>
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="has-text-centered">
                            <div className="bg-glass" style={{ padding: '2rem', margin: '1rem' }}>
                              <p className="text-glass">
                                No roles found. <Link to="/roles/add" className="text-glass-subtitle">Add the first role</Link>
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refresh button dengan glass effect */}
              <div className="field is-grouped is-grouped-centered mt-5">
                <div className="control">
                  <button 
                    className="button is-light bg-glass" 
                    onClick={getRoles}
                    disabled={isLoading}
                  >
                    <span className="icon">
                      <i className="fas fa-sync-alt"></i>
                    </span>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RolesList;