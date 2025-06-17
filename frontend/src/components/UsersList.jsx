import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/background.css"; // Import your CSS styles
import "../styles/navbar.css"; // Import your CSS styles

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      alert("Failed to load users. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteUser = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        alert("User deleted successfully!");
        getUsers();
      } catch (error) {
        console.log("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar/>
        <div className="gradient-background"
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
                  <p className="title is-5 text-glass">Loading users...</p>
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
        {/* Floating Shapes Background - Sama seperti gambar 1 */}
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
          {/* Navbar dengan gradient - Sama seperti gambar 1 */}
          <div className="section">
            <div className="column is-fluid">
              {/* Header dengan glass effect */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title text-glass">
                      <i className="fas fa-users mr-3"></i>
                      Users Management
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Link to="/roles" className="button is-info mr-3">
                      <span className="icon">
                        <i className="fas fa-user-tag"></i>
                      </span>
                      <span>Manage Roles</span>
                    </Link>
                  </div>
                  <div className="level-item">
                    <Link to="/users/add" className="button is-success">
                      <span className="icon">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span>Add New User</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Statistics dengan glass effect - Style seperti gambar 2 */}
              <div className="columns mb-5">
                <div className="column">
                  <div className="bg-glass has-text-centered" style={{ padding: '1.5rem' }}>
                    <h4 className="title is-6 text-glass">👑 Admins</h4>
                    <p className="title is-4 text-glass">
                      {users.filter(user => user.role?.roleName === 'admin').length}
                    </p>
                  </div>
                </div>
                <div className="column">
                  <div className="bg-glass has-text-centered" style={{ padding: '1.5rem' }}>
                    <h4 className="title is-6 text-glass">✏️ Editors</h4>
                    <p className="title is-4 text-glass">
                      {users.filter(user => user.role?.roleName === 'editor').length}
                    </p>
                  </div>
                </div>
                <div className="column">
                  <div className="bg-glass has-text-centered" style={{ padding: '1.5rem' }}>
                    <h4 className="title is-6 text-glass">👥 Clients</h4>
                    <p className="title is-4 text-glass">
                      {users.filter(user => user.role?.roleName === 'client').length}
                    </p>
                  </div>
                </div>
                <div className="column">
                  <div className="bg-glass has-text-centered" style={{ padding: '1.5rem' }}>
                    <h4 className="title is-6 text-glass">✅ Active</h4>
                    <p className="title is-4 text-glass">
                      {users.filter(user => user.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info total users */}
              <div className="bg-glass mb-4" style={{ padding: '1rem' }}>
                <p className="text-glass">
                  Total Users: <strong>{users.length}</strong>
                </p>
              </div>

              {/* Table dengan transparan dan style seperti gambar 2 */}
              <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="table is-fullwidth is-hoverable" style={{ 
                    backgroundColor: 'transparent',
                    color: '#e2e8f0'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}>
                        <th className="text-glass">No</th>
                        <th className="text-glass">User ID</th>
                        <th className="text-glass">Username</th>
                        <th className="text-glass">Email</th>
                        <th className="text-glass">Full Name</th>
                        <th className="text-glass">Role</th>
                        <th className="text-glass">Gender</th>
                        <th className="text-glass">Phone</th>
                        <th className="text-glass">Status</th>
                        <th className="text-glass">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={user.userId} style={{ 
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
                              <span className="tag is-primary">{user.userId}</span>
                            </td>
                            <td className="text-glass">
                              <strong>{user.username}</strong>
                            </td>
                            <td className="text-glass">{user.email}</td>
                            <td className="text-glass">{user.fullName}</td>
                            <td>
                              <span className={`tag is-medium ${
                                user.role?.roleName === 'admin' ? 'is-danger' : 
                                user.role?.roleName === 'editor' ? 'is-warning' : 
                                'is-info'
                              }`}>
                                {user.role?.roleName || 'No Role'}
                              </span>
                            </td>
                            <td className="text-glass">
                              {user.gender === 'laki-laki' ? '👨 Not Set' : 
                              user.gender === 'perempuan' ? '👩 Not Set' : 
                              '❓ Not Set'}
                            </td>
                            <td className="text-glass">{user.phone || '-'}</td>
                            <td>
                              <span className={`tag ${user.isActive ? 'is-success' : 'is-danger'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="buttons">
                                <Link 
                                  to={`/users/edit/${user.userId}`} 
                                  className="button is-small is-info"
                                  title="Edit User"
                                >
                                  <span className="icon">
                                    <i className="fas fa-edit"></i>
                                  </span>
                                </Link>
                                <button 
                                  onClick={() => deleteUser(user.userId, user.username)} 
                                  className="button is-small is-danger"
                                  title="Delete User"
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
                          <td colSpan="10" className="has-text-centered">
                            <div className="bg-glass" style={{ padding: '2rem', margin: '1rem' }}>
                              <p className="text-glass">
                                No users found. <Link to="/users/add" className="text-glass-subtitle">Add the first user</Link>
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
                    onClick={getUsers}
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

export default UsersList;