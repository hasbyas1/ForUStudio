// frontend/src/App.js (Updated)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Components
import Login from "./components/Login";
import Register from "./components/Register";

// Dashboard Component
import Dashboard from "./components/Dashboard";

// User Components
import UserList from "./components/UsersList";
import UsersAdd from "./components/UsersAdd";
import EditUser from "./components/UsersEdit";

// Role Components
import RolesList from "./components/RolesList";
import RolesAdd from "./components/RolesAdd";
import RolesEdit from "./components/RolesEdit";

// Project Components
import ProjectsList from "./components/ProjectsList";
import ProjectsAdd from "./components/ProjectsAdd";
import ProjectsEdit from "./components/ProjectsEdit";
import ProjectsView from "./components/ProjectsView";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root redirect - akan diarahkan ke /dashboard jika sudah login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes */}
          
          {/* Dashboard Route - accessible by all authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Project Routes - different access levels */}
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/add" 
            element={
              <ProtectedRoute requireClient={true}>
                <ProjectsAdd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/edit/:id" 
            element={
              <ProtectedRoute>
                <ProjectsEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/view/:id" 
            element={
              <ProtectedRoute>
                <ProjectsView />
              </ProtectedRoute>
            } 
          />
          
          {/* User Routes */}
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
              <ProtectedRoute requireOwnerOrAdmin={true}>
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

          {/* Catch all - redirect to dashboard untuk authenticated users */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;