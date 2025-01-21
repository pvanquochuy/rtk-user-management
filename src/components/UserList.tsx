import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import "./UserList.css";
import { User } from "../types/User";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../features/users/userSlice";

const UserList: React.FC = () => {
  const {
    users,
    isLoading,
    isError,
    error,
    page,
    totalPages,
    setPage,
    deleteMutation,
  } = useUsers();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = (user: User) => {
    dispatch(setSelectedUser(user));
    navigate("/add-user");
  };

  const handleDelete = (id?: string) => {
    if (id) {
      deleteMutation.mutate(id);
    } else {
      console.error("User ID is undefined");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
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

      {/* pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default UserList;
