import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  // ✅ Update state sesuai dengan field yang ada di UserModel
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("laki-laki");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        const user = response.data;

        // ✅ Set semua field dari response
        setEmail(user.email || "");
        setUsername(user.username || "");
        setPassword(""); // Kosongkan password untuk security
        setFullName(user.fullName || "");
        setGender(user.gender || "laki-laki");
        setPhone(user.phone || "");
        setRoleId(user.roleId || 3);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    const getRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setRoles(response.data);
      } catch (error) {
        console.log("Error fetching roles:", error);
      }
    };

    if (id) {
      getUserById();
      getRoles();
    }
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      // ✅ Kirim data sesuai dengan field UserModel
      const userData = {
        email,
        username,
        fullName,
        gender,
        roleId,
      };

      // ✅ Hanya kirim password jika diisi
      if (password.trim()) {
        userData.password = password;
      }

      // ✅ Hanya kirim phone jika diisi
      if (phone.trim()) {
        userData.phone = phone;
      }

      await axios.patch(`http://localhost:5000/users/${id}`, userData);
      navigate("/");
    } catch (error) {
      console.log("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <h1 className="title">Edit User</h1>
        <form onSubmit={updateUser}>
          {/* Email Field */}
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            </div>
          </div>

          {/* Username Field */}
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            </div>
          </div>

          {/* Password Field */}
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
            </div>
            <p className="help">Leave blank if you don't want to change password</p>
          </div>

          {/* Full Name Field */}
          <div className="field">
            <label className="label">Full Name</label>
            <div className="control">
              <input type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required />
            </div>
          </div>

          {/* Gender Field */}
          <div className="field">
            <label className="label">Gender</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Phone Field */}
          <div className="field">
            <label className="label">Phone</label>
            <div className="control">
              <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number (Optional)" />
            </div>
          </div>

          {/* Role Field */}
          <div className="field">
            <label className="label">Role</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value))}>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-success">
                Update User
              </button>
            </div>
            <div className="control">
              <button type="button" className="button is-light" onClick={() => navigate("/")}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
