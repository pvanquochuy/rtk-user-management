import { useUsers } from "../hooks/useUsers";
import "./UserList.css";

const UserList: React.FC = () => {
  const { users, isLoading, deleteMutation } = useUsers();

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
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserList;
