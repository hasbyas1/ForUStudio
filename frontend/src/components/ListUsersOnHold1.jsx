import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({}); // Track password visibility per user

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
    // ✅ Konfirmasi sebelum hapus
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        alert("User deleted successfully!");
        getUsers(); // Refresh list
      } catch (error) {
        console.log("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // ✅ Toggle password visibility untuk user tertentu
  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // ✅ Toggle semua password sekaligus
  const toggleAllPasswords = () => {
    const allVisible = Object.values(showPasswords).every(visible => visible);
    const newState = {};
    users.forEach(user => {
      newState[user.userId] = !allVisible;
    });
    setShowPasswords(newState);
  };

  // ✅ Copy password ke clipboard
  const copyToClipboard = (password, userName) => {
    navigator.clipboard.writeText(password).then(() => {
      alert(`Password for ${userName} copied to clipboard!`);
    }).catch(() => {
      alert("Failed to copy password to clipboard");
    });
  };

  // ✅ Mask password
  const maskPassword = (password) => {
    return '•'.repeat(password.length);
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="section">
        <div className="column is-fluid">
          <div className="notification is-info">
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="column is-fluid">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">👑 Admin Panel - Users Management</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <Link to="add" className="button is-success">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add New User</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Admin Controls */}
        <div className="box">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <p className="subtitle">Total Users: <strong>{users.length}</strong></p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button 
                  className="button is-warning is-small"
                  onClick={toggleAllPasswords}
                  title="Toggle all passwords visibility"
                >
                  <span className="icon">
                    <i className="fas fa-eye"></i>
                  </span>
                  <span>
                    {Object.values(showPasswords).every(visible => visible) ? 'Hide All' : 'Show All'} Passwords
                  </span>
                </button>
              </div>
              <div className="level-item">
                <button 
                  className="button is-light is-small" 
                  onClick={getUsers}
                  disabled={isLoading}
                  title="Refresh user list"
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

        <div style={{ overflowX: "auto" }}>
          <table className="table is-striped is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>No</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Email</th>
                <th>Username</th>
                <th>
                  <span className="icon-text">
                    <span className="icon has-text-danger">
                      <i className="fas fa-lock"></i>
                    </span>
                    <span>Password</span>
                  </span>
                </th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.userId}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="tag is-primary">{user.userId}</span>
                    </td>
                    <td>
                      <span className={`tag ${
                        user.role?.roleName === 'admin' ? 'is-danger' : 
                        user.role?.roleName === 'editor' ? 'is-warning' : 
                        'is-info'
                      }`}>
                        {user.role?.roleName || "No Role"}
                      </span>
                    </td>
                    <td>
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <span>{user.email}</span>
                      </span>
                    </td>
                    <td>
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-user"></i>
                        </span>
                        <span>{user.username}</span>
                      </span>
                    </td>
                    {/* ✅ Password Column dengan Security Features */}
                    <td>
                      <div className="field has-addons">
                        <div className="control">
                          <span className="tag is-light" style={{ fontFamily: 'monospace', minWidth: '120px' }}>
                            {showPasswords[user.userId] ? user.password : maskPassword(user.password)}
                          </span>
                        </div>
                        <div className="control">
                          <button
                            className="button is-small is-ghost"
                            onClick={() => togglePasswordVisibility(user.userId)}
                            title={showPasswords[user.userId] ? "Hide password" : "Show password"}
                          >
                            <span className="icon">
                              <i className={`fas ${showPasswords[user.userId] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </span>
                          </button>
                        </div>
                        {showPasswords[user.userId] && (
                          <div className="control">
                            <button
                              className="button is-small is-ghost"
                              onClick={() => copyToClipboard(user.password, user.fullName)}
                              title="Copy password to clipboard"
                            >
                              <span className="icon">
                                <i className="fas fa-copy"></i>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{user.fullName}</td>
                    <td>
                      {user.gender === 'laki-laki' ? '👨 Laki-laki' : 
                       user.gender === 'perempuan' ? '👩 Perempuan' : 
                       '❓ Not Specified'}
                    </td>
                    <td>
                      {user.phone ? (
                        <span className="icon-text">
                          <span className="icon">
                            <i className="fas fa-phone"></i>
                          </span>
                          <span>{user.phone}</span>
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`tag ${user.isActive ? "is-success" : "is-danger"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="buttons">
                        <Link 
                          to={`edit/${user.userId}`} 
                          className="button is-small is-info"
                          title="Edit User"
                        >
                          <span className="icon">
                            <i className="fas fa-edit"></i>
                          </span>
                        </Link>
                        <button 
                          onClick={() => deleteUser(user.userId, user.fullName)} 
                          className="button is-small is-danger"
                          title="Delete User"
                          disabled={user.role?.roleName === 'admin'} // Protect admin users
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
                  <td colSpan="11" className="has-text-centered">
                    <div className="notification is-warning">
                      <p>No users found. <Link to="add">Add the first user</Link></p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Security Warning */}
        <div className="notification is-warning is-light mt-4">
          <div className="icon-text">
            <span className="icon has-text-warning">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
            <span>
              <strong>Security Notice:</strong> Passwords are visible for administrative purposes. 
              Please ensure this page is only accessed by authorized administrators.
            </span>
          </div>
        </div>

        {/* ✅ Statistics Summary */}
        <div className="columns mt-4">
          <div className="column">
            <div className="notification is-primary is-light">
              <h4 className="title is-6">👑 Admins</h4>
              <p className="title is-4">
                {users.filter(user => user.role?.roleName === 'admin').length}
              </p>
            </div>
          </div>
          <div className="column">
            <div className="notification is-warning is-light">
              <h4 className="title is-6">✏️ Editors</h4>
              <p className="title is-4">
                {users.filter(user => user.role?.roleName === 'editor').length}
              </p>
            </div>
          </div>
          <div className="column">
            <div className="notification is-info is-light">
              <h4 className="title is-6">👥 Clients</h4>
              <p className="title is-4">
                {users.filter(user => user.role?.roleName === 'client').length}
              </p>
            </div>
          </div>
          <div className="column">
            <div className="notification is-success is-light">
              <h4 className="title is-6">✅ Active</h4>
              <p className="title is-4">
                {users.filter(user => user.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;