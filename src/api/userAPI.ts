import { User } from "../types/User";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:3000/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const addUsers = async (newUser: User): Promise<User> => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error("Failed to add user");
  }

  const user = await response.json();
  console.log("user response: ", user);
  return user;
};

export const deleteUsers = async (id: string): Promise<void> => {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};
