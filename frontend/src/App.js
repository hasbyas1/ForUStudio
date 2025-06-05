import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // ← Import dari contexts
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Components
import Login from "./components/Login";
import Register from "./components/Register";

// User Components
import UserList from "./components/UsersList";
import UsersAdd from "./components/UsersAdd";
import EditUser from "./components/UsersEdit";

// Role Components
import RolesList from "./components/RolesList";
import RolesAdd from "./components/RolesAdd";
import RolesEdit from "./components/RolesEdit";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root redirect - akan diarahkan ke /users jika sudah login */}
          <Route path="/" element={<Navigate to="/users" replace />} />
          
          {/* Protected Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/add" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <UsersAdd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/edit/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditUser />
              </ProtectedRoute>
            } 
          />

          {/* Roles Routes - Admin Only */}
          <Route 
            path="/roles" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <RolesList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/roles/add" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <RolesAdd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/roles/edit/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <RolesEdit />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to users untuk authenticated users */}
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;