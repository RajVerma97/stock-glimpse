import { QueryFunctionContext, QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export type QueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey
> = (context: QueryFunctionContext<TQueryKey>) => T | Promise<T>;

export default function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: (
    context: QueryFunctionContext<TQueryKey>,
    axios: AxiosInstance
  ) => TQueryFnData | Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const axios = useAxiosContext();

  return useQuery(
    queryKey,
    (context) => {
      return queryFn(context, axios);
    },
    {
      ...options,
      onError: (err) => {
        // Directly handling errors without using useError
        console.error("Query failed:", err);
        if (options?.onError) options.onError(err);
      },
    }
  );
}
