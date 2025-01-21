import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUsers,
  deleteUsers,
  fetchPaginatedUsers,
  updateUsers,
} from "../api/userAPI";
import { useState } from "react";

export const useUsers = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [size] = useState(5);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchPaginatedUsers(page, size),
    // keepPreviousData: true, // Keeps old data while fetching new data
  });

  console.log("data:", data); // Check the structure of data here

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  console.log("user: ", users);
  console.log("totalPages: ", totalPages);

  const addMutation = useMutation({
    mutationFn: addUsers,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateUsers,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    users,
    isLoading,
    addMutation,
    updateMutation,
    deleteMutation,
    isError,
    error,
    page,
    totalPages,
    setPage,
  };
};
