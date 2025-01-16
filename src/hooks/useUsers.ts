import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUsers, deleteUsers, fetchUsers } from "../api/userAPI";
import { User } from "../types/User";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const addMutation = useMutation({
    mutationFn: addUsers,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return { users, isLoading, addMutation, deleteMutation };
};
