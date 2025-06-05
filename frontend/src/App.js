import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        {/*Users Routes*/}
        <Route path="/" element={<UserList />} />
        <Route path="add" element={<UsersAdd />} />
        <Route path="edit/:id" element={<EditUser />} />

        {/*Roles Routes*/}
        <Route path="roles" element={<RolesList />} />
        <Route path="add" element={<RolesAdd />} />
        <Route path="edit/:id" element={<RolesEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
