import { User } from "../types/User";

export const fetchPaginatedUsers = async (
  page: number,
  size: number
): Promise<{ users: User[]; totalPages: number }> => {
  const response = await fetch(`http://localhost:3000/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const allUsers: User[] = await response.json();
  const totalUsers = allUsers.length;
  const totalPages = Math.ceil(totalUsers / size);

  const startIndex = (page - 1) * size;
  const paginatedUsers = allUsers.slice(startIndex, startIndex + size);

  return {
    users: paginatedUsers,
    totalPages,
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:3000/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await fetch(`http://localhost:3000/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID: ${id}`);
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

export const updateUsers = async ({
  userId,
  updatedUser,
}: {
  userId: string;
  updatedUser: User;
}): Promise<User> => {
  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const user = await response.json();
  console.log("Updated user response: ", user);
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
