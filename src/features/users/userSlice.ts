import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { addUsers, deleteUsers, fetchUsers } from "../../api/userAPI";

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

export const fetchUserAsync = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await fetchUsers();
    return response;
  }
);

export const addUserAsync = createAsyncThunk<User, User>(
  "users/addUserAsync",
  async (newUser: User) => {
    const addedUser = await addUsers(newUser);
    return addedUser;
  }
);

export const deleteUserAsync = createAsyncThunk(
  "users/deleteUserAsync",
  async (id: string) => {
    await deleteUsers(id);
    return id;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      console.log("Updated users:", state.users);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserAsync.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(addUserAsync.fulfilled, (state, action) => {
      state.users.push(action.payload);
      console.log("User added :", action.payload);
    });
    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    });
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
