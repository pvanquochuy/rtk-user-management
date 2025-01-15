import { useEffect } from "react";
import { deleteUserAsync, fetchUserAsync } from "../features/users/userSlice";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import "./UserList.css";

const UserList: React.FC = () => {
  const users = useAppSelector((state) => state.users.users);
  const dispatch = useAppDispatch();

  const handleDelete = (id?: string) => {
    if (id) {
      dispatch(deleteUserAsync(id));
      dispatch(fetchUserAsync());
    } else {
      console.error("User ID is undefined");
    }
  };

  useEffect(() => {
    dispatch(fetchUserAsync());
  }, [dispatch]);

  return (
    <div className="container">
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>
              {user.firstName} {user.lastName} - {user.email}
            </span>
            <button onClick={() => dispatch(() => handleDelete(user.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserList;
