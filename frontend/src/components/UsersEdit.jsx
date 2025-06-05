import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  // ✅ State sesuai dengan field yang ada di UserModel
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("-");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        const user = response.data;

        // ✅ Set semua field dari response
        setEmail(user.email || "");
        setUsername(user.username || "");
        setPassword(""); // Kosongkan password untuk security
        setFullName(user.fullName || "");
        setGender(user.gender || "-");
        setPhone(user.phone || "");
        setRoleId(user.roleId || 3);
        setIsActive(user.isActive !== undefined ? user.isActive : true);
      } catch (error) {
        console.log("Error fetching user:", error);
        alert("Failed to load user data. Please try again.");
        navigate("/");
      } finally {
        setUserLoading(false);
      }
    };

    const getRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setRoles(response.data);
      } catch (error) {
        console.log("Error fetching roles:", error);
        alert("Failed to load roles. Please refresh the page.");
      }
    };

    if (id) {
      getUserById();
      getRoles();
    }
  }, [id, navigate]);

  const updateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Validasi input
      if (!email || !username || !fullName) {
        alert("Please fill all required fields!");
        setIsLoading(false);
        return;
      }

      // ✅ Kirim data sesuai dengan field UserModel
      const userData = {
        email: email.trim(),
        username: username.trim(),
        fullName: fullName.trim(),
        gender,
        roleId: parseInt(roleId),
        isActive,
      };

      // ✅ Hanya kirim password jika diisi
      if (password.trim()) {
        userData.password = password.trim();
      }

      // ✅ Hanya kirim phone jika diisi, atau hapus jika dikosongkan
      if (phone.trim()) {
        userData.phone = phone.trim();
      } else {
        userData.phone = null; // Set null untuk menghapus phone
      }

      console.log("Updating user with data:", userData);

      await axios.patch(`http://localhost:5000/users/${id}`, userData);
      alert("User updated successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error updating user:", error);
      
      // ✅ Handle error response dari backend
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to update user: ${error.response.data.message}`);
      } else {
        alert("Failed to update user. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Loading state saat mengambil data user
  if (userLoading) {
    return (
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <div className="notification is-info">
            <p>Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <h1 className="title">Edit User</h1>
        <form onSubmit={updateUser}>
          {/* Email Field */}
          <div className="field">
            <label className="label">Email *</label>
            <div className="control">
              <input 
                type="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="field">
            <label className="label">Username *</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
                minLength={3}
                maxLength={50}
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input 
                type="password" 
                className="input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Leave blank to keep current password"
                minLength={8}
                maxLength={100}
              />
            </div>
            <p className="help">Leave blank if you don't want to change password</p>
          </div>

          {/* Full Name Field */}
          <div className="field">
            <label className="label">Full Name *</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Full Name" 
                minLength={3}
                maxLength={100}
                required 
              />
            </div>
          </div>

          {/* Gender Field */}
          <div className="field">
            <label className="label">Gender</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="-">Not Specified</option>
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
              <input 
                type="tel" 
                className="input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Phone Number (Optional)"
                pattern="[0-9]{10,13}"
              />
            </div>
            <p className="help">Numbers only, 10-13 digits (optional)</p>
          </div>

          {/* Role Field */}
          <div className="field">
            <label className="label">Role *</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value))}>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Is Active Field */}
          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                {" "}User is active
              </label>
            </div>
            <p className="help">Uncheck to deactivate user account</p>
          </div>

          {/* Buttons */}
          <div className="field is-grouped">
            <div className="control">
              <button 
                type="submit" 
                className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update User'}
              </button>
            </div>
            <div className="control">
              <button 
                type="button" 
                className="button is-light" 
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Info */}
        <div className="notification is-info is-light mt-4">
          <p><strong>Note:</strong></p>
          <ul>
            <li>Fields marked with * are required</li>
            <li>User ID cannot be changed</li>
            <li>Leave password blank to keep current password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditUser;