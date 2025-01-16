import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import "./UserList.css";
import { User } from "../types/User";

const UserList: React.FC = () => {
  const { users, isLoading, deleteMutation } = useUsers();
  const navigate = useNavigate();

  const handleEdit = (user: User) => {
    navigate("/add-user", { state: user });
    console.log("user data: ", user);
  };

  const handleDelete = (id?: string) => {
    if (id) {
      deleteMutation.mutate(id);
    } else {
      console.error("User ID is undefined");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!users) return <div>No Users found...</div>;

  return (
    <div className="container">
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>
              {user.firstName} {user.lastName} - {user.email}
            </span>
            <div className="btn-div">
              <button onClick={() => handleDelete(user.id)}>Delete</button>
              <button onClick={() => handleEdit(user)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserList;
