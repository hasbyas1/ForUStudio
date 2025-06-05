import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./components/UsersList";
import UsersAdd from "./components/UsersAdd";
import EditUser from "./components/UsersEdit";

import RolesList from "./components/RolesList";
import RolesAdd from "./components/RolesAdd";
import RolesEdit from "./components/RolesEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /users */}
        <Route path="/" element={<Navigate to="/users" replace />} />
        
        {/* Users Routes */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/add" element={<UsersAdd />} />
        <Route path="/users/edit/:id" element={<EditUser />} />

        {/* Roles Routes */}
        <Route path="/roles" element={<RolesList />} />
        <Route path="/roles/add" element={<RolesAdd />} />
        <Route path="/roles/edit/:id" element={<RolesEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;