import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserList from "./components/UsersList";
import UsersAdd from "./components/UsersAdd";
import EditUser from "./components/UsersEdit";
import RolesList from "./components/RolesList";
import RolesAdd from "./components/RolesAdd";
import RolesEdit from "./components/RolesEdit";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";

// Import background CSS
import "./styles/background.css";

// Komponen untuk menentukan apakah navbar harus ditampilkan
function AppContent() {
  const location = useLocation();
  
  // Halaman yang tidak memerlukan navbar
  const noNavbarPages = ['/login', '/register', '/'];
  
  // Cek apakah halaman saat ini memerlukan navbar
  const shouldShowNavbar = !noNavbarPages.includes(location.pathname);
  
  // Mock user data - ganti dengan data user yang sebenarnya
  const currentUser = {
    username: 'Admin',
    email: 'admin@forustudio.com',
    role: 'admin'
  };

  return (
    <div className="background-radial-gradient">
      {/* Floating Shapes Background - tampil di semua halaman */}
      <div className="radius-shape-1"></div>
      <div className="radius-shape-2"></div>
      <div className="radius-shape-3"></div>
      <div className="radius-shape-4"></div>
      <div className="radius-shape-5"></div>
      <div className="data-shape-1"></div>
      <div className="data-shape-2"></div>
      <div className="data-shape-3"></div>
      <div className="data-shape-4"></div>

      {/* Navbar - tampil di semua halaman kecuali login/register */}
      {shouldShowNavbar && (
        <Navbar 
          title="ForUStudio" 
          variant="default" // Ubah ini untuk ganti warna navbar
          currentUser={currentUser}
        />
      )}

      {/* Content dengan padding top jika ada navbar */}
      <div className={`content-wrapper ${shouldShowNavbar ? 'with-navbar' : ''}`}>
        <Routes>
          {/* Redirect root ke login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<UsersAdd />} />
          <Route path="/users/edit/:id" element={<EditUser />} />

          {/* Roles Routes */}
          <Route path="/roles" element={<RolesList />} />
          <Route path="/roles/add" element={<RolesAdd />} />
          <Route path="/roles/edit/:id" element={<RolesEdit />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;