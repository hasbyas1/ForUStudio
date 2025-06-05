import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    // ✅ Konfirmasi sebelum hapus
    if (window.confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/roles/${id}`);
        alert("Role deleted successfully!");
        getRoles(); // Refresh list
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

  // ✅ Loading state
  if (isLoading) {
    return (
      <div 
        className="section" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh'
        }}
      >
        <div className="column is-fluid">
          <div className="notification is-white has-text-centered">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-spinner fa-spin fa-lg"></i>
              <p className="title is-5">Loading roles...</p>
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
      <div className="column is-fluid">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">Roles Management</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              {/* ✅ Tombol kembali ke Users */}
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

        {/* ✅ Tampilkan total roles */}
        <div className="notification is-light has-text-dark">
          <p>Total Roles: <strong>{roles.length}</strong></p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            className="table is-striped is-fullwidth is-hoverable"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
            >
            <thead>
              <tr>
                <th>No</th>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, index) => (
                  <tr key={role.roleId}>
                    <td>{index + 1}</td>
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
                    <td>{role.description}</td>
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
                          disabled={role.roleName === 'admin'} // Protect admin role
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
                    <div className="notification is-warning">
                      <p>No roles found. <Link to="/roles/add">Add the first role</Link></p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Refresh button */}
        <div className="field is-grouped is-grouped-centered mt-4">
          <div className="control">
            <button 
              className="button is-light" 
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
  );
};

export default RolesList;