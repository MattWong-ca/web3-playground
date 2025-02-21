import { User } from "@/lib/db";
import { useApiQuery } from "./use-api-query";

export function useUser() {
  return useApiQuery<User>({
    queryKey: ["user-me"],
    url: "/api/users/me",
    isProtected: true,
  });
}
