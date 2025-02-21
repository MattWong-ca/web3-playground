import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiQueryOptions<TData, TBody = unknown>
  extends Omit<UseQueryOptions<TData>, "queryFn"> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  isProtected?: boolean;
}

export const useApiQuery = <TData, TBody = unknown>(
  options: UseApiQueryOptions<TData, TBody>
) => {
  const { url, method = "GET", body, isProtected = false, ...queryOptions } = options;

  return useQuery<TData>({
    ...queryOptions,
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          ...(isProtected && { Authorization: `Bearer ${token}` }),
          ...(body && { "Content-Type": "application/json" }),
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    },
  });
};
