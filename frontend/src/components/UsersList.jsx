import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
              <p className="title is-5">Loading users...</p>
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
              <h1 className="title">Users Management</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              {/* ✅ Tombol Roles baru */}
              <Link to="/roles" className="button is-info mr-3">
                <span className="icon">
                  <i className="fas fa-user-tag"></i>
                </span>
                <span>Roles</span>
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

        {/* ✅ Tampilkan total users */}
        <div className="notification is-light has-text-dark">
          <p>Total Users: <strong>{users.length}</strong></p>
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
                <th>User ID</th>
                <th>Role</th>
                <th>Email</th>
                <th>Username</th>
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
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>
                      {user.gender === 'laki-laki' ? '👨 Laki-laki' : 
                       user.gender === 'perempuan' ? '👩 Perempuan' : 
                       '❓ Not Specified'}
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`tag ${user.isActive ? "is-success" : "is-danger"}`}>
                        {user.isActive ? "Active" : "Inactive"}
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
                          onClick={() => deleteUser(user.userId, user.fullName)} 
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
                    <div className="notification is-warning">
                      <p>No users found. <Link to="/users/add">Add the first user</Link></p>
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
  );
};

export default UsersList;