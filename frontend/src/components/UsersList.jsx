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
      <div className="section">
        <div className="container">
          <div className="bg-glass has-text-centered" style={{ padding: '2rem', margin: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-spinner fa-spin fa-lg text-glass"></i>
              <p className="title is-5 text-glass">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
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

        {/* Info total users */}
        <div className="bg-glass mb-4" style={{ padding: '1rem' }}>
          <p className="text-glass">
            Total Users: <strong>{users.length}</strong>
          </p>
        </div>

        {/* Table dengan glass effect */}
        <div className="bg-glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
          <div style={{ overflowX: "auto" }}>
            <table className="table is-fullwidth is-hoverable" style={{ backgroundColor: 'transparent' }}>
              <thead>
                <tr>
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
                    <tr key={user.userId} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
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
                        {user.gender === 'M' ? '👨 Male' : 
                         user.gender === 'F' ? '👩 Female' : '❓ Not Set'}
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
  );
};

export default UsersList;