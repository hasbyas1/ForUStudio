import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUser] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const response = await axios.get("http://localhost:5000/users");
    setUser(response.data);
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="section">
      <div className="column is-fluid">
        <Link to="add" className="button is-success mb-3">
          Add New
        </Link>
        <div style={{ overflowX: "auto" }}>
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Email</th>
                <th>Username</th>
                <th>Password</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.userId}</td>
                  <td>{user.role?.roleName || "No Role"}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>{user.fullName}</td>
                  <td>{user.gender}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`tag ${user.isActive ? "is-success" : "is-danger"}`}>{user.isActive ? "Active" : "Inactive"}</span>
                  </td>
                  <td>
                    <Link to={`edit/${user.id}`} className="button is-small is-info">
                      Edit
                    </Link>
                    <button onClick={() => deleteUser(user.id)} className="button is-small is-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
