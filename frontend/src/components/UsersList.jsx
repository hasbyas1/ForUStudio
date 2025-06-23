// frontend/src/components/UsersList.jsx - COMPLETE CODE WITH SIMPLE SEARCH
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useAuth } from '../contexts/AuthContext';
import "../styles/glass-theme.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const { user } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        alert("User deleted successfully!");
        getUsers(); // Refresh list
      } catch (error) {
        console.error('Error deleting user:', error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchMatch = searchTerm === "" || 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toString().includes(searchTerm) ||
      user.phone?.includes(searchTerm);
    
    return searchMatch;
  });

  if (isLoading) {
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
                  <p className="title is-5 text-glass">Loading Users...</p>
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

              {/* Statistics dengan glass effect */}
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

              {/* Search Box - TAMBAHAN BARU */}
              <div className="column is-4">
                <div className="field">
                  <label className="label text-glass">Search Users</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search by name, email, username, role, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>

              {/* Info total users */}
              <div className="bg-glass mb-4" style={{ padding: '1rem' }}>
                <p className="text-glass">
                  Total Users: <strong>{users.length}</strong>
                  {searchTerm && (
                    <span> | Found: <strong>{filteredUsers.length}</strong></span>
                  )}
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
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
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
                                user.role?.roleName === 'client' ? 'is-info' : 'is-light'
                              }`}>
                                {user.role?.roleName || 'No Role'}
                              </span>
                            </td>
                            <td className="text-glass">
                              {user.gender === 'laki-laki' ? '👨 Laki-laki' : 
                              user.gender === 'perempuan' ? '👩 Perempuan' : 
                              '❓ Not Specified'}
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
                                >
                                  <span className="icon">
                                    <i className="fas fa-edit"></i>
                                  </span>
                                </Link>
                                <button 
                                  className="button is-small is-danger"
                                  onClick={() => deleteUser(user.userId, user.username)}
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
                            <div className="notification is-warning">
                              <p>
                                {searchTerm ? `No users found matching "${searchTerm}"` : "No users found."}
                                <Link to="/users/add" className="text-glass-subtitle">Add the first user</Link>
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