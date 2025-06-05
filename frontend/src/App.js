import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./components/ListUsers";
import UsersAdd from "./components/UsersAdd";
import EditUser from "./components/UsersEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="add" element={<UsersAdd />} />
        <Route path="edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
