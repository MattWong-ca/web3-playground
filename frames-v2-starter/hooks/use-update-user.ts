import { useApiMutation } from "./use-api-mutation";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateUserVariables {
  customName: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useApiMutation<void, UpdateUserVariables>({
    url: "/api/users/me",
    method: "PATCH",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-me"] });
    },
  });
}
