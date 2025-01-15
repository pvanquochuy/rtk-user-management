import "./App.css";
import UserList from "./components/UserList";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => navigate("/add-user")}>Add User</button>
      <UserList />
    </div>
  );
}

export default App;
